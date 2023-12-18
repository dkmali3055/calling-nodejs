const API_KEY = process.env.VIDEOSDK_API_KEY;
const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;
const jwt = require("jsonwebtoken");
function getTokens (req, res){
  
    const options = { expiresIn: "1d", algorithm: "HS256" };
  
    const payload = {
      apikey: API_KEY,
      permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
    };
  
    const token = jwt.sign(payload, SECRET_KEY, options);
    return res.json({ token });
  };
  
  //export the function
    module.exports = {
        getTokens
    };