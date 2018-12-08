var router = require('express').Router();
var sequelize = require('../db');
var UserPost = sequelize.import('../models/userpost');

router.post('/new_post', function (req, res){
    let Creator = req.user.username;
    let Label = req.body.userpost.label;
    let ContentText = req.body.userpost.content_text;

    UserPost.create({
        creator : Creator,
        label : Label,
        entry : ContentText
    } 
    ).then(
        function newUserPost(){
            res.json({
                message : 'Saved! See you Space Cowboy...',
                Label : req.body.userpost.label,
                Creator : req.body.userpost.creator
            }); 
        },
        function userPostError(){
            res.status(500).send({error: '500 - Internal Server Error'});
        }
    );
});

router.get('/userposts', function(req, res){
    let Creator = req.user.username;

    UserPost.findAll({
        where: { creator : Creator }
    })
    .then(
        function myUserPosts(data){
            res.json(data)
        },
        function getAllFail(){
            res.status(500).send({error: '500 - Internal Service Error'});
        }
    );
});

router.get('/userposts/:id', function(req, res){
    let data = req.params.id;
    let Creator = req.user.username;

    UserPost.findOne({
        where: { 
            id : data,
            creator : Creator
        }
    }).then(
        function findOneUserPost(data){
            res.json(data);
        },
        function noFindUserPost(){
            res.status(500).send({error : '500 - Internal Service Error'})
        }
    )
})

router.delete('/userposts/delete/:id', function(req, res){
    let data = req.params.id;
    let Creator = req.user.username;

    UserPost.destroy({
        where: { 
            id : data,
            creator : Creator
        }
    }).then(
        function deleteUserSuccess(data){
            res.send('What Journal entry?');
        },
        function deleteUserError(err){
            res.status(500).send({error: '500 - Internal Server Error'});
        }
    );
});

router.put('/userposts/edit/:id', function(req, res){
    let data = req.params.id;
    let Creator = req.user.username;
    
    let Label = req.body.userpost.label;
    let ContentText = req.body.userpost.content_text;

    UserPost.update({
        label : Label,
        content_text : ContentText
    },  { where: { 
            id : data,
            creator : Creator
        }
    }).then(
        function userpostUpdated(updateUserPost){
            res.json({
                message: 'Entry updated, check your training log to confirm accuracy',
                updateUserPost
            });
        },
        function updateError(err){
            res.status(500).send({error: '500 - Internal Server Error'});
        }
    );
});

module.exports = router;