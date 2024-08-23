const sequelize = require('../config/database');
const User = require('./user');
const Team = require('./team');
const Project = require('./project');

// relacionamento entre os modelos
User.hasMany(Team, { foreignKey: 'leaderId' });
Team.belongsTo(User, { as: 'leader', foreignKey: 'leaderId' });

User.belongsToMany(Team, { through: 'TeamMember', foreignKey: 'userId' });
Team.belongsToMany(User, { through: 'TeamMember', foreignKey: 'teamId' });

Team.hasMany(Project, { foreignKey: 'teamId' });
Project.belongsTo(Team, { foreignKey: 'teamId' });

module.exports = {
  sequelize,
  User,
  Team,
  Project
};
