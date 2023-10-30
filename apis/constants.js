const PORT = 2121;

const db = {
    dbUrl: "mongodb://192.168.42.233:27017",
    dbName: "betatesting",
    dbCollection: "error_logs",
    dbUserCollection: "error_logs_users",
    dbStatusCollection: "error_logs_status"
}

module.exports = { PORT, db }