var express = require('express');
var router = express.Router();

const {check,validationResult} = require('express-validator');//express validator

const User = require('../modules/user');//user module


/* ************************************************************
*  GET users listing.    *************************************
* ************************************************************/
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* ************************************************************
* register page.   *******************************************
* ************************************************************/
router.get('/register', function(req, res, next) {
  res.render('user/register');
});

/* ************************************************************
* register operation.  ***************************************
* ************************************************************/
router.post('/register',[
  //validator
  check('name').not().isEmpty().withMessage('Name Field Is Required'),
  check('name').isLength({min:5}).withMessage('Your name is too short,We Need it lest 5 checkters'),
  check('email').not().isEmpty().withMessage('Email Is required'),
  check('email').isEmail().withMessage('Email Should Be Just Email (:'),
  check('pass').not().isEmpty().withMessage('Pasword is required'),
  //Passowrd Comper
  check('confirm-pass').custom((value,{req})=>{
    if(value !== req.body.pass){
      throw new Error('Passwords is not matched');
    }else{
      return true;
    }
  })

] ,function(req, res, next) {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors);
    return;
  }else{
  //Save Data
  const user = new User({
    name:req.body.name,
    email:req.body.email,
    password:new User().hashPassword(req.body.pass),
  });

  //check if the user already exist
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
          console.log('Done The user Is Saved');
        }
      });
    }
  });
}//End If there is no error
  
});

module.exports = router;
