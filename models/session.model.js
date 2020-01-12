const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
let Session = new Schema({
hdeb:{
    type:String,
    default:''
},
hfin:{
    type:String,
    default:''
},
element_id:{
    type:String,
    default:''
},
prof_id:{
    type:String,
    default:''
}
},
{
    timestamps:true
});

module.exports = mongoose.model('Session',Session);