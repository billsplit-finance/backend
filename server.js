const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require('cors');
const smartify = require("./sdebt_logic");
const PORT = process.env.PORT || 5000;
require("./db/conn"); //link database
app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
    exposedHeaders: ["set-cookie"],
}));
app.use(require('./router/auth')); //link router files
// const corsOptions = {
    //     origin: true,
    //     credentials: true
    //   }
    // app.options('*', cors(corsOptions));
    // app.use(function(req, res, next) {
        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
        //     next();
        //     });


app.get("/",(req,res)=>{
    res.send("Home page");
})

// app.get("/login",middleware,(req,res)=>{
//     res.send("Welcome to login page");
// })
app.get("/register",(req,res)=>{
    res.send("Welcome to register page");
})


app.listen(PORT,()=>{
    console.log(`server is running on port: ${PORT}`);
})