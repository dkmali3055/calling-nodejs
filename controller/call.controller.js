const API_KEY = process.env.VIDEOSDK_API_KEY;
const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/response.util");
const { Message } = require("../utils/constant");
function getTokens (req, res){
  try{
    const options = { expiresIn: "1d", algorithm: "HS256" };
  
    const payload = {
      apikey: API_KEY,
      permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
    };
  
    const token = jwt.sign(payload, SECRET_KEY, options);
    return successResponse(req, res, 200,Message.TOKEN_GENERATED, {token});
  }
  catch(err){
    console.log(err);
    return errorResponse(req, res,500,{message : err.message,stack : err.stack});
  }
  };
  
  //export the function
    module.exports = {
        getTokens
    };