const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
let Classes = new Schema({
filiere:{
    type:String,
    default:'',
    required:true
},
annee:{
    type:String,
    default:'',
    required:true

}},
{
    timestamps:true
});


module.exports = mongoose.model('Classes',Classes);