const router = require('express').Router();
const Element = require('../models/element.model');
const Session = require('../models/session.model');
const Absence = require('../models/absence.model');
const User = require('../models/user.model');
const Class = require('../models/class.model');

const auth = require('../middleware/auth');

router.route('/').get(auth,(req,res) =>{
    Absence.find()
.then(theAbsence => res.json(theAbsence))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});


router.route('/counts/stats').get((req,res) =>{

        Absence.aggregate([
            {
                $group:
                {
                    _id: '$element_id',
                    hours:  {$sum:'$hours'}
                }
            }
        ])
        .then((av)=>{
res.status(200).json(av)
        })

//     User.find({role:'student'}).populate('classes')
// .then(theClass => res.json(theClass))
// .catch(err => res.status(400).json({msg:'Data Not Found'}));
});


router.route('/date/:id').get((req,res) =>{

    Absence.findById(req.params.id)
.then(theAbsence => {
    let date= new Date(theAbsence.createdAt);
    date =date.getFullYear();
    res.json(date)

})
.catch(err => res.status(400).json({msg:err}));
});

router.route('/students/:id').get((req,res) =>{
        session_id=req.params.id;
    Session.findById(session_id)
.then(session =>{
    Element.findById(session.element_id)
    .then(element =>{
        class_id=element.class_id;
        User.find({class_id})
        .then(students =>{

            Class.findById(class_id)
            .then(theClass =>{
                res.status(200).json({session,element,students,theClass})

            })
        })
    })

})
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});


router.route('/all/:id').get((req,res) =>{
    session_id=req.params.id;
Absence.find({session_id})
.then(absences =>{
            res.status(200).json(absences)
})
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});


router.route('/:id').get(auth,(req,res) =>{
    Absence.findById(req.params.id)
.then(theAbsence => res.json({theAbsence}))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/:id').delete(auth,(req,res) =>{
    Absence.findByIdAndDelete(req.params.id)
.then(() => res.json('Absence Deleted'))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});


router.route('/update/:id').post(auth,(req,res) =>{
    const { hours } = req.body;

    if( !hours ){
        return res.status(400).json({msg : 'All fields are required'});
    }
    Absence.findById(req.params.id)
    .then( theAbsence =>{

        theAbsence.hours = hours;
  


        theAbsence.save()
        .then(()=> res.json('theAbsence Updated'))
        .catch(err => res.status(400).json({msg:'Absence has not been updated '}));

    }).catch(err => res.status(400).json({msg:'Absence  not  found'}));
});


router.route('/add').post(auth,(req,res) =>{

    const {  etudiant_id,prof_id,element_id,hours,session_id } = req.body;

    if( !etudiant_id  || !prof_id || !element_id || !hours || !session_id){
        return res.status(400).json({msg : 'All fields are required'});
    }


        const theAbsence= new Absence();

        theAbsence.etudiant_id = etudiant_id;
        theAbsence.prof_id = prof_id;
        theAbsence.element_id = element_id;
        theAbsence.session_id = session_id;
        theAbsence.hours = hours;

        theAbsence.save()
        .then((theClass) =>{
            
            User.findById(etudiant_id)
            .then( student=>{
                student.hours+=hours;
                student.save()
                .then((stude)=> res.json(stude))        .catch(err => res.status(400).json({msg:'absence has not been added '}));

            })        .catch(err => res.status(400).json({msg:'absence has not been added '}));

        })
        .catch(err => res.status(400).json({msg:'absence has not been added '}));




});
module.exports =  router;