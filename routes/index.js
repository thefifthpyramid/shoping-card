var express = require('express');
var router = express.Router();
const Product = require('../modules/products');

const User = require('../modules/user');//user module
const passport = require('passport');

const Cart = require('../modules/Cart');


/* GET home page. */
/* ************************************************************
* home page .   *******************************************
* ************************************************************/
router.get('/home', function(req, res, next) {
  var totalProducts = 0;
  if(req.isAuthenticated()){
    totalProducts = req.user.cart.totalQuantity;
  }
  res.render('index',{totalProducts:totalProducts});
});


router.get('/', function(req, res, next) {
  var totalProducts = 0;
  if(req.isAuthenticated()){
    const cartId = req.user._id;
    Cart.findById(cartId,(error,cart)=>{
      if(error){
        console.log(error);
      }else{
        if(cart){
          totalProducts = req.user.cart.totalQuantity;
        }
      }
      });
   
  }
  Product.find({},function(error,doc){
    if(error){
      console.log(error);
    }
      var peroductGrid = [];
      var colGrid = 3;
      for(var i=1;i< doc.length;i+=colGrid){
        peroductGrid.push(doc.slice(i, i+colGrid));
      }
      res.render('shop', { title: 'Express', products : peroductGrid, checkUser : req.isAuthenticated(),totalProducts : totalProducts });
    
  });
 
});
/* ************************************************************
* Product Details page.   *******************************************
* ************************************************************/
router.get('/product-details/:id', function(req, res, next) {
  res.render('product-details',{product: req.params.id});
});
/* ************************************************************
* AddToCard page.   *******************************************
* ************************************************************/
router.get('/AddToCard/:id/:price/:productName',isLogin, function(req, res, next) {
  /*Cart.deleteMany((error,doc)=>{
    console.log(doc);
  });*/
  console.log(req.params.id);
  const cartId = req.user._id;
  const newProductPrice = parseInt(req.params.price,10);
  const newProduct = {
    ID: req.params.id,
    price: newProductPrice,
    name: req.params.productName,
    quantity: 1,

  }
  Cart.findById(cartId,(error,cart)=>{
    if(error){
      console.log(error);
    }else{
      if(!cart){
        console.log('create new cart to user');
        const newCart = new Cart ({
          _id : cartId,
          totalQuantity: 1,
          totalPrice: newProductPrice ,
          selectedProduct: [newProduct],
        });
        newCart.save((error,doc)=>{
          if(error){
            console.log(error);
          }else{
            console.log(doc);
          }
        });
      }
      //if the cart is already exist
      if(cart){
        console.log('cart already exist');
        var indexOfProduct = -1;
        for(var i = 0;i < cart.selectedProduct.length; i++){
          if(req.params.id === cart.selectedProduct[i]._id){
            indexOfProduct = i;
            break;
          }
        }
        //if the product is already exist
        if(indexOfProduct >= 0){
          console.log('cart already exist and update the counter');

          cart.selectedProduct[indexOfProduct].quantity = cart.selectedProduct[indexOfProduct].quantity + 1;
          
          cart.selectedProduct[indexOfProduct].price    =  cart.selectedProduct[indexOfProduct].price + newProductPrice;

          cart.totalQuantity = cart.totalQuantity + 1;

          cart.totalPrice = cart.totalPrice + newProductPrice;

          Cart.updateOne({_id : cartId} , {$set : cart},(error,doc)=>{
            if(error){
              console.log(error);
            }else{
              console.log(doc);
              console.log(cart);
            }
          });//end updateOne

        //if the product is Not exist
        }else{
          console.log('cart already exist and add the product');
          cart.totalQuantity = cart.totalQuantity + 1;
          cart.totalPrice = cart.totalPrice + newProductPrice;
          cart.selectedProduct.push(newProduct);
          Cart.updateOne({_id : cartId},{$set : cart},(error,doc)=>{
            if(error){
              console.log(error);
            }else{
              console.log(doc);
              console.log(cart);
            }
          });//end updateOne
        }
      }//end the consition if the cart already exist
    }//end else if
  });//end findById
  
  res.redirect('/');
});

/* ************************************************************
* shopping-cart page.   ***************************************
* ************************************************************/
router.get('/cart',isLogin, function(req, res, next) {
  if(!req.user.cart){
    res.redirect('/');
    return;
  }
  totalProducts = req.user.cart.totalQuantity;
  const cartData = req.user.cart;
  res.render('products/cart',{product: req.params.id,totalProducts : totalProducts,cartData : cartData});
});



/* ************************************************************
* increaseProduct in the shopping-cart .   ********************
* ************************************************************/
router.get('/increaseProduct/:index',isLogin, function(req, res, next) {
  const index = req.params.index;
  const userCart = req.user.cart;
  const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity

  userCart.selectedProduct[index].quantity = userCart.selectedProduct[index].quantity + 1;
  userCart.selectedProduct[index].price = userCart.selectedProduct[index].price + productPrice;
  userCart.totalQuantity = userCart.totalQuantity + 1;
  userCart.totalPrice = userCart.totalPrice + productPrice;
  Cart.updateOne({_id: userCart._id},{$set:userCart},(error,doc)=>{
    if(error){
      console.log(error);
    }else{
      console.log(doc);
      res.redirect('/cart');
    }
  });
});


/* ************************************************************
* decreaseProduct in the shopping-cart.   *********************
* ************************************************************/
router.get('/decreaseProduct/:index',isLogin, function(req, res, next) {
  const index = req.params.index;
  const userCart = req.user.cart;
  const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity

  userCart.selectedProduct[index].quantity = userCart.selectedProduct[index].quantity - 1;
  userCart.selectedProduct[index].price = userCart.selectedProduct[index].price - productPrice;
  userCart.totalQuantity = userCart.totalQuantity - 1;
  userCart.totalPrice = userCart.totalPrice - productPrice;
  Cart.updateOne({_id: userCart._id},{$set:userCart},(error,doc)=>{
    if(error){
      console.log(error);
    }else{
      console.log(doc);
      res.redirect('/cart');
    }
  });
});


/* ************************************************************
* deleteProduct from shopping-cart .   ************************
* ************************************************************/
router.get('/deleteProduct/:index',isLogin, function(req, res, next) {
  const index = req.params.index;
  const userCart = req.user.cart;

  if(userCart.selectedProduct.length <=1){
    Cart.deleteOne({_id:userCart._id},(error,doc)=>{
      if(error){
        console.log(error)
      }else{
        res.redirect('/');
      }
    });
  }else{
    userCart.totalPrice = userCart.totalPrice - userCart.selectedProduct[index].price;
    userCart.totalQuantity = userCart.totalQuantity - userCart.selectedProduct[index].quantity;

    userCart.selectedProduct.splice(index,1);

    Cart.updateOne({_id: userCart._id},{$set : userCart},(error,doc)=>{
      if(error){
        console.log(error);
      }
    res.redirect('/cart');
    });
  }
});


/* ************************************************************
* checkout page .   *******************************************
* ************************************************************/
router.get('/checkout',isLogin, function(req, res, next) {
  var totalProducts = req.user.cart.totalQuantity;
  const cartId = req.user._id;
    Cart.findById(cartId,(error,cart)=>{
      if(error){
        console.log(error);
      }else if(!cart){
        res.redirect('/users/login');
      }else{
        res.render('user/checkout',{totalProducts:totalProducts});
      }
      
    });
  
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
module.exports = router;
