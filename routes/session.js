const router = require('express').Router();
const Element = require('../models/element.model');
const User = require('../models/user.model');
const Session = require('../models/session.model');
const auth = require('../middleware/auth');

router.route('/').get(auth,(req,res) =>{
    Session.find()
.then(theSession => res.json(theSession))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});
 

router.route('/:id').get(auth,(req,res) =>{
    Session.findById(req.params.id)
.then(theSession =>  res.json({theSession}))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});




router.route('/all/:id').get(auth,(req,res) =>{
   prof_id= req.params.id;
    Session.find({prof_id})
    .then(sessions => {
        res.json({sessions})
})
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});


router.route('/:id').delete(auth,(req,res) =>{
    Session.findByIdAndDelete(req.params.id)
.then(() => res.json('Session Deleted'))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});



router.route('/add').post(auth,(req,res) =>{

    const { element_id,prof_id,hdeb,hfin } = req.body;

    if( !element_id  || !prof_id || !hdeb || !hfin){
        return res.status(400).json({msg : 'All fields are required'+element_id+prof_id+hdeb+hfin});
    }

        const theSession= new Session();
        theSession.element_id = element_id;
        theSession.prof_id = prof_id;
        theSession.hdeb = hdeb;
        theSession.hfin = hfin;
        theSession.save()
        .then((theSesion) => res.json(theSesion))
        .catch(err => res.status(400).json({msg:'Session has not been added '}));
});
module.exports =  router; 