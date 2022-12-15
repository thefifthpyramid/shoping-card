const Product = require('../modules/products');

var logger = require('morgan');
const { default: mongoose } = require('mongoose');
//mongoose
mongoose.set('strictQuery', true); 
mongoose.connect('mongodb://127.0.0.1/shoping-card',function(error){
  if(error){
    console.log(error);
  }else{
    console.log('Conected to DB ....');
  }
  
});

const products = [ new Product ({
    image:"images/category-3.jpg",
    productName:"Iphone 11",
    price:44,
    information:{
        storageCapacity:131,
        numberOfSMI:"Dual SMI",
        cameraResulation:12,
        displaySize:5.6,
    }
    }), new Product ({
        image:"images/category-3.jpg",
        productName:"Iphone 22",
        price:33,
        information:{
            storageCapacity:131,
            numberOfSMI:"Dual SMI",
            cameraResulation:12,
            displaySize:5.6,
        }
    }), new Product ({
        image:"images/category-2.jpg",
        productName:"Iphone 13",
        price:22,
        information:{
            storageCapacity:131,
            numberOfSMI:"Dual SMI",
            cameraResulation:12,
            displaySize:5.6,
        }
    }), new Product ({
        image:"images/category-1.jpg",
        productName:"Iphone 52",
        price:11,
        information:{
            storageCapacity:131,
            numberOfSMI:"Dual SMI",
            cameraResulation:12,
            displaySize:5.6,
        }
    }), new Product ({
        image:"images/category-3.jpg",
        productName:"Iphone 6",
        price:8771,
        information:{
            storageCapacity:131,
            numberOfSMI:"Dual SMI",
            cameraResulation:12,
            displaySize:5.6,
        }
    }), new Product ({
        image:"images/category-4.jpg",
        productName:"Iphone 7",
        price:8771,
        information:{
            storageCapacity:131,
            numberOfSMI:"Dual SMI",
            cameraResulation:12,
            displaySize:5.6,
        }
    }),
];

var done = 0;
for(var i = 0;i< products.length;i++){
    products[i].save(function(error,doc){
        if(error){
            console.log(error);
        }else{
            console.log(doc);
            done ++;
            if(done === products.length){
                mongoose.disconnect();
            }
        }
        
    });
}