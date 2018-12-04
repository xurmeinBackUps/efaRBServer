var jwt = require('jsonwebtoken');
var sequelize = require('../db');
var User = sequelize.import('../models/user');

module.exports = function(req, res, next){
    if(req.method == 'OPTIONS'){
        next();
        } else {
        let sessionToken = req.headers.authorization;
        console.log(sessionToken);
            if (!sessionToken) return res.status(403).send({ authorized: false, message: 'No token provided.' });
            let Admin = req.body.user.is_admin;
            let AdminID = req.body.user.adminID;
            console.log(`(${AdminID}) is a store owner?: ${Admin}`);
            if(Admin === true){
                jwt.verify(adminToken, process.env.SIGN, (err, decoded) => {
                if(decoded){
                    User.findOne({where: {AdminID: decoded.AdminID}}).then(admin => {
                    req.user = admin;
                    }).then(jwt.verify(sessionToken, process.env.SIGN, (err, decoded) => {
                        if(decoded){
                            User.findOne({where: { id: decoded.id}})
                            .then(admin => {
                                req.user = admin;
                                next();
                            }, 
                            function(){ res.status(401).send({error: 'Not authorized'}) } 
                        )}
                    }) 
                )} else { res.status(400).send({error: 'Not authorized'}) };
            })}
            else if(Admin !== true){
                jwt.verify(sessionToken, process.env.SIGN, (err, decoded) => {
                    if(decoded){
                        User.findOne({
                            where: { id : decoded.id }
                        }).then(user => {
                            req.user = user;
                            next();
                            },
                            function(){
                                res.status(401).send({error: 'Not authorized'});
                            });
                        } else {
                            res.status(400).send(
                                {error: 'Not authorized'}
                            );
                        }
                });
            }
        }
}   


             