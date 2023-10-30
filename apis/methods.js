const { db } = require('./constants');
const getDb = require('./connection').getDb;

const insertData = async (data, collectionName, cb) => {
    const db = getDb();
    const insertedData = await db.collection(collectionName).insertOne(data)
    cb(insertedData)
}

const updateData = async (findObj, data, collectionName, cb) => {
    const db = getDb();
    const updatedData = await db.collection(collectionName).updateOne(findObj, { $set: data })
    cb(updatedData)
}

const getData = async (findObj, sortObj = {}, collectionName, cb) => {
    const db = getDb();
    const getData = await db.collection(collectionName)
        .find(findObj)
        .project({})
        .sort(sortObj)
        .toArray()
    cb(getData)
}

const deleteData = async (delObj, collectionName, cb) => {
    const db = getDb();
    const deletedData = await db.collection(collectionName).deleteOne(delObj)
    cb(deletedData)
}

const aggregationFunc = async (arr, collectionName, cb) => {
    const db = getDb();
    const data = await db.collection(collectionName).aggregate(arr).toArray()
    cb(data)
}

const autoDeleteOldError = () => {
    getData({ status: "64f18a0916acedacc0d87484" }, {}, db.dbCollection, (rsp) => {
        const creationDateAry = rsp.map(item => ({ title: item.title, date: item.records[0].date })) || []
        creationDateAry.map(item => {
            const diff = new Date() - new Date(item.date)
            if (diff > 7948800000) {
                removeOldErrLogs(item.title)
            }
        })
    })
}

const removeOldErrLogs = (title) => {
    deleteData({ title }, db.dbCollection, (delRes) => {
        if (delRes.acknowledged && delRes.deletedCount) {
            console.log("Error deleted ", title)
        } else {
            if (delRes.deletedCount === 0) {
                console.log("Error not found ", title)
            } else {
                console.log(delRes)
            }
        }
    })
}

module.exports = { insertData, updateData, getData, deleteData, aggregationFunc, autoDeleteOldError };