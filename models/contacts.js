var mongoose = require("mongoose");

//ORM Mapping
var Schema = mongoose.Schema;

var contacts = new Schema(
  {
    first_name:{
      type:String,
      required:true
    },
    last_name:{
      type:String
    },
    email:{
      type:String,
      required:true
    },
    mobile:{
      type:Number
    },
    auth:{
      type:String,
      required:true
    }, 
    device_token:{
      type:String,
      required:true
    }, 
    finger_print:{
      type:String,
      required:true

    },
    created_at:{
      type:String
    }
  });

//Model Register
mongoose.model("contacts",contacts);

var ContactModel = {};

ContactModel.model = mongoose.model("contacts");

//view user order by id
ContactModel.addContact =  (contact, callback)=> {
    contact.created_at = Date.now();
    contact = new ContactModel.model(contact);
    contact.save((error, doc)=>{
      callback(error, doc)
    });
};

ContactModel.getList = (perPage,pageNum,user,callback)=> {
  var contacts = ContactModel.model.find({
    "auth":user.auth,
    "finger_print":user.finger_print,
    "device_token":user.device_token
  }).skip(perPage * (pageNum-1)).limit(perPage).exec((error,docs) => { callback(error,docs) });

}

ContactModel.getRecentList = (limitNum,user,callback)=>{
  var contacts = ContactModel.model.find({
    "auth":user.auth,
    "finger_print":user.finger_print,
    "device_token":user.device_token
  }).sort("-created_at").limit(limitNum).exec((error,docs) => { callback(error,docs) });
}
module.exports = ContactModel