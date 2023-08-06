const express = require('express');
const router = express.Router();
const Classe = require('../models/classe');

router.post('/add', async (req, res) => {
    try {
        const { nom } = req.body;

        const classe = new Classe({
            nom,
        });

        await classe.save();

        return res.status(201).json(classe);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});
router.put('/update/:id', async (req, res) => {
    try {
        const updatedClasse = await Classe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedClasse) {
            return res.status(404).json({ error: 'Classe not found' });
        }

        return res.status(200).json(updatedClasse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});
router.get('/getclassebyidetudiant/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const classe = await Classe.findOne({ 'GroupeEtudiants.id': id });

        if (!classe) {
            return res.status(404).json({ msg: 'Classe not found' });
        }

        return res.status(200).json(classe);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});
router.get('/getall', (req, res) => {
    Classe.find().then(
        (classe) => {
            res.send(classe)
        },
        (err) => {
            console.log(err);
        }
    )
});
router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id;
    Classe.findOne({ _id: id }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})
module.exports = router;
