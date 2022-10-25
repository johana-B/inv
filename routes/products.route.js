const express = require('express')
const fs = require('fs')
const multer = require('multer')

const router = express.Router()

const SubCategory = require('../model/subCategory.model')
const Product = require('../model/products.model')
const Category = require('../model/category.model')

const asyncWrapper = require('../middleware/asyncWrapper')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('invalid image type')
        if(isValid){
            uploadError = null
        }
      cb(uploadError, 'public/upload')
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.split(' ').join('-')
      const extention = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${fileName}-${Date.now()}.${extention}`)
    }
  })

  const upload = multer({storage:storage}) 

router.post('/', upload.single('image'), asyncWrapper( async (req, res) => {
        const subCategory = await SubCategory.findById(req.body.subCategory);
    if (!subCategory){
        return res.status(400).send('Invalid subCategory')
    }
    const file = req.file;
    if (!file){
        return res.status(400).send('No image in the request')
    }
    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
    let product = new Product({
        name: req.body.name,
        price: req.body.price,
        image:`${basePath}${fileName}`, //"http://localhost:3000/public/upload/picture-1.jpg"
        createdAt:req.body.createdAt,
        description: req.body.description,
        subCategory:req.body.subCategory,
        quantity: req.body.quantity,
    })

    const products = await product.save()

    if (!products)
        return res.status(404).send('Product cannot be created')
    res.status(200).json({products})
}))


router.get('/', asyncWrapper( async (req, res)=> {

        const {name, sort, numericFIlter,category, subCategory} = req.query
        const filter = {}

        if(name){
        filter.name = {$regex:name, $options:'i'}
        }
        if(subCategory){
                filter.subCategory = subCategory
            }
        if(category){
            filter.category = category
        }
        if(numericFIlter){
            const operatorMap = {
                '>':'$gt',
                '>=':'$gte',
                '=':'$eq',
                '<':'$lt',
                '<=':'$lte',
            }
                
            const regEx = /\b(>|>=|=|<|<=)\b/g
             const options = ['price','quantity']
            let filter = numericFIlter.replace(regEx, (match) =>`-${operatorMap[match]}-`)
            filter = filter.split(',').forEach((item) =>{
                const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                 filter[field] = {[operator]: Number(value)}
            }
        })
     }
        // console.log(filter);
    
        let result = Product.find(filter)
        if(sort){
            const sortList = sort.split(',').join(' ')
            result = result.sort(sortList)
        }
        else{
            result = result.sort('createdAt')
        }

    const productList = await result.populate('subCategory');
    if (!productList) {
        res.status(404).json({success:false})
    }
    res.status(200).json({productList,nbHits: productList.length})
    
}))
    
router.get('/:id',asyncWrapper( async (req, res) => {

            const product = await Product.findById(req.params.id).populate('subCategory');
    
        if (!product) {
            res.status(404).json({msg: 'The product with the given ID not exists' })
        }
        res.status(200).json({product})
        
    }) ) 

router.patch('/:id',asyncWrapper( async (req, res) =>{

        const subCategory = await SubCategory.findById(req.body.subCategory);
    if (!subCategory){
        return res.status(400).send('Invalid subCategory')
    }
    const product = await Product.findOneAndUpdate(req.query.id, {
        name: req.body.name,
        price: req.body.price,
        createdAt:req.body.createdAt,
        subCategory:req.body.subCategory,
        description: req.body.description,
        quantity: req.body.quantity,
    }).populate('subCategory')
    if(!product){
        return res.status(404).json({msg:'invalid product'}) 
    }
    res.status(200).json({product})

    
}))

router.delete('/:id',asyncWrapper( async (req, res) =>{

    const deleteProduct = await Product.findById(req.params.id);
    if(!deleteProduct){
        return res.status(404).send('no product by this id')
    }
    else{
        const imageResponse = deleteProduct.image
            
        console.log(imageResponse)
        const imageToDelete = imageResponse.replace('http://localhost:3000/public/upload/',"");
      fs.unlink('public/upload/' + imageToDelete, async (err) => {
        if (err)
            {return res.send(err)}
            else{
            await deleteProduct.delete();

        console.log('successfully deleted file');
        return res.status(200).json({deleteProduct, msg:'this item is deleted'}) 
            }  
    });  
    }
    
}))


module.exports = router
