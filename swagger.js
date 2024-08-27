const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./routes/index.js",
  "./routes/projects.js",
  "./routes/teams.js",
  "./routes/users.js",
];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  require("./app.js");
});
