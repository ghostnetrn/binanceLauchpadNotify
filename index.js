require("dotenv").config(); // Carrega as variáveis do arquivo .env
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const dataFilePath = path.join(__dirname, "projects_data.json");

// Configuração do serviço de email
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: accessToken,
  },
});

async function extractData() {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: [
      "--no-sandbox", // you can also use '--start-fullscreen'
      "--start-maximized",
    ],
  });
  const page = await browser.newPage();

  await page.goto("https://launchpad.binance.com/pt-BR/viewall/lp");

  // Aguardar até que os projetos sejam carregados
  await page.waitForSelector('[name="lp-single-project"]');

  // Extrair os dados
  const projects = await page.evaluate(() => {
    const projectsList = [];
    const projectsElements = document.querySelectorAll(
      '[name="lp-single-project"]'
    );

    projectsElements.forEach((projectElement) => {
      const projectName = projectElement
        .querySelector(".css-13to1co img")
        .alt.trim();
      const status = projectElement
        .querySelector('[data-bn-type="text"]')
        .innerText.trim();
      projectsList.push({ projectName, status });
    });

    return projectsList;
  });

  // Salvar os dados em um arquivo JSON
  await saveDataToFile(projects);

  console.log("Dados salvos em projects_data.json");

  await browser.close();
}

async function saveDataToFile(projects) {
  try {
    let existingProjects = [];
    try {
      const existingData = await fs.readFile(dataFilePath, "utf8");
      existingProjects = JSON.parse(existingData);
    } catch (error) {
      console.log("Arquivo de dados não encontrado. Um novo será criado.");
    }

    const newData = projects.filter(
      (project) =>
        !existingProjects.some(
          (existingProject) =>
            existingProject.projectName === project.projectName
        )
    );

    if (newData.length > 0) {
      const updatedProjects = [...existingProjects, ...newData];
      await fs.writeFile(
        dataFilePath,
        JSON.stringify(updatedProjects, null, 2)
      );
      newData.forEach((project) => {
        console.log(
          `1 novo projeto adicionado: ${project.projectName} - ${project.status}`
        );
        sendEmail(project.projectName, project.status);
      });
    } else {
      console.log("Nenhum novo projeto encontrado.");
    }
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
  }
}

function sendEmail(projectName, status) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.DEST_EMAIL,
    subject: "Novo Projeto Adicionado",
    text: `Um novo projeto foi adicionado: ${projectName} - ${status}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar o email:", error);
    } else {
      console.log("Email enviado:", info.response);
    }
  });
}

async function runScript() {
  await extractData();

  // Verificar a cada 24 horas
  setInterval(async () => {
    await extractData();
  }, 24 * 60 * 60 * 1000);
}

runScript();
