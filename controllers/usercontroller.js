var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs')

router.post('/register', function(req, res){ 
    let Username = req.body.user.username;
    let passwordhash = req.body.user.password;
    let admin = req.body.user.is_admin;
    let adminEmail = req.body.user.adminID;

    if(admin === true){
        User.create({
            username : Username,
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
            username : Username,
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
    
    let admin = req.body.user.is_admin;

    (admin === true) ? User.findOne({
       where : { username : req.body.user.username, adminID : req.body.user.adminID } 
       }).then(user => {console.log(user)
        if(user){
            let user = req.body.user;
        
                    bcrypt.compare(req.body.user.adminID, user.adminID, function(err, adminMatch){
                        if(adminMatch){
                            bcrypt.compare(req.body.user.password, user.password, function(err, authMatch){
                                if(authMatch){
                                    let token = jwt.sign({id : user.id}, process.env.SIGN, {expiresIn: 60*60*24} );
                                    let aToken = jwt.sign({id: user.id}, process.env.SIGN, {expiresIn: 60*60*16});
                                    res.json({
                                        adminID : user,
                                        message : 'Welcome back',
                                        sessionToken : token,
                                        adminToken : aToken
                                    });
                                } else {
                                    res.status(502).send({ error: "502/Bad Gateway - if only you were Jeff Bezos..." })
                                }
                            },
                            function(){
                                res.status(501).send({ error: "501 - Get off twitter, Elon!" })
                            });
                        } else {
                            res.status(500).send({ error: "500 - You're not Sir Richard Branson!"})
                        }
                    },
                    function(){
                        res.status(501).send({ error: "501 - Get off twitter, Elon!" })
                    });
                } else {
                    res.status(500).send({ error: "500 - something, something...innovation"})
                }
            }
        )
    : User.findOne({
        where : { username : req.body.user.username }
        }).then(function(user){ 
                if(user){
                    // console.log(user);
                    bcrypt.compare(req.body.user.password, user.password, function(err, authMatch){
                        if(authMatch){
                            let token = jwt.sign({id: user.id}, process.env.SIGN, {expiresIn: 60*60*16});
                            res.json({
                                username: user,
                                message: 'Welcome back',
                                sessionToken: token
                            });
                        } else {
                            res.status(502).send({ error: "502/Bad Gateway - if only you were Jeff Bezos..." })
                        }
                    });
                } else {
                    res.status(500).send({ error: "500 - You're not Sir Richard Branson!"})
                }
            },
            function(){
                res.status(501).send({ error: "501 - Come back when you own one of the following: A) SpaceX, B) Virgin, or C) Amazon"  })
            }
        );
    }
);

module.exports = router;