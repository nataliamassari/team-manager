API de Projetos

Esta API é usada para gerenciar projetos, incluindo a criação, leitura, atualização e exclusão de projetos. Ela também permite listar projetos específicos de um usuário autenticado.
Aluna: Natália Massari Ra: 2465221

Tecnologias Utilizadas

Node.js: Ambiente de execução para JavaScript no servidor.
Express: Framework web para Node.js.
Sequelize: ORM para Node.js para trabalhar com bancos de dados SQL.
JWT (JSON Web Token): Biblioteca para autenticação segura.
Joi: Biblioteca para validação de dados.
Docker: Plataforma para criar, implantar e executar aplicações em contêineres, facilitando a consistência e a portabilidade entre diferentes ambientes.

Funcionalidades

Criar novos usuários e times.
Criar novos projetos associados a times.
Listar projetos, times e usuários (apenas por administradores) com suporte a paginação.
Atualizar detalhes de um projeto existente.
Listar projetos e times de um usuário autenticado, com base em seu papel como líder ou membro do time.
Excluir projetos e times com restrição de permissão para líderes.

Requisitos

Node.js e npm instalados
Docker instalado

Configuração

Clone o repositório:
git clone https://github.com/nataliamassari/team-manager.git

Instale as dependências:
npm install

Configure o docker: 
docker run --hostname=b6722590b33a --mac-address=02:42:ac:11:00:02 --env=MYSQL_ROOT_PASSWORD=pw@team --env=MYSQL_DATABASE=team_manager 
--env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin --env=GOSU_VERSION=1.17 --env=MYSQL_MAJOR=8.0 --env=MYSQL_VERSION=8.0.39-1.el9 
--env=MYSQL_SHELL_VERSION=8.0.38-1.el9 --volume=/var/lib/mysql --network=bridge -p 3306:3306 --restart=no --runtime=runc -d mysql:8.0

Inicie o servidor:
npm start

Autenticação

A API utiliza JWT para autenticação. Para acessar os endpoints protegidos, você precisa logar.
Usuário administrador criado ao dar /install
        email: "admin@example.com",
        password: "admin123",
