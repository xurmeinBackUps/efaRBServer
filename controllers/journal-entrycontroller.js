var router = require('express').Router();
var sequelize = require('../db');
var JournalEntry = sequelize.import('../models/journal-entry');

router.post('/new_entry', function (req, res){
    let Author = req.user.username;
    let Title = req.body.journal_entry.title;
    let JEntry = req.body.journal_entry.entry

   

    JournalEntry.create({
        author : Author,
        title : Title,
        entry : JEntry
    } 
    ).then(
        function newJournal(){
            res.json({
                message : 'Journaled! See you Space Cowboy...',
                Title : req.body.journal_entry.title,
                Author : req.body.journal_entry.creator
            }); 
        },
        function activityError(err){
            res.status(500).send(err);
        }
    );
});

router.get('/journals', function(req, res){
    let authorID = req.user.username;

    JournalEntry.findAll({
        where: { author : authorID }
    })
    .then(
        function myEntries(data){
            res.json(data)
        },
        function getAllFail(err){
            res.status(500).send({error: '500 - Internal Service Error'});
        }
    );
});

router.get('/journals/:id', function(req, res){
    let data = req.params.id;
    let authorID = req.user.username;

    JournalEntry.findOne({
        where: { 
            id : data,
            author : authorID
        }
    }).then(
        function findOneEntry(data){
            res.json(data);
        },
        function noFindEntry(err){
            res.status(500).send({error : '500 - Internal Service Error'})
        }
    )
})

router.delete('/delete_entry/:id', function(req, res){
    let data = req.params.id;
    let authorID = req.user.username;

    JournalEntry.destroy({
        where: { 
            id : data,
            author : authorID 
        }
    }).then(
        function deleteEntrySuccess(data){
            res.send(`${data} has been removed from your docket`);
        },
        function deleteEntryError(err){
            res.status(500).send({error: '500 - Internal Server Error'});
        }
    );
});

router.put('/journal_edit/:id', function(req, res){
    console.log(req.body.journal_entry, "line 80 in journal-entrycontroller")
    let data = req.params.id;
    let authorID = req.user.username;
    
    let Title = req.body.journal_entry.title;
    let JEntry = req.body.journal_entry.entry;

    JournalEntry.update({
        title : Title,
        entry : JEntry
    },  { where: { 
            id : data,
            author : authorID
        }
    }).then(
        function entryUpdated(updateEntry){
            res.json({
                message: 'Entry updated, check your training log to confirm accuracy',
                updateEntry
            });
        },
        function updateError(err){
            res.status(500).send({error: '500 - Internal Server Error'});
        }
    );
});

module.exports = router;