const mongoose=require("mongoose");

const urlSchema=new mongoose.Schema({
    longurl:{type:String,required:true},
    shorturl:{type:String,required:true},
    clicks:{type:Number,default:0},
    createdOn:Date
})
const URL = mongoose.model('URL',urlSchema );
module.exports=URL;