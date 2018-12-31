var express = require('express');
var router = express.Router();
var Group = require(".././models/group")
var Session = require(".././models/session")
var mongoose = require("mongoose")


//find a single group
router.get('/:id', function(req, res, next) {
    Group.findById(mongoose.Types.ObjectId(req.params.id), function(err, group) {
        if (err) {
            res.status(500).send("Error" + err);
            console.error(err);
        }
        res.status(200).json(group);
    })
});

//delete a single group
router.delete('/:id', function(req, res, next) {
    Group.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id), function(err, group) {
        if (err) {
            res.status(500).send("Error" + err);
            return console.error(err);
        }
        res.status(200).json(group);
    })
});

//add a single group
router.post('/', function(req, res, next) {
    let newGroup = new Group({ name: req.body.name, _creatorId: req.body._creatorId, creationdate: Date(), isPrivate: req.body.isPrivate, isClosed: false });
    newGroup.save(function(err) {
        if (err) {
            res.status(500).send("Error" + err);
            return console.error(err);
        }
        res.status(200).json({})
        // saved!
    });
})

//update group
router.patch('/:id', function(req, res, next) {
    //Find the group
    Group.findById(mongoose.Types.ObjectId(req.params.id), function(err, group) {
        if (err) {
            res.status(500).send("Error" + err);
            console.error(err);
        }
        //Set the group to the new group data
        group = req.body.group;
        //Save the gorup in mongo
        group.save(function(err) {
            if (err) {
                res.status(500).send("Error" + err);
                return console.error(err);
            }
            res.status(200).json({})
            // saved!
        });
    })
})

//Do I need this? Maybe all I have to do is get the group object
router.get('/:id/session', function(req, res, next) {
    Group.findById(mongoose.Types.ObjectId(req.params.id), function(err, group) {
        if (err) {
            res.status(500).send("Error" + err);
            console.error(err);
        }
        res.status(200).json(group);
    })
    res.send(`get all the sesions from a group with id ${req.params.id}`)
})

router.get('/:id/session/:sid', function(req, res, next) {
    res.send(`get session with id ${req.params.sid} from a group with id ${req.params.id}`)
})

router.patch('/:id/session/:sid', function(req, res, next) {
    res.send(`patch session with id ${req.params.sid} from a group with id ${req.params.id}`)
})

router.post('/:id/session', function(req, res, next) {
    res.send(`create session in group with id ${req.params.id}`)
})


module.exports = router;
