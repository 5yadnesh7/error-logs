const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const { db } = require("./constants");

const url = db.dbUrl;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(url, { useUnifiedTopology: true })
        .then((client) => {
            console.log("Connected!");
            _db = client.db(db.dbName);
            callback(_db);
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found!";
};

const closeDb = () => {
    _db.close();
    return;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
exports.closeDb = closeDb;
exports.url = url;