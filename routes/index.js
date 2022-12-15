var express = require('express');
var router = express.Router();
const Product = require('../modules/products')
/* GET home page. */

router.get('/home', function(req, res, next) {
  res.render('index');
});
router.get('/', function(req, res, next) {
  Product.find({},function(error,doc){
    if(error){
      console.log(error);
    }
      var peroductGrid = [];
      var colGrid = 3;
      for(var i=1;i< doc.length;i+=colGrid){
        peroductGrid.push(doc.slice(i, i+colGrid));
      }
      res.render('shop', { title: 'Express',products : peroductGrid });
    
  });
 
});
//Product Details
router.get('/product-details/:id', function(req, res, next) {
  res.render('product-details',{product: req.params.id});
});

module.exports = router;
