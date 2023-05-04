const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
  retrait: {
      date_r: Date,
      time_r: String       
  }

  
});

module.exports = mongoose.model('Commande', commandeSchema);