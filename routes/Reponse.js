const express = require('express');
const Reponse = require('../models/Reponse');
const router = express.Router();

// ajout d'une reponse
const moment = require('moment');
router.post('/add' , (req, res)=>{
    const date = moment().format('DD/MM/YYYY [at] HH:mm');
    let ReponseFromreq = req.body;
    let Reponse1 = new Reponse(ReponseFromreq);
    Reponse1.date=date;
    Reponse1.save().then(
        (saved)=>{
            res.send(saved);
        },
        (err)=>{
            res.send(err)
        }
    );
})  
// get all responses
router.get('/getall', (req, res) => {
    Reponse.find().then(
        (Reponse1) => {
            res.send(Reponse1)
        },
        (err) => {
            console.log(err);
        }
    )
});
// delete reponse
router.delete('/delete/:id', (req, res) => {
    id = req.params.id;
    Reponse.findByIdAndDelete({ _id: id }).then(
        (deletedReponse) => {
            console.log(`Reponse ${deletedReponse} deleted`);
            res.send(deletedReponse);
        },
        (err) => {
            res.send(err);
        }
    );
});
// update reponse
router.put('/update/:id', (req, res) => {
    let id = req.params.id;
    let ReponseToUpdate = req.body;

    Reponse.findByIdAndUpdate({ _id: id }, ReponseToUpdate, { new: true }).then(
        (updatedReponse) => {
            res.send(updatedReponse);
        },
        (err) => {
            res.send(err);
        }
    );
});
//get reponse by id question
router.get('/getbyid/:id', (req, res) => {
    let idQuestion = req.params.id;
    Reponse.find({ idQuestion: idQuestion }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})
// delete reponse
router.delete('/delete/:id', (req, res) => {
    id = req.params.id;
    Reponse.findByIdAndDelete({ _id: id }).then(
        (deletedReponse) => {
            console.log(`Reponse ${deletedReponse} deleted`);
            res.send(deletedReponse);
        },
        (err) => {
            res.send(err);
        }
    );
});
// update reponse
router.put('/update/:id', (req, res) => {
    let id = req.params.id;
    let ReponseToUpdate = req.body;

    Reponse.findByIdAndUpdate({ _id: id }, ReponseToUpdate, { new: true }).then(
        (updatedReponse) => {
            res.send(updatedReponse);
        },
        (err) => {
            res.send(err);
        }
    );
});


module.exports = router;