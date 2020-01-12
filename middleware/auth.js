const key = require('../keys/config').JWTSecret;
const jwt = require('jsonwebtoken');

function auth(req,res,next){
    const token = req.header('x-auth-token');

    if(!token) return res.status(401).json({msg:'UNAUTHORIZED REQUEST'});

        try{
            const decoded = jwt.verify(token,key);
            req.user = decoded;
            next();
        }catch(e){
            res.status(400).json({msg:'Token Unvalid'});
        }
   
}
module.exports = auth;