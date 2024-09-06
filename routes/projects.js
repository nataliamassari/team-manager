var express = require("express");
const { paginationSchema } = require("../schemas/generalSchema");
const {
  projectCreationSchema,
  projectUpdateSchema,
  projectDeletionSchema,
} = require("../schemas/projectSchema");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { Op } = require("sequelize"); // importa operadores
const { Project, Team, User } = require("../models");
var router = express.Router();

router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { error, value } = projectCreationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, teamId } = value;

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(400).json({ error: "O time especificado não existe." });
    }

    const project = await Project.create({ name, description, teamId });
    res.status(201).json({ message: "Projeto criado com sucesso!", project });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/read", async (req, res) => {
  try {
    const { error, value } = paginationSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { limit, page } = value;
    const pageLimit = (page - 1) * limit;

    const projects = await Project.findAll({
      limit: limit,
      offset: pageLimit,
    });

    res.json({ message: "Projetos encontrados!", projects });
  } catch (error) {
    console.error("Erro ao ler projetos:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:id", authenticateToken, async (req, res) => {
  try {
    const { error, value } = projectUpdateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, teamId } = value;
    const { id } = req.params;

    if (teamId) {
      const team = await Team.findByPk(teamId);
      if (!team) {
        return res
          .status(400)
          .json({ error: "O time especificado não existe." });
      }
    }

    const [updated] = await Project.update(
      { name, description, teamId },
      {
        where: { id },
      },
    );

    if (updated) {
      const project = await Project.findByPk(id);
      res.json({ message: "Projeto atualizado com sucesso!", project });
    } else {
      res.status(404).json({ error: "Projeto não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/my-projects", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.findAll({
      include: [
        {
          model: Team,
          as: "Team",
          include: [
            {
              model: User,
              as: "Leader",
              attributes: ["id", "username"],
              required: true,
            },
            {
              model: User,
              as: "Members",
              attributes: ["id", "username"],
              through: { attributes: [] },
              required: false,
            },
          ],
          required: true,
        },
      ],
      where: {
        [Op.or]: [
          { "$Team.leaderId$": userId },
          {
            [Op.and]: [
              {
                "$Team.Members.id$": userId,
              },
            ],
          },
        ],
      },
    });

    res.json({ message: "Projetos pertencentes encontrados.", projects });
  } catch (error) {
    console.error("Erro ao ler projetos:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:projectId", authenticateToken, async (req, res) => {
  try {
    const { error, value } = projectDeletionSchema.validate(req.params);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { projectId } = value;
    const userId = req.user.id;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado." });
    }

    const team = await Team.findByPk(project.teamId);
    if (!team) {
      return res
        .status(404)
        .json({ error: "Time associado ao projeto não encontrado." });
    }

    if (userId !== team.leaderId) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para deletar este projeto." });
    }

    await project.destroy();

    res.status(204).json({ message: "Projeto deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar projeto:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

module.exports = router;
