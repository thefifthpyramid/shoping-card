const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    image:{
        type:String,
        required:true,
    },
    productName:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    information:{
        required:true,
        type:{
            storageCapacity:Number,
            numberOfSMI:String,
            cameraResulation:Number,
            displaySize:Number,
        }
    }
});


module.exports = mongoose.model('product',productSchema);