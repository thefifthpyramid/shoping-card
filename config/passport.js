const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../modules/user');
const Cart = require('../modules/Cart');

passport.serializeUser((user,done)=>{
    return done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    User.findById(id,(error,user)=>{
        Cart.findById(id,(error,cart)=>{
            if(!cart){
                return done(error,user);
            }
            user.cart = cart;
            return done(error,user);
        });
    });
});

passport.use('local-login',new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true,
},(req,email,password,done) => {
    User.findOne({email:email},function(error,user){
        if(error){
            return done(error);
        }
        if(!user){
            return done(null,false,req.flash('loginError','this user not found'));
        }
        if(!user.comparePassword(password)){
            return done(null,false,req.flash('loginError','Your password is not corect'));
        }
        return done(null,user);
        
    });
}));







