const router = require('express').Router();
const User = require('../models/user.model');
const Class = require('../models/class.model');
const Element = require('../models/element.model');

const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const key = require('../keys/config').JWTSecret;
router.route('/').get(auth,(req,res) =>{
    User.find()
    .select('-password')

.then(users =>{ 
    
    Class.find().then((classes)=>{ res.json({users,classes}) })
    })
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});



router.route('/dashboard/:id').get(auth,(req,res)=>{
    prof_id = req.params.id;

    Element.find({prof_id}).then( elements=>{

        Class.find().then(classes =>{
            res.status(200).json({classes,elements});
        }).catch(err => res.status(400).json({msg:'Data Not Found'}));

        }
    ).catch(err => res.status(400).json({msg:'Data Not Found'}));

})


router.route('/:id').get(auth,(req,res) =>{
    User.findById(req.params.id)
    .select('-password')

.then(user => res.json(user))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/:id').delete(auth,(req,res) =>{
    User.findByIdAndDelete(req.params.id)
.then(() => res.json({msg:'User Deleted'}))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/profs/data').get((req,res) =>{
    User.find({role:'prof'})
    .select('-password')
.then(users => res.json(users))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/admins/data').get(auth,(req,res) =>{
    User.find({role:'admin'})
    .select('-password')
.then(users => res.json(users))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/students/data').get(auth,(req,res) =>{
    User.find({role:'student'})
    .select('-password')
.then(users => res.json(users))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});


router.route('/update/:id').post(auth,(req,res) =>{
    const {  class_id, role, firstName , lastName, password } = req.body;
    if(role && role == 'student'){
        if(!class_id  || !password   || !firstName  || !lastName){
            return res.status(400).json({msg : 'All fields are required'});
        }

        User.findById(req.params.id)
        .then( user =>{
            user.firstName = firstName;
            user.lastName = lastName;
            user.password = bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
            user.class_id = class_id;
            user.save()
            .then(()=> res.json({msg:'User Updated'}))
            .catch(err => res.status(400).json({msg:'User has not been updated '}));
    
        }).catch(err => res.status(400).json({msg:'User  not  found'}));
    }else{
        if(!password   || !firstName  || !lastName){
            return res.status(400).json({msg : 'All fields are required'});
        }
        User.findById(req.params.id)
        .then( user =>{
    
            user.firstName = firstName;
            user.lastName = lastName;
            user.password = bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
            user.save()
            .then(()=> res.json({msg:'User Updated'}))
            .catch(err => res.status(400).json({msg:'User has not been updated '}));
    
        }).catch(err => res.status(400).json({msg:'User  not  found'}));

    }
    
});




router.route('/add').post(auth,(req,res) =>{

    const { email,username, password , firstName, lastName, cin, cne , role , class_id} = req.body;
    if(role && role=='student'){
        if(!username  || !password  || !email || !firstName || !lastName || !role || !cin || !cne || !class_id){
            return res.status(400).json({msg : 'All fields are required'});
        }
        User.findOne({cne})
        .then(user =>{
            if(user) return res.status(400).json({msg:'cne Already exists'});

            User.findOne({email})
            .then( user =>{ 
                if(user) return res.status(400).json({msg:'email Already exists'});
                User.findOne({username}).then(user => {    
                    
                    if(user) return res.status(400).json({msg:'username Already exists'});  
                
                    User.findOne({cin}).then(user => {    
                            if(user) return res.status(400).json({msg:'cin Already exists'});  
                        
        
                            const newUser = new User();
        
             
                            newUser.username =  username;
                            newUser.email =  email;
                            newUser.password =  newUser.generateHash(password);
                            newUser.role =  role;
                            newUser.firstName =  firstName;
                            newUser.lastName =  lastName;
                            newUser.cin =  cin;
                            newUser.cne =  cne;
                            newUser.class_id =  class_id;
                            newUser.save()
                            .then((user) => {
                                
                                jwt.sign(
                                    {id :user.id},
                                    key,
                                    {expiresIn: 3600},
                                    (err,token) => {
                                        if(err) throw err;
                                        res.json({
                                            token,
                                            user: {
                                                id:user.id,
                                                username: user.username,
                                                email: user.email
                                            }
                                        });
                                    }
                                    
                                )
                            }).catch(err => res.status(400).json({msg : err}));
        
                            
                        })
        
                })
        
        
        
            })
        })
    }else{

        if(!username  || !password  || !email || !firstName || !lastName || !role || !cin){
            return res.status(400).json({msg : 'All fields are required'+username+cin+role+lastName+firstName+email+password});
        }
    
        User.findOne({email})
        .then( user =>{ 
            if(user) return res.status(400).json({msg:'email Already exists'});
            User.findOne({username}).then(user => {    
                
                if(user) return res.status(400).json({msg:'username Already exists'});  
            
                User.findOne({cin}).then(user => {    
                        if(user) return res.status(400).json({msg:'cin Already exists'});  
                    
    
                        const newUser = new User();
    
         
                        newUser.username =  username;
                        newUser.email =  email;
                        newUser.password =  newUser.generateHash(password);
                        newUser.role =  role;
                        newUser.firstName =  firstName;
                        newUser.lastName =  lastName;
                        newUser.cin =  cin;
                        newUser.cne =  cne;
                        newUser.class_id =  class_id;
                        newUser.save()
                        .then((user) => {
                            
                            jwt.sign(
                                {id :user.id},
                                key,
                                {expiresIn: 3600},
                                (err,token) => {
                                    if(err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id:user.id,
                                            username: user.username,
                                            email: user.email
                                        }
                                    });
                                }
                                
                            )
                        }).catch(err => res.status(400).json({msg : err}));
    
                        
                    })
    
            })
    
    
    
        })

    }
    

});
module.exports =  router;