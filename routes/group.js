var express = require('express');
var router = express.Router();


//find a single group
router.get('/:id', function(req, res, next) {
    res.send("get a group")
});

//delete a single group
router.delete('/:id', function(req, res, next) {
    res.send("delete a group")
});

//add a single group
router.post('/', function(req, res, next) {
    res.send('create a group')
})

//update group
router.patch('/:id', function(req, res, next) {
    res.send("edit a group")
})

router.get('/:id/session', function(req, res, next) {
    res.send(`get all the sesions from a group with id ${req.params.id}`)
})

router.get('/:id/session/:sid', function(req, res, next) {
    res.send(`get session with id ${req.params.sid} from a group with id ${req.params.id}`)
})

router.patch('/:id/session/:sid', function(req, res, next) {
    res.send(`patch session with id ${req.params.sid} from a group with id ${req.params.id}`)
})

router.post('/:id/session', function(req, res, next) {
    res.send('create session in group')
})


module.exports = router;
