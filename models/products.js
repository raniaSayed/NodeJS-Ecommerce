var mongoose = require("mongoose");

//ORM Mapping
var Schema = mongoose.Schema;

var products = new Schema(
  {
    _id:{
      type:Number
    },
    name:{
      type:String
    },
    desc:{
      type:String
    },
    category:{
      type:String
    },
    price:{
      type:Number
    },
    owner:{
      type:Number,
      ref:"users"
    }

  });

//Model Register
mongoose.model("products",products);
