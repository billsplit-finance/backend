const dotenv = require("dotenv");
dotenv.config({path:'./.env'});
const express = require("express");
const app = express();
const cors = require('cors');
const smartify = require("./sdebt_logic");
const PORT = process.env.PORT;
require("./db/conn"); //link database
app.use(express.json());
router.use(cookieParser());
app.use(cors);
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