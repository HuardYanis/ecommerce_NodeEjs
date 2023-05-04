
const express = require('express');
const router = new express.Router();
const Magasin = require('../model/Magasin');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});
const fs = require('fs');






router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 246060 * 1000 }
}))


router.post('/createMagasin', upload.single('banner'), (req, res) => {



  const file = req.file;


  let title = req.body.title;
  let banner = file.originalname;
  let adresse = req.body.adresse;
  let description = req.body.description;

  let newMagasin = new Magasin({
    title: title,
    banner: banner,
    adresse: adresse,
    description: description
  })
  newMagasin.save()
    .then(() => {
      console.log('New magasin created:');
      Magasin.findOne({ title: title })
        .then((magasin) => {
          fs.rename(file.path, `uploads/${file.originalname}`, (err) => {
            if (err) throw err;

          });
          res.render('monMagasin', { magasin: magasin, session: req.session });
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


router.get('/modifmagasin', (req, res) => {
  Magasin.findOne({}).then((magasin) => {
    
    res.render('modifMagasin', { magasin: magasin, session: req.session });
  }).catch((err) => {console.log(err)})
})

router.post('/updateMagasin', upload.single('banner'), (req, res) => {
  
  let title = req.body.title;
  let file = req.file;
  let adresse = req.body.adresse;
  let description = req.body.description;
  if (file != null) {
    let banner = req.file.originalname;
    fs.rename(file.path, `uploads/${file.originalname}`, (err) => { if (err) throw err; });


    
    Magasin.findOneAndUpdate({}, { title: title, banner:banner, adresse: adresse, description: description },
      { new: true }).then(magasin => {
        

        // res.render('monMagasin', { magasin: magasin , session: req.session });
        res.redirect('/Magasin');
      }

      ).catch((error) => {
        console.error('Error updating magasin:', error); res.status(500).json

      })



  } else {

    
    Magasin.findOneAndUpdate({}, { title: title, adresse: adresse, description: description },
      { new: true }).then(magasin => {
        

        // res.render('monMagasin', { magasin: magasin , session: req.session });
        res.redirect('/Magasin');
      }

      ).catch((error) => {
        console.error('Error updating magasin:', error); res.status(500).json

      })}
  })



module.exports = router;
