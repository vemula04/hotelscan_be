const mongoose = require('mongoose');
const config = require('./config');
const cAPI = config.CONSTANTS;
const databaseName = cAPI.IS_PROD ? cAPI.PROD_DB : cAPI.DEV_DB
console.info("USING THE DATABASE AS :: ", databaseName);
//Set up default mongoose connection
// mongodb+srv://guest:<PASSWORD>@cluster0.w4two.mongodb.net 
const mongoDB = `mongodb+srv://${config.DB.username}:${config.DB.password}@${config.DB.host}/${databaseName}?retryWrites=true&w=majority`;
// mongodb+srv://k_mongo:yUug8Jj2s0pYmXVq@cluster0.w4two.mongodb.net/hotel_app?retryWrites=true&w=majority
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db