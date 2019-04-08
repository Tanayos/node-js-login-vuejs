const jwt = require('jsonwebtoken');

// BIENVENUE DANS VERIFYTOKEN MON MIDDLEWARE BY MoHaMeD
function verifyToken(req,res,next){
    // recuperation du token pour pouvoir verifiez faire un console log au cas ou =>
    let token = req.headers.authorization.split(' ')[1];
    // Comme pour Users.js je ne vais pas me repeter =>
    let appData = {};
    //Donc si il y'a un token
    if(token){
        //console.log(process.env.SECRET_KEY)
        // JsonWebToken prend en premier parametre le token en deuxieme la clef Secret ;) =>
        jwt.verify(token, process.env.SECRET_KEY, function(err){
            // On gere l'erreur =>
            console.log(err)
            if(err){
                appData.error = 1;
                appData["data"] = "Token Invalid";
                res.sendStatus(403).json(appData)


            }
            // Tu passe à la suite on tourne la page =>
            else{
                next()
            }
        })

    }
    // Alors si il y'a pas de token envoie un message d'erreur =>
    else {
        appData.error = 1;
        appData["data"] = 'SEND TOKEN !!!';
        res.status(403).json(appData);
    }
}

module.exports = verifyToken;