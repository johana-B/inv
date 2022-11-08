const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        //required:[true, 'product name must be provided'],
        trim:true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory',
       // required: true
    },
    costPrice:{
        type:Number, 
       // required:[true, 'price must be provided']
    },
    sellingPrice:{
        type:Number, 
       // required:[true, 'price must be provided']
    },
    image:{
        type:String,
       // required:true
    },
    createdAt:{
        type:Date, 
        default: Date.now(),
    },
    description: {
        type: String,
       // required: [true, 'Please provide product description'],
        maxlength: [1000, 'Description can not be more than 1000 characters'],
        trim:true
    },
    quantity: {
        type: Number,
       // required: true,
        min: 0,
    },  
    modelNumber:{
        type:Number, 
      //  required:[true, 'price must be provided']
    },   
    vendor:{
        type:String, 
       // required:[true, 'price must be provided']
    },
    sold:{
        type:Number,
        default:0
    }
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

productSchema.set('toJSON', {
    virtuals:true,
})


module.exports = mongoose.model('product', productSchema)