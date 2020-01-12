const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
let Absence = new Schema({
element_id:{
    type:String,
    default:''
},
session_id:{
    type:String,
    default:''
},
etudiant_id:{
    type:String,
    default:''
},
prof_id:{
    type:String,
    default:''
},
hours:{
    type:Number,
    default:0
}
},
{
    timestamps:true
});

module.exports = mongoose.model('Absence',Absence);