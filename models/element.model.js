const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
let Elements = new Schema({
prof_id:{
    type:String,
    default:''
},
element:{
    type:String,
    default:''
},
class_id:{
    type:String,
    default:''
}
},
{
    timestamps:true
});

module.exports = mongoose.model('Elements',Elements);