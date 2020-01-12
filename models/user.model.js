const mongoose =  require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
let Users = new Schema({
password:{
    type:String,
    default:''
},
email:{
    type:String,
    required:true,
    trim:true
},
username:{
    type:String,
    required:true,
    trim:true
},
role:{
    type:String,
    required:true,
    trim:true
},
firstName:{
    type:String,
    default:''
},
lastName:{
    type:String,
    default:''
},
cin:{
    type:String,
    default:''
},
cne:{
    type:String,
    default:''
},
class_id:{
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

Users.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}
Users.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}
module.exports = mongoose.model('Users',Users);