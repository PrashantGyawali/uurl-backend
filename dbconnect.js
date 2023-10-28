function connectDB(){
const mongoose  = require("mongoose");
require('dotenv').config();
mongoose.connect(`mongodb+srv://${process.env.mongodbuser}:${process.env.mongodbpass}@uurl.xfkbdk8.mongodb.net/URLS?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const db = mongoose.connection;
db.on("error", err => {
    console.log(err);});

db.once("open",()=>{ 
    console.log("connected to db");})

return db;
}
module.exports=connectDB;