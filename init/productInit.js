const Product = require('../modules/products');

const products = [ new Product ({
    image:"img.jpg",
    productName:"Iphone 2",
    price:8771,
    information:{
        storageCapacity:131,
        numberOfSMI:"Dual SMI",
        cameraResulation:12,
        displaySize:5.6,
    }
    }),({
        image:"img2.jpg",
        productName:"Iphone 4",
        price:8771,
        information:{
            storageCapacity:131,
            numberOfSMI:"Dual SMI",
            cameraResulation:12,
            displaySize:5.6,
        }
    }),({
        image:"img3.jpg",
        productName:"Iphone 3",
        price:8771,
        information:{
            storageCapacity:131,
            numberOfSMI:"Dual SMI",
            cameraResulation:12,
            displaySize:5.6,
        }
    }),({
        image:"img4.jpg",
        productName:"Iphone 5",
        price:8771,
        information:{
            storageCapacity:131,
            numberOfSMI:"Dual SMI",
            cameraResulation:12,
            displaySize:5.6,
        }
    }),({
        image:"img5.jpg",
        productName:"Iphone 6",
        price:8771,
        information:{
            storageCapacity:131,
            numberOfSMI:"Dual SMI",
            cameraResulation:12,
            displaySize:5.6,
        }
    }),({
        image:"img6.jpg",
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

for(var i = 0;i< products.length;i++){
    products[i].save(function(error,doc){
        if(error){
            console.log(error);
        }
        console.log(doc);
    });
}