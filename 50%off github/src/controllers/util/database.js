// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://Jason:GclYlwsoNkbyyFUC@cluster0-thbmy.mongodb.net/shop?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });

// let _db;
// const mongoConnect = async (callback) => { 
//     await client.connect(err => {
//         _db = client.db();
//         // perform actions on the collection object
//         console.log(_db)
//         callback();
//       });
// }

// const getDb = () => {
//     if(_db){ 
//         return _db;
//     }
//     throw 'No Db Found!';
// }

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;