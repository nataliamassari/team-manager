var express = require("express");
const { paginationSchema } = require("../schemas/generalSchema");
const {
  userCreationSchema,
  userUpdateSchema,
} = require("../schemas/userSchema");
const { User } = require("../models");
const {
  authenticateToken,
  authenticateAdmin,
} = require("../middlewares/authMiddleware");
const { Sequelize } = require("sequelize");
var router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { error, value } = userCreationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password } = value;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "O e-mail já está em uso." });
    }

    const user = await User.create({ username, email, password });
    res.status(201).json({ message: "Usuário criado com sucesso!", user });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/create-admin",
  authenticateToken,
  authenticateAdmin,
  async (req, res) => {
    try {
      const { error, value } = userCreationSchema.validate(req.body);
      const isAdmin = true;

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { username, email, password } = value;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "O e-mail já está em uso." });
      }

      const user = await User.create({ username, email, password, isAdmin });
      res
        .status(201)
        .json({ message: "Usuário administrador criado com sucesso!", user });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

router.get("/read", authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { error, value } = paginationSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { limit, page } = value;
    const pageLimit = (page - 1) * limit;

    const users = await User.findAll({
      limit: limit,
      offset: pageLimit,
    });

    res.json({ message: "Usuários encontrados!", users });
  } catch (error) {
    console.error("Erro ao ler usuários:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put(
  "/update/:id",
  authenticateToken,
  authenticateAdmin,
  async (req, res) => {
    try {
      const { error, value } = userUpdateSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id } = req.params;
      const { username, email, password } = value;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const userId = req.user.id;
      const isAdmin = req.user.isAdmin;

      if (userId !== id && !isAdmin) {
        return res.status(403).json({
          error: "Acesso negado. Você só pode atualizar sua própria conta.",
        });
      }

      if (email && email !== user.email) {
        const existingUser = await User.findOne({
          where: {
            email,
            id: { [Sequelize.Op.ne]: id },
          },
        });

        if (existingUser) {
          return res.status(400).json({ error: "O e-mail já está em uso." });
        }
      }

      await user.update({
        username: username !== undefined ? username : user.username,
        email: email !== undefined ? email : user.email,
        password: password !== undefined ? password : user.password,
      });

      res.json({ message: "Dados atualizados com sucesso!", user });
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "O e-mail já está em uso." });
      }
      res.status(500).json({ error: error.message });
    }
  },
);

router.delete(
  "/delete/:id",
  authenticateToken,
  authenticateAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const user = await User.findByPk(id);
      if (user) {
        if (userId === id || user.isAdmin === false) {
          await user.destroy();
          res.status(204).json({ message: "Usuário deletado com sucesso!" });
        } else {
          res
            .status(404)
            .json({ error: "Não é possível deletar outro administrador." });
        }
      } else {
        res.status(404).json({ error: "Usuário não encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

module.exports = router;
