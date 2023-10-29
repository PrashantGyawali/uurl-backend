const express=require("express");
const cors=require("cors");
const { randomInt, getRandomValues } = require('crypto');
require('dotenv').config()

const Url=require("./models/urls");

const dbconnect=require("./dbconnect");
const db=dbconnect();

const corsOptions = {
    origin: ["https://uurls.onrender.com","http://localhost:5173"] // frontend URI (ReactJS)
}

const app=express();

app.use(express.urlencoded({extended:true}));
app.use(cors(corsOptions));
app.use(express.json());

//Todo: redirect to "uurls.com.np frontend"
app.get("/",(req,res)=>{
res.redirect("https://uurls.onrender.com");
});

app.get("/links",async(req,res)=>{
    // can be either createdOn or clicks
    // links/?limit=5&sortby=clicks
    const lim = parseInt(req.query.limit) || 5;
    
    sortparam=req.params.sortparam||"createdOn";
    sortorder=-1;
    try{
        const list=await Url.find().sort({[sortparam]:sortorder}).limit(lim);
        res.json(list);
    }
    catch(err){
        console.log(err);
        res.status(500).send([]);
    }
});

app.get("/:shorturl",async (req,res)=>{
    console.log(req.params.shorturl);
    try{
        const requiredUrldata=await Url.findOne({shorturl:req.params.shorturl});
        if(requiredUrldata)
        {
            requiredUrldata.clicks+=1;
            requiredUrldata.save();
    
            console.log("Clicked urldata: ", requiredUrldata);
            const longurl= requiredUrldata?.longurl;
            res.redirect(longurl);
        }
        else{
            res.status(404).send();
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send();
    }
});





app.post("/",async(req,res)=>{
try{

    if(!(await Url.findOne({shorturl:req.body?.shorturl})))
    {
    const newurl= await Url.create({
        longurl:req.body.longurl,
        shorturl:req.body.shorturl||generateShortUrl(),
        createdOn: (new Date())
        }); 

    await newurl.save();
    console.log(newurl)
    res.json(newurl);
    }
}
catch(err)
{
    console.log(err);
}
});


app.listen(process.env.PORT||6000,()=>{console.log("app running")});



function generateShortUrl()
{
    const choices="1234567890abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let shorturl="";
    for(i=0;i<4;i++)
    {
        shorturl=shorturl.concat(choices[randomInt(0,81)]);
    }
    return shorturl;
}