var express = require("express");
const { paginationSchema } = require("../schemas/generalSchema");
const {
  projectCreationSchema,
  projectUpdateSchema,
} = require("../schemas/projectSchema");
const { Project, Team } = require("../models");
var router = express.Router();

router.post("/create", async (req, res) => {
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

router.put("/update/:id", async (req, res) => {
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

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (project) {
      await project.destroy();
      res.status(204).json({ message: "Projeto deletado com sucesso!" });
    } else {
      res.status(404).json({ error: "Projeto não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao deletar projeto:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
