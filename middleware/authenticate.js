const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");


const authenticate =async(req,res,next)=>{
    try{
        const token = req.cookies.jwtoken;
        if(token === undefined ){
            return res.sendStatus(400);
        }
        const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id: verifyToken._id,"tokens.token":token});
        if(!rootUser){
            throw new Error("User not found");
            return req.login = false;
        }
        req.token = token;
        req.rootUser = {
            _id: rootUser._id.toString(),
            name: rootUser.name,
            email: rootUser.email,
            password: rootUser.password,
            cpassword: rootUser.cpassword,
            __v: rootUser.__v,
            tokens:[
                rootUser.tokens[rootUser.tokens.length-1]
                ]
          };
        req.userId = rootUser._id;
        req.login = true;
        next();

    }catch(e){
        res.status(401).json({status:401,message:"unauthorised"});
        console.log(e);
    }
}

module.exports = authenticate;