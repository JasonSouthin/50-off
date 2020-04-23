const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: { 
        type: String,
        required: true
    },
    price: { 
        type: Number,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: { 
        type: String,
        required: true
    },
    createdBy: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

module.exports = mongoose.model('Product', productSchema);



// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectID(id) : null;
//     this.userId = userId;
//   }

//   async save() {

//       try { 
//         const db = await getDb();
//         let dbOp;
//         if(this._id){
//             // update the product
//             dbOp =  await db.collection("products").updateOne({_id: this._id}, { $set: this });
//         } else { 
//             // insert product
//             dbOp = await db.collection("products").insertOne(this, function(err, res) {
//                 if (err) console.log(err);
    
//                 console.log(res)
//             });
//         }

//         return dbOp;

//         } catch (err) { 
//           console.log(err.stack)
//       }
//   }

//   static fetchAll() {
//       try { 
//         const db = getDb();
//         return db.collection('products').find().toArray().then(products => {
//             console.log(products);
//             return products;
//         });
//       } catch (err) { 
//           console.log (err)
//       }
//   }

//   static findById(prodId) { 
//       try { 
//         const db = getDb();
//         return db.collection('products').find({_id: new mongodb.ObjectID(prodId)}).next()
//         .then(product => { 
//             return product;
//         });
        
//       } catch (err) { 
//           console.log(err);
//       }
      
//   }
  
//   static deleteById(prodId) {
//     try { 
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectID(prodId)})
//         .then(result => { 
//             console.log('Deleted');
//         });
        
//       } catch (err) { 
//           console.log(err);
//       }
//   }
// }

// module.exports = Product;
