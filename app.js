const express = require('express');
const app = express();
const mongoose = require('mongoose');cd ..
const router = require("./router/router")
const routerMagasin = require("./router/magasin")
const routerCategory = require("./router/category")
const routerProduct = require("./router/product")
const routerPanier = require("./router/panier")
const routerCommande = require("./router/commande")
const http = require('http').Server(app);
const io = require('socket.io')(http);
const helmet = require('helmet');
const path = require('path');

const port = 8000
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,'/uploads')))
app.use(router);
app.use(routerMagasin);
app.use(routerCategory);
app.use(routerProduct);
app.use(routerPanier);
app.use(routerCommande)
app.use(helmet());

mongoose.connect('mongodb://Admin:AFPA2023@127.0.0.1:27017/MonProjetNode?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


app.set('view engine', 'ejs');



http.listen(port, () => console.log(`Server running on port ${port}`));