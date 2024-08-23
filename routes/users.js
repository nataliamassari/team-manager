var express = require('express');
const { User } = require('../models');
var router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    if (username && email && password !== undefined && typeof isAdmin === 'boolean') {
      let user = await User.create({ username, email, password, isAdmin });
      res.status(201).json(user);
    } else {
      res.status(400).json({ error: "Dados inválidos. Verifique todos os campos." });
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    if (username || email || password ) {
      const [updated] = await User.update(
        { username, email, password },
        {
          where: { id },
        }
      );

      if (updated) {
        const user = await User.findByPk(id);
        res.json(user);
      };
    } else {
      res.status(400).json({ error: "Dados inválidos. Verifique todos os campos." });
    }
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    res.status(500).json({ error: error.message });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Usuário não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
