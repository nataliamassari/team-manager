var express = require('express');
const { Project } = require('../models');
var router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { name, description, teamId } = req.body;

    if (name) {
      let project = await Project.create({ name, description, teamId });
      res.status(201).json(project);
    } else {
      res.status(400).json({ error: "Dados inválidos. Verifique todos os campos." });
    }
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, teamId } = req.body;

    if (name || description || teamId ) {
      const [updated] = await Project.update(
        { name, description, teamId },
        {
          where: { id },
        }
      );

      if (updated) {
        const project = await Project.findByPk(id);
        res.json(project);
      };
    } else {
      res.status(400).json({ error: "Dados inválidos. Verifique todos os campos." });
    }
  } catch (error) {
    console.error('Erro ao atualizar dados do projeto:', error);
    res.status(500).json({ error: error.message });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const project = await Project.findByPk(id);
    if (project) {
      await project.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Projeto não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
