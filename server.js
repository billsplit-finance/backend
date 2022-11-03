const dotenv = require("dotenv");
const express = require("express");
const app = express();
const smartify = require("./sdebt_logic");
const PORT = process.env.PORT || "5000";
dotenv.config({path:__dirname+'./.env'});
require("./db/conn"); //link database
app.use(express.json());
app.use(require('./router/auth')); //link router files


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