require("dotenv").config();
var express = require("express");
const { User, Team, Project, TeamMember, sequelize } = require("../models");
const jwt = require("jsonwebtoken");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ count: 0, lista: [] });
  res.render("index", { title: "Express" });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        auth: false,
        token: null,
        error: "Usuário ou senha incorretos.",
      });
    }

    if (password !== user.password) {
      return res.status(400).json({
        auth: false,
        token: null,
        error: "Usuário ou senha incorretos.",
      });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    res.json({
      auth: true,
      token: token,
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({
      auth: false,
      token: null,
      error: "Erro ao realizar login, tente novamente mais tarde.",
    });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");

    res.json({
      auth: false,
      message: "Logout realizado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao realizar logout:", error);
    res.status(500).json({
      auth: false,
      error: "Erro ao realizar logout, tente novamente mais tarde.",
    });
  }
});

router.get("/install", async function (req, res, next) {
  try {
    //p/ deixar dropar a tabela
    await sequelize.query("SET foreign_key_checks = 0;");

    await Project.sync({ force: true });
    await Team.sync({ force: true });
    await User.sync({ force: true });
    await TeamMember.sync({ force: true });

    const users = [
      {
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        isAdmin: true,
      },
      {
        username: "user1",
        email: "user1@example.com",
        password: "user123",
        isAdmin: false,
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: "user123",
        isAdmin: false,
      },
      {
        username: "user3",
        email: "user3@example.com",
        password: "user123",
        isAdmin: false,
      },
      {
        username: "user4",
        email: "user4@example.com",
        password: "user123",
        isAdmin: false,
      },
      {
        username: "user5",
        email: "user5@example.com",
        password: "user123",
        isAdmin: false,
      },
      {
        username: "user6",
        email: "user6@example.com",
        password: "user123",
        isAdmin: false,
      },
    ];

    const teams = [
      { name: "Team A", leaderId: 1 },
      { name: "Team B", leaderId: 2 },
      { name: "Team C", leaderId: 3 },
      { name: "Team D", leaderId: 4 },
      { name: "Team E", leaderId: 5 },
    ];

    const projects = [
      {
        name: "Project 1",
        description: "Description for Project 1",
        teamId: 1,
      },
      {
        name: "Project 2",
        description: "Description for Project 2",
        teamId: 2,
      },
      {
        name: "Project 3",
        description: "Description for Project 3",
        teamId: 3,
      },
      {
        name: "Project 4",
        description: "Description for Project 4",
        teamId: 4,
      },
      {
        name: "Project 5",
        description: "Description for Project 5",
        teamId: 5,
      },
    ];

    await User.bulkCreate(users);
    await Team.bulkCreate(teams);
    await Project.bulkCreate(projects);

    await sequelize.query("SET foreign_key_checks = 1;");

    res
      .status(200)
      .json({ message: "Banco de dados instalado e populado com sucesso!" });
  } catch (error) {
    console.error("Erro ao instalar o banco de dados:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
