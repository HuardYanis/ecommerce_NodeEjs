const express = require('express');
const router = new express.Router();
const User = require('../model/User');
const Magasin = require('../model/Magasin');
const Product = require('../model/Product')
const Category= require('../model/Category');
const Panier = require('../model/Panier')
const Commande = require('../model/Commande');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const multer = require('multer');
const objectId = require('mongoose').Types.ObjectId;
const moment = require('moment-timezone');
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


router.get('/mescommandes', (req, res) => {

  let id_user = req.session.iduser
  let total = 0

  if(req.session.admin === true) {
    
Commande.find({}).populate('products.product').populate('user').then((commande) => {

        

      res.render('mesCommande', { commande: commande, session: req.session, total:total})


    }).catch((err) => {console.log(err)});



  }else{
    Commande.find({user: id_user}).populate('products.product').populate('user').then((commande) => {

      res.render('mesCommande', { commande: commande, session: req.session, total:total})

    }).catch((err) => {console.log(err)});
   
  }
})



router.post("/validerpanier", (req, res)=>{
    let iduser = req.session.iduser
    const retrait_Date = new Date(req.body.retrait_date);
    const isoDate = retrait_Date.toISOString().substring(0, 10);
    const retrait_Time = req.body.retrait_time;
    
    
    

    Panier.findOne({user: iduser}, {_id:0}).then((panier)=>{
      

        newCommande = new Commande ({
            user: iduser,
            products:panier.products,
            retrait: {
                date_r: isoDate,
                time_r: retrait_Time
            }
        })


        newCommande.save().then(()=>{
           
           Panier.deleteOne({user: iduser}, {_id:0}).then(()=>{
            res.redirect('/Magasin')
           }).catch((error)=>{console.log(error)});
        }).catch((error)=>{console.log(error)});


    }).catch((error)=>{console.log(error)});
})




module.exports = router;