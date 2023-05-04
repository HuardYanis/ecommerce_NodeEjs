const express = require('express');
const router = new express.Router();
const User = require('../model/User');
const Magasin = require('../model/Magasin');
const Category= require('../model/Category');
const Product = require('../model/Product');
const bcrypt = require('bcryptjs');
const session = require('express-session');


router.use(session({

  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 246060*1000 } 
}))

router.get("/category", function(req, res){
    Category.find({}).then((category)=> {
        res.render('modifCategory', {category: category, session: req.session})
    })
})





router.post('/createCategory', function(req, res) {
    

    let macategory = new Category({
                        name: req.body.category
                     });

    macategory.save().then((category) => {
        console.log(" created");
        res.redirect("/category")
    }).catch((err) => {console.log(err)})
})

router.get('/delete/:id', (req,res)=>{
    let id = req.params.id;
     Category.deleteOne({ _id: id})
                .then(()=>{
                    Product.deleteMany({ category: id }).then(()=>{res.redirect('/category')}).catch((err) => {console.log(err)});
                    
                }).catch((err)=>{
                    console.log(err)
                })
})

router.post('/modifCategory', (req,res)=>{
    
    let id = req.body.id;
    let newName = req.body.catename
    Category.findOneAndUpdate({_id: id}, {name:newName}, {new:true})
                    .then((category)=>{
                        res.redirect('/category')
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
})

module.exports = router;