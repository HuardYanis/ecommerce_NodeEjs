const express = require('express');
const router = new express.Router();
const User = require('../model/User');
const Magasin = require('../model/Magasin');
const Product = require('../model/Product')
const Category= require('../model/Category');
const Panier = require('../model/Panier')
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

router.post('/ajouterpanier', (req, res) => {

 

    let id_user = req.session.iduser;
    let id_product = req.body.productId;
    let quantity = parseInt(req.body.quantity,10);
 
console.log(req.body)
  
    Panier.findOne({ user: id_user })
    .then((panier) => {
      if (!panier) {
        // Le panier n'existe pas encore, créer un nouveau panier
        let newPanier = new Panier({
          user: id_user,
          products: [
            {
              product: id_product,
              quantity: quantity,
            },
          ],
        });
        newPanier.save().then(() => {
          res.redirect('/Magasin');
        });
      } else {
        
        let existingProduct = panier.products.find((p) => p.product == id_product);

        if (existingProduct) {
          console.log(typeof quantity)
          existingProduct.quantity += quantity;
          panier.save().then(() => {
            res.redirect('/Magasin');
          });
        } else {
        
          panier.products.push({
            product: id_product,
            quantity: quantity,
          });
          panier.save().then(() => {
            res.redirect('/Magasin');
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });

})

router.get('/monpanier', (req, res) => {
      let id_user = req.session.iduser;

      let total= 0;

  Panier.findOne({user : id_user}).populate('products.product').then((panier) => {

      if(panier) {

        panier.products.forEach((product) => {
          total += product.product.price * product.quantity;
        })

      res.render('panier', { panier: panier, session: req.session, total:total})

      }else {
        res.render('panier', {session: req.session, vide: "vide"})
      }
          



      }).catch((err) => {console.log(err)});
})


router.get('/retirerpanier/:id', (req, res) => {
  Panier.updateOne({user: req.session.iduser },{$pull:{products:{ product:req.params.id}} }).then((panier)=>{

    res.redirect('/monpanier')

  }).catch((err) => {console.log(err)})
})



module.exports = router;