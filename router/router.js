
const express = require('express');
const router = new express.Router();
const User = require('../model/User');
const Magasin = require('../model/Magasin');
const Category = require('../model/Category');
const Product = require('../model/Product')
const bcrypt = require('bcryptjs');
const session = require('express-session');


router.use(session({

  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 246060*1000 } 
}))


router.get('/Magasin', (req, res) => {
    Promise.all([
      Magasin.findOne().exec(),
      Category.find().exec()
      
    ])
    .then(([magasin, category]) => {
       
      res.render('monMagasin', { magasin: magasin, category: category, session: req.session });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('An error occurred');
    });
  });

router.get('/', (req, res) => {
    res.render("inscription")
})

router.post('/enregistrer', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let adresse = req.body.adresse;
    let telephone = req.body.telephone;

let salt = bcrypt.genSaltSync(10)   
let hashpassword =   bcrypt.hashSync(password, salt)

   User.findOne({email:email}).then((user)=>{

       if(!user){


           let newUser = new User ({
                                       email:email,
                                       password:hashpassword,
                                       firstname:firstname,
                                       lastname:lastname,
                                       adresse:adresse,
                                       telephone:telephone
                                   })
           newUser.save()
           .then((user)=>{
                let msg = "compte creer";
                res.render('connection',{inscriptionsuccess:msg})
           })
           .catch((error) => {
               console.error('Error creating user:', error);
               res.status(500).json({ error: 'Error creating user' });
             })
        
       }else{
        let emailused ="not ok";
        res.render('inscription',{emailused:emailused})
       } 
    }).catch((err)=>{
        console.log(err)
    })
    
})

router.get('/connection', (req, res)=>{
    res.render("connection")
})


router.post('/seconnecte', (req, res)=>{

    let email = req.body.email;
    let password = req.body.password;

                 User.findOne({email:email})
                        .then((user)=>{
                            if(user){
                               if(bcrypt.compareSync(password, user.password))
                               {

                                    req.session.iduser = user.id
                                    req.session.email = user.email
                                    req.session.firstname = user.firstname
                                    req.session.lastname = user.lastname
                                    req.session.admin = user.admin

                                    req.session.save(() => {
                                        console.log('session saved');
                                        
                                        if(user.admin == true){
                                            var magasinCount = Magasin.count({}).then(count => {
                                                if(count == 0){
                                                    res.render("admin", { session: req.session}) 
                                                }else {
                                                    Magasin.findOne({}).then(magasin => {
                                                        var categoryCount = Category.count({}).then(count => {

                                                            if(count == 0){

                                                                res.redirect('/Magasin');

                                                            }else{
                                                                Category.find({}).then((category) =>{

                                                                    res.redirect('/Magasin');

                                                                })
                                                            }

                                                        })
                                                    }).catch(err => { console.log(err) })
                                                }
                                             })
                                              

                                             
                                    
                                        }else{
                                            res.redirect('/Magasin')
                                        }
                                        
                                    });



                               }else{
                                    let mauvaismdp = "not ok";
                                    res.render('connection',{mauvaismdp:mauvaismdp})
                               }
                                 
                            }else{
                                let emailinexistant= "not ok";
                                res.render('connection',{emailinexistant:emailinexistant})
                            }
                        })
                        .catch((err)=>{
                            console.log(err)
                        })

    

})

router.get('/logout', (req, res) => {
    
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
       
        res.redirect('/connection');
      }
    });
  });

router.get('/accueil', (req, res) => {
    
    if (!req.session.email) {
      res.redirect('/connection');
    }
  
    res.render('accueil',{session: req.session});
  });
  
module.exports = router;
