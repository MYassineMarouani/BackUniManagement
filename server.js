const express = require('express');
const app = express();
const cors = require('cors');
require('./Config/db_config');
app.use(express.json());
app.use(cors());
const EtudiantApi = require('./routes/Etudiant');
const QuestionApi = require('./routes/Question');
const EnseignantApi = require('./routes/Enseignant');
const ClasseApi = require('./routes/Classe');
const AdminApi = require('./routes/Admin');
const ReponseApi = require('./routes/Reponse');
app.use('/Etudiant' , EtudiantApi);
app.use('/Classe' , ClasseApi);
app.use('/Admin' , AdminApi);
app.use('/Question' , QuestionApi);
app.use('/Reponse' , ReponseApi);
app.use('/Enseignant' , EnseignantApi);
app.use('/getimage' , express.static('./Images'));
// app.use('/Seance' , SeanceApi);
app.listen(3000, () => {
    console.log('server works!');
})

