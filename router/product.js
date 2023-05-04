const express = require('express');
const router = new express.Router();
const User = require('../model/User');
const Magasin = require('../model/Magasin');
const Product = require('../model/Product')
const Category= require('../model/Category');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const multer = require('multer');
const upload = multer({
  dest: 'uploads/product/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});
const fs = require('fs');


router.use(session({

  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 246060*1000 } 
}))


router.get("/product", function(req, res){
    Category.find({}).then((category)=> {
            Product.find({}).then((product)=>{
                console.log(product)
                res.render('modifProduct', {category: category, product: product, session: req.session})
            })
    }).catch((err)=>{
        console.log(err)
    })
})


router.post('/createProduct', upload.single('image'), (req, res) => {



    const file = req.file;
  
  
    let name = req.body.name;
    let image = file.originalname;
    let price = req.body.price;
    let description = req.body.description;
    let category = req.body.category
  
    let newProduct = new Product({
        
        name:name,
        price:price,
        description: description,
        image:image,
        category:category
       
      
    }) 
    newProduct.save()
    .then(() => {
      console.log('New product created:');
      Product.findOne({ name: name })
        .then((product) => {
          fs.rename(file.path, `uploads/product/${file.originalname}`, (err) => {
            if (err) throw err;

          });
          res.redirect('/product')
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((error) => {
      console.error('Error creating magasin:', error);
      res.status(500).json({ error: 'Error creating magasin' });
    })
   
  })

  router.get('/ficheproduct/:id', (req, res)=>{
    let id_product = req.params.id;

    Product.findOne({_id:id_product}).populate('category')
                .then((product)=>{
                    let id_category = product.category;
                    Category.find({})
                                    .then((category)=>{
                                        res.render('ficheProduct',{category:category, product:product, session: req.session})
                                    }).catch((err)=>{
                                        console.log(err)
                                    })
                }).catch((err)=>{
                    console.log(err)
                })
  })

  router.post('/affiche', (req, res)=>{
    let idcate = req.body.idcate;
    Product.find({ category:idcate}).then(product => {

        Magasin.findOne({}).then((magasin)=>{

          Category.find({}).then((category)=>{
            res.render('monMagasin', { magasin: magasin, product: product, category: category, session: req.session });
          }).catch((err)=>{console.error(err)})

        }).catch((err)=>{console.error(err)})
      
    }).catch((err)=>{console.log(err)});
  })


  router.post('/modifierProduct/:id', upload.single('image'), (req, res) => {
    let id_product = req.params.id;
    let name = req.body.name;
    let file = req.file;
    let price = req.body.price;
    let description = req.body.description;
    let category = req.body.category
    if (file != null) {
      let image = req.file.originalname;
      fs.rename(file.path, `uploads/product/${file.originalname}`, (err) => { if (err) throw err; });
  
  
      
      Product.findOneAndUpdate({_id: id_product}, { name: name, price:price, description: description, image:image, category: category},
        { new: true }).then(product => {
          
  
          // res.render('monMagasin', { magasin: magasin , session: req.session });
          res.redirect('/ficheproduct/' + id_product);
        }
  
        ).catch((error) => {
          console.error('Error updating product:', error); res.status(500).json
  
        })
  
  
  
    } else {
  
      
      Product.findOneAndUpdate({_id: id_product}, { name: name, price:price, description: description, category: category },
        { new: true }).then(product => {
          
  
          // res.render('monMagasin', { magasin: magasin , session: req.session });
          res.redirect('/ficheproduct/' + id_product);
        }
  
        ).catch((error) => {
          console.error('Error updating magasin:', error); res.status(500).json
  
        })}
    })


    router.get('/deleteProduct/:id', (req, res) => {

      Product.findOneAndDelete({ _id: req.params.id}).then(() => {

        res.redirect('/product')

      }).catch((error) => {console.log(error)});

    })
  


module.exports = router;