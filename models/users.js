var mongoose = require("mongoose");

//ORM Mapping
var Schema  = mongoose.Schema;

var users = new Schema({
    _id:{
      type:Number
    },
    name:{
      type:String
    },
    password:{
      type:String
    }
});

//Model Register
mongoose.model("users",users);
