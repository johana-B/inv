const express = require('express')
const connectDB =require('./db/connect')
require('dotenv').config()
const app = express();
const productRoute = require('./routes/products.route')
const userRoute = require('./routes/user.routes');
const categoryRoute = require('./routes/category.route')
const subCategoryRouter = require('./routes/subCategory.route');

const errorHandler = require('./middleware/error-handler')
//middleware
app.use(express.json())
app.use(errorHandler)

//route

app.use('/users',userRoute);
app.use('/products',productRoute)
app.use('/category', categoryRoute)
app.use('/subCategory', subCategoryRouter)


const port = process.env.PORT || 3000

const start = async () => {
    try {
        //connectDB
        await connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`server is on port ${port}...`)) 
    } catch (error) {
        console.log(error)
    }
}

start()