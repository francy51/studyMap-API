var express = require('express');
var router = express.Router();


//The index file contains most middlewear
// DO I really need this??



// Test routes get rid of these in production

router.get('/sendMessage/:msg', function(req, res, next) {
    process.send(req.params.msg);
    res.send(req.params.msg);
})

router.get('/sendEmail/:msg', function(req, res, next) {
    process.send({ msg: req.params.msg, cmd: "sendEmail" })
    res.send(req.params.msg)
})


module.exports = router;
