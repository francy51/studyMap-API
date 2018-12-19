var express = require('express');
var router = express.Router();


//find a single group
router.get('/:id',function(req,res,next){
    res.send("get a group")
});

//delete a single group
router.delete('/:id', function(req,res,next){
   res.send("delete a group") 
});

//add a single group
router.post('/',function(req,res,next){
    res.send('create a group')
})

//update group
router.patch('/:id', function(req,res,next){
    res.send("edit a group")
})

module.exports = router;
