var express = require('express');
var router = express.Router();


router.get('/:id', function(req, res, next) {
    res.send("return a chat")
});

router.post('/', function(req, res, next) {
    res.send("create a new chat")
});

router.patch('/:id', function(req,res,next){
    res.send("add a message to the chat")
})





module.exports = router;
