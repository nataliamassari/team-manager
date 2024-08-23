var express = require('express');
const { User, Team, Project, sequelize } = require('../models');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({count: 0, lista: [] })
  res.render('index', { title: 'Express' });
});

router.get('/install', async function(req, res, next) {
  try {
    //p/ deixar dropar a tabela
    await sequelize.query('SET foreign_key_checks = 0;');
    
    await Project.sync({ force: true });
    await Team.sync({ force: true });
    await User.sync({ force: true });

    const users = [
      { username: 'admin', email: 'admin@example.com', password: 'admin123', isAdmin: true },
      { username: 'user1', email: 'user1@example.com', password: 'user123', isAdmin: false },
      { username: 'user2', email: 'user2@example.com', password: 'user123', isAdmin: false },
      { username: 'user3', email: 'user3@example.com', password: 'user123', isAdmin: false },
      { username: 'user4', email: 'user4@example.com', password: 'user123', isAdmin: false }
    ];

    const teams = [
      { name: 'Team A', leaderId: 1 },
      { name: 'Team B', leaderId: 2 },
      { name: 'Team C', leaderId: 3 },
      { name: 'Team D', leaderId: 4 },
      { name: 'Team E', leaderId: 5 }
    ];

    const projects = [
      { name: 'Project 1', description: 'Description for Project 1', teamId: 1 },
      { name: 'Project 2', description: 'Description for Project 2', teamId: 2 },
      { name: 'Project 3', description: 'Description for Project 3', teamId: 3 },
      { name: 'Project 4', description: 'Description for Project 4', teamId: 4 },
      { name: 'Project 5', description: 'Description for Project 5', teamId: 5 }
    ];

    await User.bulkCreate(users);
    await Team.bulkCreate(teams);
    await Project.bulkCreate(projects);

    await sequelize.query('SET foreign_key_checks = 1;');

    res.status(200).json({ message: 'Banco de dados instalado e populado com sucesso!' });
  } catch (error) {
    console.error('Erro ao instalar o banco de dados:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
