const express = require('express')
const connectDB = require('./db/connect')
require('dotenv').config()
const app = express();
const productRoute = require('./routes/products.route')
const userRoute = require('./routes/user.routes');
const categoryRoute = require('./routes/category.route')
const subCategoryRouter = require('./routes/subCategory.route');
const path = require('path');
const expressFileUpload = require('express-fileupload');

const errorHandler = require('./middleware/error-handler')
//middleware
app.use(express.json())
app.use(express.urlencoded());
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(errorHandler)

//route
app.get('/api', (req, res) => {
    res.send('the inventory app');
});
app.use(expressFileUpload({ createParentPath: true }))
app.use('/api/users', userRoute);
app.use('/api/products', productRoute)
app.use('/api/category', categoryRoute)
app.use('/api/subCategory', subCategoryRouter)
app.use('/api/public/upload', express.static(path.join(__dirname, 'public', 'upload')))



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