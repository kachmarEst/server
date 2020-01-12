const router = require('express').Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const key = require('../keys/config').JWTSecret;
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');




router.route('/login').post((req,res) =>{
    const{username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({msg : 'All fields are required'});
    }
    User.findOne({username})
    .then(user =>{
        if(!user) return res.status(400).json({msg :  'Doesnt exist'});

        bcrypt.compare(password,user.password)
        .then(isMatch => {
            if(!isMatch) return res.status(400).json({msg: 'Invalid '});
             jwt.sign(
                 {id: user.id},
                 key,
                 {expiresIn:3600},
                 (err,token) => {
                     if(err) throw err;
                     res.json({
                         token,
                         user:{
                             id:user.id,
                             username:user.username,
                             role:user.role
                         }
                     });
                 }
             )
        })
    })


});



router.route('/check').get((req,res) =>{
 
    const token = req.header('x-auth-token');

    if(!token) return res.status(401).json({msg:'UNAUTHORIZED REQUEST'});

        try{
            const decoded = jwt.verify(token,key);
           return res.status(200).json({msg:'Authorized Request',user:decoded})
        }catch(e){
            res.status(400).json({msg:'Token Unvalid'});
        }

    });
    



module.exports = router;


