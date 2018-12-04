var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs')

router.post('/register', function(req, res){ 
    let userName = req.body.user.username;
    let passwordhash = req.body.user.password;
    let admin = req.body.user.is_admin;
    let adminEmail = req.body.user.adminID;

    if(admin === true){
        User.create({
            username : userName,
            password : bcrypt.hashSync(passwordhash, 10),
            is_admin : admin,
            adminID : bcrypt.hashSync(adminEmail, 15)
        }).then(
            function createAdminSuccess(user){
                let aToken = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*3} );
                let token = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*24} );
                res.json({
                    username : user,
                    message : 'Successfully registered as administrator!',
                    sessionToken : token,
                    adminToken : aToken,
                });
            }, 
            function createAdminFail(err){
                res.status(500).send({ error: '500 - Internal Server Error'})
            }
        );
    } else if(admin === false || null){
        User.create({
            username : userName,
            password : bcrypt.hashSync(passwordhash, 10)
        }).then(
            function createUserSuccess(user){
                let token = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*24} );
                res.json({
                    username : user,
                    message : 'Successfully registered as user!',
                    sessionToken : token
                });
            },
            function createUserFail(err){
                res.status(500).send({ error : '500 - Internal Server Error'})
            }
        )}
    }
)


router.post('/login', function(req, res){
    User.findOne( { where: { username: req.body.user.username } } 
        ).then(
            (req.body.user.is_admin === true) ? User.findOne( { where: { adminID: req.body.user.adminID } } 
            ).then(
            function(adminID){
                if(adminID){
                    bcrypt.compare(req.body.user.adminID, user.adminID, function(err, adminMatch){
                        if(adminMatch){
                            bcrypt.compare(req.body.user.password, user.password, function(err, authMatch){
                                if(authMatch){
                                    let token = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*24} );
                                    let aToken = jwt.sign({id: user.id}, process.env.SIGN, {expiresIn: 60*60*16});
                                    res.json({
                                       adminEmail: adminID,
                                       message: `Welcome back ${user.username}`,
                                       sessionToken : token,
                                       adminToken: aToken
                                    });
                                } else {
                                    res.status(502).send({ error: "502/Bad Gateway - if only you were Jeff Bezos..." })
                                } 
                            });
                        } else {
                            res.status(500).send({ error: "500 - You're not Sir Richard Branson!"})
                        }
                    },
                    function(err){
                        res.status(501).send({ error: "501 - Get off twitter, Elon!" })
                    })
                }  else {
                    res.status(500).send({ error: "500 - something, something...innovation"})
                }
            }
        ) : (req.body.user.is_admin !== false) ? function(user){
                if(user){
                bcrypt.compare(req.body.user.password, user.password, function(err, authMatch){
                    if(authMatch){
                        // var token = jwt.sign({id: user.id}, process.env.SIGN, {expiresIn: 60*60*16});
                        res.json({
                           username: user,
                           message: `Welcome back ${user.username}`,
                           sessionToken: token
                        });
                    } else {
                        res.status(502).send({ error: "502/Bad Gateway - if only you were Jeff Bezos..." })
                    }
                });
            } else {
                res.status(500).send({ error: "500 - You're not Sir Richard Branson!"})
            }
        } : function(error){
            res.status(501).send({ error: "501 - Come back when you own one of the following: A) SpaceX, B) Virgin, or C) Amazon"  })
        }
    );
});

module.exports = router;