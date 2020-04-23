const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
    name: { // Store name
        type: String,
        required: true
    },
    location: {  // use google maps to map location - optional - can be online store address ( www.asdasd.com )
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    isShop: { 
        type: Boolean,
        required: true
    },
    Logo: {  // figure out how to store static images ( optional at end or further down the line )
        type: String
    },
            // possibly add subscription in future
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [
            {
                productId: {type: Schema.Types.ObjectId, ref: 'Shop', requried: true},
                quantity: {type: Number, required: true}
            }
        ]
    }
});

module.exports = mongoose.model('userStore', shopSchema);