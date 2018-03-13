var express = require('express');
var router = express.Router();
var mongoose =  require('mongoose');

//get product model object to access products in mongodb
var productModel = mongoose.model("products");

router.use(function(req,resp,next){
  if(req.session.logged){
    resp.locals={
      username:req.session.username
    }
    next();
  }

   else
     resp.redirect("/users/login");
});
var userModel = mongoose.model("users");
/* GET product listing. */
router.get('/', function(req, res, next) {
  var products = productModel.find({},function (error,doc) {
    //render view after get products (as find is async/non-blocking function)
    //get html file

  //  userModel.findOne({_id:doc.owner,name},function (error,userdoc) {
  //  doc.owner = userdoc.name;
    console.log(doc);
    //change owner id to owner name
    res.render("products/list",{products:doc});
//  });
  });
});


//get add product page
router.get("/add",function (req,res) {
  //get html file
  res.render("products/add");
});


//save product
router.post("/add",function (req,res) {

  var product = req.body;
  //save product obj to db
  product._id = Date.now();
  product.owner = req.session.userId;
  product = new productModel(product);
  product.save(function (error,doc) {
    console.log(error);
    console.log(doc);
    res.redirect("/products/");

  });
});

//edit product
router.get("/edit/:id",function (req,res) {
    productModel.findOne({_id:req.params.id},function (error,doc) {
      res.render("products/edit",{product:doc});
    });
});


//update product
router.post("/edit/:id",function (req,res) {
  //POST Edit
  var body = req.body;
  productModel.update({_id:req.params.id},
                   {"$set":
                      {name:body.name,desc:body.desc,
                        category:body.category,price:body.price,url:body.url}
                    },function (error,doc) {
                        res.redirect("../");
  });

});

//delete product
router.get("/delete/:id",function (req,res) {
  productModel.remove({_id:req.params.id},function (error,doc) {
    res.redirect("../");
  })
});

//search products
router.post("/search",function (req,res) {
    productModel.find({name:{$regex:req.body.search,$options:"si"}},function (error,doc) {
        res.render("products/list",{products:doc});
    });

});

module.exports = router;
