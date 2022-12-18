var express = require('express');
var router = express.Router();

const {check,validationResult} = require('express-validator');//express validator

const User = require('../modules/user');//user module
const passport = require('passport');
const csrf = require('csurf');

router.use(csrf());


/* ************************************************************
*  GET users listing.    *************************************
* ************************************************************/
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* ************************************************************
* register page.   *******************************************
* ************************************************************/
router.get('/register',isNotLogin, function(req, res, next) {
  var messageError = req.flash('error');
  var totalProducts = 0;
  res.render('user/register',{messageError : messageError,csrf: req.csrfToken(),totalProducts : totalProducts});
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
    var validationMessage = [];
    for(var i =0;i<errors.errors.length;i++){
      validationMessage.push(errors.errors[i].msg)
    }
    console.log(validationMessage);
    req.flash('error',validationMessage);
    res.redirect('register');
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
      req.flash('error','this user already exist');
      res.redirect('register');
      return;
    }else{
      user.save(function(error,doc){
        if(error){
          console.log(error);
        }else{
          res.send('Done The user Is Saved');
        }
      });
    }
  });
}//End If there is no error
  
});

/* ************************************************************
* Login page.   *******************************************
* ************************************************************/
router.get('/login',isNotLogin, function(req, res, next) {
  var messageError = req.flash('loginError');
  var totalProducts = 0;
  res.render('user/login',{messageError :messageError,csrf: req.csrfToken(),totalProducts : totalProducts});
});
/* ************************************************************
* Profile page.   *******************************************
* ************************************************************/
router.get('/profile',isLogin, function(req, res, next) {
  if(req.user.cart){
    totalProducts = req.user.cart.totalQuantity;
  }else{
    totalProducts = 0;
  }
  res.render('user/profile',{totalProducts : totalProducts});
});

/* ************************************************************
* Login operation.   *******************************************
* ************************************************************/
router.post('/login',[
  check('email').not().isEmpty().withMessage('Email Is required'),
  check('email').isEmail().withMessage('Email Should Be Just Email (:'),
  check('password').not().isEmpty().withMessage('Pasword is required'),

],(req,res,next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    
    var validationMessage = [];
    for(var i =0;i<errors.errors.length;i++){
      validationMessage.push(errors.errors[i].msg)
    }
    console.log(validationMessage);
    req.flash('loginError',validationMessage);
    res.redirect('login');
    return ;
  }
  next();
},passport.authenticate('local-login',{
  //session:false,
  successRedirect:'profile',
  failureRedirect:'login',
  failureFlash: true,
}));

/* ************************************************************
* LogOut.   *******************************************
* ************************************************************/
router.get('/logout',isLogin, function(req, res, next) {
  req.logOut();
  res.redirect('/');
});

//if user isAuthenticated
function isLogin(req,res,next){
  if(! req.isAuthenticated()){
    res.redirect('/users/login');
    return ;
  }else{
    next();
  }
}
//if user is not Authenticated
function isNotLogin(req,res,next){
  if(req.isAuthenticated()){
    res.redirect('/users/profile');
    return ;
  }else{
    next();
  }
}




module.exports = router;
