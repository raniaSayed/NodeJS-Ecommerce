
var express = require('express');
var router = express.Router();
var mongoose =  require('mongoose');
var fs = require("fs");
var ContactModel = require("../models/contacts");


//let login user => UserA
let name = "UserA";
let current_user;
let auth ;
let device_token;
let finger_print;

//read auth file
var authFile = fs.readFileSync("static/auth.json");
//extract auth,device_token,finger_print in variables
  JSON.parse(authFile).forEach(user => {
   if(user.name === name ){
     current_user  = user;
     auth = user.auth;
     device_token = user.device_token;
     finger_print = user.finger_print;
   }
});

//middleware to check user authorization
var  checkAuth = (req,res,next)=>{
  let contact = req.body;

    
  //check security params
  if(contact.auth == auth && 
    contact.finger_print == finger_print &&
    contact.device_token == device_token){
      //go to next route
      next();
    }else{
      //send response
      res.json({statusCode:403,message:"Un Authorized"})
    }
};

//check authentication before any request
router.use(checkAuth);


//save contact
router.post("/addContact",function (req,res) {
  let contact = req.body;
   
  ContactModel.addContact(contact, (error,doc) => {
    if(!error){
      res.json({statusCode:200,message:"Success",data:doc});
    }
    else{
      res.json(error);
    }
  });
});

//get all contact with pagging 
router.post('/getList', function(req, res, next) {
  
  //default page items 5
  let perPage = 5;
  let pageNum = req.body.pageNum || 1;
  ContactModel.getList (perPage,pageNum,current_user, (error,docs) => {
      if(!error){
        res.json({statusCode:200,message:"Success",data:docs});
      }else{
        res.json(error);
      }
    });
});


//get latest 3 contacts added
router.post("/getRecentList",function(req,res){
  let limitNum = 3;
  ContactModel.getRecentList(limitNum,current_user, (error,docs) => {
    if(!error){
      res.json({statusCode:200,message:"Success",data:docs});
    }else{
      res.json(error);
    }
  });
});

module.exports = router;