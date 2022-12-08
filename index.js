const express = require('express')
const connectDB = require('./db/connect')
require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');
const app = express();
const path = require('path');
const expressFileUpload = require('express-fileupload');

//routes
const productRoute = require('./routes/products.route')
const userRoute = require('./routes/user.routes');
const categoryRoute = require('./routes/category.route')
const subCategoryRouter = require('./routes/subCategory.route');

const errorHandlerMiddleware = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');


//middleware
app.use(morgan('tiny'));
app.use(express.json())
app.use(express.urlencoded());
app.use(express.urlencoded({ limit: '50mb', extended: true }))

//route
app.get('/', (req, res) => {
    res.send('the inventory app');
});
app.use(expressFileUpload({ createParentPath: true }))
app.use('/api/users', userRoute);
app.use('/api/products', productRoute)
app.use('/api/category', categoryRoute)
app.use('/api/subCategory', subCategoryRouter)
app.use('/api/public/upload', express.static(path.join(__dirname, 'public', 'upload')));

app.use(notFound);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 6000

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