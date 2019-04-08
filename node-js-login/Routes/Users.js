const express = require('express');
const users = express.Router();
const database = require('../Database/database');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Verify token est un middleware pour protéger certaines routes =>
const verfyToken = require('../Utils/auth');
//-------------------------------------------------------------

users.use(cors());
process.env.SECRET_KEY = "fdzfzrfrefref575645E53DGGHHG443325643";
// REGISTER !!!!!! Youpi
users.post('/register', (req,res)=>{
    // variable today donc la date du jour  pour être inseré en base de donnée =>
    var today = new Date();
    // appData pour la gestion des requete si la requete est bonne ou pas =>
    let appData = {
        "error": 1,
        "data": "",
    };
    // Initialisation des variable pour ne pas se repéter =>
    let userData = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "password": req.body.password,
        "created": today,

    };
    // Connection à la base de donnée =>
    database.connection.getConnection(function(err, connection) {
        // Gestion de l'erreur =>
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            console.log(userData.email);
            //ON RECUPERE L'EMAIL pour pouvoir faire le tries de ce que l'utilisateur a rentré =>
            connection.query('SELECT * FROM users WHERE email = ?', userData.email, function(err, rows, fields) {
                console.log(rows)
                // Si cela correspond a quelque chose en base =>
                if(!rows.length){
                    console.log('Toto !!!!')
                    // Bcrypt entre en jeu on lui envoie le mots de passe de l'utilisateur =>
                    bcrypt.hash(userData.password, 10, (err, hash)=>{
                        userData.password = hash
                        const insertUser = 'INSERT INTO users SET ?';
                        // Une fois que le mots de passe est crypté par Bcrypt on  l'insert dans la base =>
                        connection.query(insertUser, userData, function(err, rows, fields) {
                            // Je gére le succés de la requete =>
                            if (!err) {
                                appData.error = 0;
                                appData["data"] = "User registered successfully!";
                                res.status(201).json(appData);
                            }
                            // Je gére l'erreur de la requete si cela echoue =>
                            else {
                                appData["data"] = "Error Occured!";
                                res.status(400).json(appData);
                            }
                        });

                    })
                }
            })

            connection.release();
        }
    });
});
// LOGIN !!!!!!! *_*
users.post('/login',(req,res)=>{
    // appData pour la gestion des requête =>
    let appData = {};
    let email = req.body.password;
    let password = req.body.password;
    // Connection à la base de donnée =>
    database.connection.getConnection((err, connection)=>{
        // Je gére l'erreur ;)
        if(err){
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        }else {
            // On selectionne l'email  l'user a partir de l'email =>
            const selectEmail ='SELECT * FROM users WHERE email = ?'
            connection.query(selectEmail, req.body.email, function(err, rows, fields) {
                //console.log(rows) // Pour voir la requete complete
                // Je gere encore une fois l'erreur si l'email ne correspond à rien en base de donnée =>
                if(err){
                    appData.error = 1;
                    appData["data"] = "Error Occured!";
                    res.status(500).json(appData);
                }else{
                    // donc si cela correspond on devrais avoir un tableau plus grands que zero =>
                    if(rows.length > 0){
                        console.log('Password:', rows[0].password); // <= Mots de passe stocker en base
                        console.log(password); // <= Mots de passe entrez par l'utilisateur
                        //Bcrypt compare sert à comparer le mots de passe entré par l'user sans le cryptage  avec celui stocker en base qui est crypté =>
                        bcrypt.compare(password, rows[0].password, function(err, response) {
                            //On gere l'erreur si toute fois l'erreur venait à arriver =>
                            if(err){
                                appData.error = 1;
                                appData["data"] = "Mots de passe ne correspond pas";
                                res.status(403).json(appData);
                            }else{
                                // ici bcrypt nous retourne soit une valeur booleen lors de la comparaison
                                // donc si cela est false, je lui dis de nous retourner une erreur 403
                                // Pas de place à l'erreur =>
                                if(response == false){
                                console.log(response);
                                appData.error = 1;
                                appData["data"] = "Mots de passe ne correspond pas";
                                res.status(403).json(appData);

                                }
                                // Ici la reponse et true =>
                                else{
                                    console.log('response', response);
                                    // JsonWebToken entre en jeu on lui passe un object avec l'email et une iat qui correspond à la date actuelle - 50s
                                    // Le deuxieme parametre c'est la clef secret ;)  reste entre nous et le troixieme parametre c'est l'expiration =>
                                    let token = jwt.sign({ users: rows[0].email, iat: Math.floor(Date.now() / 1000) - 50 }, process.env.SECRET_KEY,{
                                        expiresIn: "2 days"
                                    });
                                    // Gestion du succés on retourne le avec l'email associé au token ainsi que le token =>
                                    appData.error = 0;
                                    appData["Name"] = rows[0].first_name;
                                    appData["User"] = rows[0].email;
                                    appData["token"] = token;
                                    res.status(200).json(appData);
                                }
                            }
                        })

                    }
                    // si l'email n'existe pas on retourne en json l'email n'existe pas et un status 403 parce qu'on aime bien sa =>
                    else {
                        appData.error = 1;
                        appData["data"] = "Email n'existe pas !";
                        res.status(403).json(appData);
                    }
                }
            });
            connection.release();
        }
    });


});

// Pour faire des test en get
/**
 *
 users.get('/getUsers', function(req, res) {

     var appData = {
         "email": req.body.email,
        };

        database.connection.getConnection(function(err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                console.log(appData)
                connection.query('SELECT * FROM users WHERE email = ?', appData.email ,function(err, rows, fields) {
                    if (!err) {
                        appData["error"] = 0;
                        appData["data"] = rows;
                        res.status(200).json(appData);
                    } else {
                        appData["data"] = "No data found";
                        res.status(204).json(appData);
                    }
                });
                connection.release();
            }
        });
    });

    */

 module.exports = users;

