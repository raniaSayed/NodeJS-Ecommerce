var express = require('express');
var router = express.Router();
var bcrypt=require("bcrypt");

var mongoose =  require('mongoose');
var multer = require("multer");
var fileUploadMid = multer({dest:"./public/imgs"});

//get user model object to access users in mongodb
var userModel = mongoose.model("users");

/* GET user listing. */
router.get('/', function(req, res, next) {
  var users = userModel.find({},function (error,doc) {
    //render view after get users (as find is async/non-blocking function)
    //get html file
    console.log(doc);
    res.render("users/list",{users:doc});
  });
});


//get add user page
router.get("/register",function (req,res) {
  //get html file
    res.render("users/register");
});


//save user
router.post("/register",fileUploadMid.single("avatar"),function (req,res) {

  var user = req.body;
  //create unique id
  user._id = Date.now();
  //get user image
  fs.renameSync("./public/images/"+req.file.filename,"./public/images/"+req.file.originalname);

  // user.image = req.file.originalname;
  //hash password
  var salt = bcrypt.genSaltSync();
  var hashedPassword = bcrypt.hashSync(req.body.password,salt);
  //bcrypt.compare("bacon", hash, function(err, res) {
    // res == true

  user = new userModel(user);
  user.password = hashedPassword;
  //save user obj to db
  user.save(function (error,doc) {
    console.log(error);
    console.log(doc);
    res.redirect("/users/");

  });
});
//get login html page
router.get("/login",function (req,res) {
    // console.log(req.session.logged);
    // if(req.session.loggedIn){
    //   res.redirect("/");
    // }
    // else
      res.render("users/login",{login:1});
});

//submit login request
router.post("/login",function (req,res) {
  //check username

  console.log(req.body);
  userModel.findOne({name:req.body.name},function (error,doc) {
    //validate hashedPassword
    bcrypt.compare(req.body.password,doc.password , function(err, result) {
      console.log(result);
      if(result!=false){
        //create session name
        req.session.username = doc.name;
        req.session.userId = doc._id;

        req.session.logged=true;

        res.render("users/home",{username:req.session.username});
      }else{
        res.send("not authorized");
      }
    });

})
});
// //home route
// router.get("/home",function (req,res) {
//     res.render("users/home");
// });


//edit user
router.get("/edit/:id",function (req,res) {
    userModel.findOne({_id:req.params.id},function (error,doc) {
      res.render("users/edit",{user:doc});
    });
});


//update user
router.post("/edit/:id",function (req,res) {
  //POST Edit
  var body = req.body;
  userModel.update({_id:req.params.id},
                   {"$set":
                      {name:body.name,password:body.password}
                    },function (error,doc) {
                        res.redirect("../");
  });

});

//delete user
router.get("/delete/:id",function (req,res) {
  userModel.remove({_id:req.params.id},function (error,doc) {
    res.redirect("../");
  })
});

//search users
router.post("/search",function (req,res) {
    userModel.find({name:{$regex:req.body.search,$options:"si"}},function (error,doc) {
        res.render("users/list",{users:doc});
    });

});

module.exports = router;
