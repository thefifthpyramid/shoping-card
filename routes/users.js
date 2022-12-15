var express = require('express');
var router = express.Router();
const User = require('../modules/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('user/register');
});
router.post('/register', function(req, res, next) {
  const user = new User({
    name:req.body.name,
    email:req.body.email,
    password:req.body.pass,
  });

  User.findOne({email:req.body.email},function(error,result){
    if(error){
      console.log(error);
    }
    if(result){
      console.log("this user already exist");
    }else{
      user.save(function(error,doc){
        if(error){
          console.log(error);
        }else{
          res.send(doc);
        console.log('saved!');
        }
      });
    }
  });

  
});

module.exports = router;
