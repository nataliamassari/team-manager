var express = require("express");
const { paginationSchema } = require("../schemas/generalSchema");
const {
  teamCreationSchema,
  teamUpdateSchema,
  teamDeletionSchema,
} = require("../schemas/teamSchema");
const {
  teamMemberCreationSchema,
  teamMemberDeletionSchema,
} = require("../schemas/teamMemberSchema");
const { Op } = require("sequelize"); // importa operadores
const { authenticateToken } = require("../middlewares/authMiddleware");
const { Team, User } = require("../models");
var router = express.Router();

//criar time
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { error, value } = teamCreationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description } = value;
    const leaderId = req.user.id;

    const team = await Team.create({ name, description, leaderId });
    res.status(201).json({ message: "Time criado com sucesso!", team });
  } catch (error) {
    console.error("Erro ao criar time:", error);
    res.status(500).json({ error: error.message });
  }
});
//add membros no time
router.post("/:teamId/member/:userId", authenticateToken, async (req, res) => {
  try {
    const { error, value } = teamMemberCreationSchema.validate(req.params);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { teamId, userId } = value;
    const userIdAccessing = req.user.id;

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: "Time não encontrado." });
    }

    if (userIdAccessing !== team.leaderId) {
      return res.status(403).json({
        error: "Você não tem permissão para adicionar membros a este time.",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const isMember = await team.hasMember(user);
    if (isMember) {
      return res.status(400).json({ error: "Usuário já é membro deste time." });
    }

    await team.addMember(user);

    res
      .status(200)
      .json({ message: "Usuário adicionado ao time com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar usuário ao time:", error);
    res.status(500).json({ error: error.message });
  }
});
//remove membros do time
router.delete("/:teamId/member/:id", authenticateToken, async (req, res) => {
  try {
    const { error, value } = teamMemberDeletionSchema.validate({
      teamId: req.params.teamId,
      userId: req.params.id,
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { teamId, userId } = value;
    const userIdAccessing = req.user.id;

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: "Time não encontrado." });
    }

    if (userIdAccessing !== team.leaderId) {
      return res.status(403).json({
        error: "Você não tem permissão para remover membros deste time.",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await team.removeMember(user);

    res.status(200).json({ message: "Usuário removido do time com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover usuário do time:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});
//paginacao dos times
router.get("/read", authenticateToken, async (req, res) => {
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
//ver meus times
router.get("/my-teams", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const teams = await Team.findAll({
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
      where: {
        [Op.or]: [
          { leaderId: userId },
          {
            [Op.and]: [
              {
                "$Members.id$": userId,
              },
            ],
          },
        ],
      },
    });

    res.json({ message: "Times pertencentes encontrados.", teams });
  } catch (error) {
    console.error("Erro ao ler times:", error);
    res.status(500).json({ error: error.message });
  }
});
//alterar informacoes do time
router.put("/update/:id", authenticateToken, async (req, res) => {
  try {
    const { error, value } = teamUpdateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description } = value;
    const { id } = req.params;
    const userId = req.user.id;

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: "Time não encontrado." });
    }

    if (userId !== team.leaderId) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para atualizar este time." });
    }

    const [updated] = await Team.update(
      { name, description },
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
//deletar time
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const { error, value } = teamDeletionSchema.validate({
      userId: req.params.id,
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = value;
    const team = await Team.findByPk(id);
    const userId = req.user.id;

    if (!team) {
      return res.status(404).json({ error: "Time não encontrado." });
    }

    if (userId !== team.leaderId) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para deletar este time." });
    }
    await team.destroy();
    res.status(204).json({ message: "Time deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar time:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
