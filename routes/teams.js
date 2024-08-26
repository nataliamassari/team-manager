var express = require("express");
const { paginationSchema } = require("../schemas/generalSchema");
const {
  teamCreationSchema,
  teamUpdateSchema,
} = require("../schemas/teamSchema");
const { Team, User } = require("../models");
var router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { error, value } = teamCreationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, leaderId } = value;

    const leader = await User.findByPk(leaderId);
    if (!leader) {
      return res
        .status(400)
        .json({ error: "O líder especificado não existe." });
    }

    const team = await Team.create({ name, description, leaderId });
    res.status(201).json({ message: "Time criado com sucesso!", team });
  } catch (error) {
    console.error("Erro ao criar time:", error);
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

    const teams = await Team.findAll({
      limit: limit,
      offset: pageLimit,
    });

    res.json({ message: "Times encontrados!", teams });
  } catch (error) {
    console.error("Erro ao ler times:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { error, value } = teamUpdateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, leaderId } = value;
    const { id } = req.params;

    const leader = await User.findByPk(leaderId);
    if (!leader) {
      return res
        .status(400)
        .json({ error: "O líder especificado não existe." });
    }

    const [updated] = await Team.update(
      { name, description, leaderId },
      {
        where: { id },
      },
    );

    if (updated) {
      const team = await Team.findByPk(id);
      res.json({ message: "Dados do time atualizados com sucesso!", team });
    } else {
      res.status(404).json({ error: "Time não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao atualizar dados do time:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (team) {
      await team.destroy();
      res.status(204).json({ message: "Time deletado com sucesso!" });
    } else {
      res.status(404).json({ error: "Time não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao deletar time:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
