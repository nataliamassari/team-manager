const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('team-manager', 'root', 'pw@team', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexão estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });

module.exports = sequelize;
