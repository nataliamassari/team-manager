var express = require('express');
const { Team } = require('../models');
var router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { name, description, leaderId } = req.body;

    if (name && leaderId) {
      let team = await Team.create({ name, description, leaderId });
      res.status(201).json(team);
    } else {
      res.status(400).json({ error: "Dados inválidos. Verifique todos os campos." });
    }
  } catch (error) {
    console.error('Erro ao criar time:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, leaderId } = req.body;

    if (name || description || leaderId ) {
      const [updated] = await Team.update(
        { name, description, leaderId },
        {
          where: { id },
        }
      );

      if (updated) {
        const team = await Team.findByPk(id);
        res.json(team);
      };
    } else {
      res.status(400).json({ error: "Dados inválidos. Verifique todos os campos." });
    }
  } catch (error) {
    console.error('Erro ao atualizar dados do time:', error);
    res.status(500).json({ error: error.message });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const team = await Team.findByPk(id);
    if (team) {
      await team.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Time não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
