var jwt = require('jsonwebtoken');
var sequelize = require('../db');
var User = sequelize.import('../models/user');

let admin = req.body.user.is_admin;

////////////////////////////////////////
/////WE MAY NOT NEED THIS CODE/FILE/////
//////////////////////////////////////
module.exports = function(req, res, next){
    if(req.method == 'OPTIONS'){
        next();
        } else { 
            if(admin === true){
                console.log(`(${adminID}) is a store owner?: ${admin}`);
                let adminToken = req.headers.authorization;
                if (!adminToken) return res.status(403).send({ authorized: false, message: 'No token provided.' });
                    jwt.verify(adminToken, process.env.SIGN, (err, decoded) => {
                        if(decoded){
                            User.findOne(
                                { where: {adminID: decoded.adminID} }
                                ).then(user => { 
                                    req.user = user;
                                    next();
                                },
                            function(){ res.status(401).send({error: 'Not authorized, admin status required'})
                        }); 
                    } else { res.status(401).send({error: 'Not authorized, admin status required'}) 
                }
            });
        }
    }
}