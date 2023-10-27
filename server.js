const express = require('express');
const dayjs = require('dayjs');
const dotenv = require('dotenv');
const students = require('./Data/students');
const { formatDate } = require('./utils');

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static('assets'));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

// Route pour ajouter un étudiant
app.post('/add-student', (req, res) => {
    const { name, birth } = req.body;

    // Validation pour le champ 'name': uniquement des lettres et des espaces
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name || !name.match(nameRegex)) {
        res.redirect('/?error=Veuillez entrer un nom valide (uniquement des lettres et des espaces).');
        return;
    }

    // Vérification pour s'assurer que la date de naissance n'est pas dans le futur
    const currentDate = dayjs();
    const birthDate = dayjs(birth);
    if (birthDate.isAfter(currentDate)) {
        res.redirect('/?error=La date de naissance ne peut pas être supérieure à la date actuelle.');
        return;
    }

    students.push({ name, birth });
    res.redirect('/users');
});

// Route pour afficher les étudiants
app.get('/users', (req, res) => {
    let userList = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="/css/style.css">
        <title>Liste des utilisateurs</title>
    </head>
    <body>
        <div class="navbar">
            <a href="/">Home</a>
            <span>|</span>
            <a href="/users">[ Users ]</a>
        </div> 

        <div class="container">
            <div class="list-container">
                <h2>Liste des étudiants:</h2>
                <table>
                    <tr>
                        <th>Nom</th>
                        <th>Date de naissance</th>
                        <th>Supprimer</th>
                    </tr>`;
    
                    students.forEach((student, index) => {
                        userList += `
                            <tr>
                                <td>${student.name}</td>
                                <td>${formatDate(student.birth)}</td>
                                <td class="delete-button-cell"><a href="/delete-student/${index}">[X]</a></td>
                            </tr>`;
                    });
    
    userList += `
                </table>
            </div>
        </div>
    </body>
    </html>`;
    res.send(userList);
});

// Route pour supprimer un étudiant
app.get('/delete-student/:index', (req, res) => {
    const { index } = req.params;
    students.splice(index, 1);
    res.redirect('/users');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
