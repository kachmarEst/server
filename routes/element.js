const router = require('express').Router();
const Element = require('../models/element.model');
const Class = require('../models/class.model');
const User = require('../models/user.model');
const auth = require('../middleware/auth');

router.route('/').get(auth,(req,res) =>{
    Element.find()
.then(theElement => res.json(theElement))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/all').get(auth,(req,res) =>{
    Element.find()
.then(theElement => {

        User.find({role:'prof'}).then(prof =>{
            Class.find().then(clas =>{

                res.json({elements:theElement,profs:prof,classes:clas})

            })
        })


})
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/:id').get(auth,(req,res) =>{
    Element.findById(req.params.id)
.then(theElement => {
        Class.findById(theElement.class_id)
        .then((theClass) =>{
            User.findById(theElement.prof_id)
            .then(theProf =>{

                res.json({elem: theElement,prof:theProf,clas:theClass})

            }).catch(err => res.status(400).json({msg:'Data Not Found'}));

        }).catch(err => res.status(400).json({msg:'Data Not Found'}));



})
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/:id').delete(auth,(req,res) =>{
    Element.findByIdAndDelete(req.params.id)
.then(() => res.json('Element Deleted'))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});


router.route('/update/:id').post(auth,(req,res) =>{
    const {  class_id,prof_id,element } = req.body;

    if( !class_id  || !prof_id || !element){
        return res.status(400).json({msg : 'All fields are required'});
    }
    Element.findById(req.params.id)
    .then( theElement =>{

        theElement.class_id = class_id;
        theElement.prof_id = prof_id;
        theElement.element = element;


        theElement.save()
        .then(()=> res.json('theElement Updated'))
        .catch(err => res.status(400).json({msg:'Element has not been updated '}));

    }).catch(err => res.status(400).json({msg:'Element  not  found'}));
});


router.route('/add').post(auth,(req,res) =>{

    const {  class_id,prof_id,element } = req.body;

    if( !class_id  || !prof_id || !element){
        return res.status(400).json({msg : 'All fields are required'});
    }


        const theElement= new Element();

        theElement.class_id = class_id;
        theElement.prof_id = prof_id;
        theElement.element = element;

        theElement.save()
        .then((element) => res.json(element))
        .catch(err => res.status(400).json({msg:'element has not been Added '}));




});
module.exports =  router;