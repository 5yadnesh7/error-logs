const { db } = require('./constants');
const { insertData, getData, updateData, aggregationFunc, deleteData } = require('./methods');
const ObjectId = require('mongodb').ObjectId;

// error api's
module.exports.insertErr = async function (req, res) {
    try {
        const { projectName, errString } = req.body;
        if (projectName && errString) {
            const sTrim = errString.search("\t") == -1 ? 10 : 8
            const eTrim = errString.search("\t") == -1 ? 5 : 3
            const fInd = errString.indexOf("error") + sTrim
            const newString = errString.slice(fInd)
            const sInd = newString.indexOf("trace") - eTrim
            const title = newString.slice(0, sInd)

            getData({ title }, {}, db.dbCollection, (rsp) => {
                if (rsp.length) {
                    const dateAry = rsp[0].records
                    const currentDate = new Date().toISOString().split('T')[0];
                    const exInd = dateAry.findIndex(item => {
                        const itemDate = new Date(item.date).toISOString().split('T')[0];
                        return itemDate === currentDate;
                    });
                    if (exInd !== -1) {
                        dateAry[exInd].count++;
                    } else {
                        dateAry.push({
                            "date": currentDate + "T00:00:00.000Z",
                            "count": 1
                        });
                    }

                    const newObj = {
                        records: dateAry,
                        errString,
                        updateTime: new Date()
                    }

                    updateData({ title }, newObj, db.dbCollection, (upRes) => {
                        if (upRes.acknowledged) {
                            res.send({ status: true, message: "Success", data: "Error updated" })
                        } else {
                            res.send({ status: false, message: "Fail", data: upRes })
                        }
                    })
                } else {
                    const data = {
                        title,
                        projectName,
                        errString,
                        stakeHolder: "64fea22f898504bac1816af6",
                        status: "64fea1f4b5290a2f43eeacda",
                        records: [
                            { date: new Date(), count: 1 }
                        ],
                        branchName: "",
                        jira: "",
                        updatedBy: "",
                        updateTime: new Date(),
                        ip: ""
                    }
                    insertData(data, db.dbCollection, (rsp) => {
                        if (rsp.acknowledged) {
                            res.send({ status: true, message: "Success", data: "Error inserted" })
                        } else {
                            res.send({ status: false, message: "Fail", data: rsp })
                        }
                    })
                }
            })
        } else {
            res.send({ status: false, message: "Fail", data: "Please provide required node" });
        }
    } catch (e) {
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.getErr = async function (req, res) {
    try {
        // title, projectName, stakeHolder, status, branchName, jira, updatedBy
        const queryParams = req.query
        const filObj = {}
        for (const key in queryParams) {
            if (key !== "page" && key !== "limit") {
                if (queryParams[key] && queryParams[key] !== undefined) {
                    if (key === "id") {
                        filObj._id = new ObjectId(queryParams[key])
                    } else if (key === "title" || key === "jira" || key === "branchName") {
                        filObj[key] = { $regex: new RegExp(queryParams[key], "i") }
                    } else {
                        filObj[key] = queryParams[key]
                    }
                }
            }
        }
        const page = Number(queryParams.page) || 1
        const limit = Number(queryParams.limit) || 10
        const aggAry = [
            {
                $facet: {
                    count: [
                        {
                            $match: filObj,
                        },
                        {
                            $group: {
                                _id: null,
                                totCount: { $sum: 1 },
                            },
                        },
                    ],
                    data: [
                        {
                            $sort: {
                                updateTime: -1,
                            },
                        },
                        {
                            $match: filObj,
                        },
                        {
                            $skip: (page - 1) * limit,
                        },
                        {
                            $limit: limit,
                        },
                        {
                            $lookup: {
                                from: "error_logs_status",
                                let: { statusStr: "$status" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: [
                                                    { $toString: "$_id" },
                                                    "$$statusStr",
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: "statusInfo",
                            },
                        },
                        {
                            $lookup: {
                                from: "error_logs_users",
                                let: { userNameStr: "$stakeHolder" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: [
                                                    { $toString: "$_id" },
                                                    "$$userNameStr",
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: "userNameVal",
                            },
                        },
                        {
                            $unwind: "$statusInfo",
                        },
                        {
                            $unwind: "$userNameVal",
                        },
                        {
                            $unwind: "$records",
                        },
                        {
                            $group: {
                                _id: "$_id",
                                title: { $first: "$title" },
                                projectName: {
                                    $first: "$projectName",
                                },
                                errString: { $first: "$errString" },
                                stakeHolder: {
                                    $first: "$stakeHolder",
                                },
                                stakeHolderVal: {
                                    $first: "$userNameVal.username",
                                },
                                status: { $first: "$status" },
                                statusVal: {
                                    $first: "$statusInfo.status",
                                },
                                branchName: { $first: "$branchName" },
                                updatedBy: { $first: "$updatedBy" },
                                updateTime: { $first: "$updateTime" },
                                jira: { $first: "$jira" },
                                records: { $push: "$records" },
                                totalCount: {
                                    $sum: "$records.count",
                                },
                            },
                        },
                        {
                            $addFields: {
                                todayCount: {
                                    $function: {
                                        body: `function (records) {
                                            let todayCount = 0;
                                            const currentDate = new Date().toISOString().split("T")[0];
                                            const exInd = records.findIndex((item) => {
                                                const itemDate = new Date(item.date).toISOString().split("T")[0];
                                                return itemDate === currentDate
                                            });
                                            if (exInd !== -1) {
                                                todayCount = records[exInd].count;
                                            }
                                            return todayCount;
                                        }`,
                                        args: ["$records"],
                                        lang: "js",
                                    },
                                },
                            },
                        },
                        {
                            $sort: {
                                updateTime: -1,
                                todayCount: -1,
                                totalCount: -1,
                            },
                        },
                    ],
                    stakeHolder: [
                        {
                            $match: filObj,
                        },
                        {
                            $group: {
                                _id: "$stakeHolder",
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                id: "$_id",
                                count: 1,
                            },
                        },
                        {
                            $lookup: {
                                from: "error_logs_users",
                                let: { userNameStr: "$id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: [
                                                    { $toString: "$_id" },
                                                    "$$userNameStr",
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: "userNameVal",
                            },
                        },
                        {
                            $unwind: "$userNameVal",
                        },
                        {
                            $project: {
                                name: "$userNameVal.username",
                                id: 1,
                                count: 1,
                            },
                        },
                    ],
                    status: [
                        {
                            $match: filObj,
                        },
                        {
                            $group: {
                                _id: "$status",
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                id: "$_id",
                                count: 1,
                            },
                        },
                        {
                            $lookup: {
                                from: "error_logs_status",
                                let: { statusStr: "$id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: [
                                                    { $toString: "$_id" },
                                                    "$$statusStr",
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: "statusInfo",
                            },
                        },
                        {
                            $unwind: "$statusInfo",
                        },
                        {
                            $project: {
                                name: "$statusInfo.status",
                                id: 1,
                                count: 1,
                            },
                        },
                    ],
                    projectName: [
                        {
                            $match: filObj,
                        },
                        {
                            $group: {
                                _id: "$projectName",
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: "$_id",
                                count: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$count",
                },
            },
            {
                $project: {
                    count: "$count.totCount",
                    data: 1,
                    stakeHolder: 1,
                    status: 1,
                    projectName: 1,
                },
            },
        ]
        aggregationFunc(aggAry, db.dbCollection, (rsp) => {
            res.send({ status: true, message: "Success", data: rsp?.length ? rsp[0] : [] })
        })
    } catch (e) {
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.updateErr = async function (req, res) {
    try {
        // title, projectName, stakeHolder, status, branchName, jira, updatedBy
        const inpBody = req.body
        if (inpBody.id) {
            const updateObj = {}
            for (const key in inpBody) {
                if (key !== "title" && key !== "errString" && key !== "id") {
                    if (inpBody[key] && inpBody[key] !== undefined) {
                        updateObj[key] = inpBody[key]
                    }
                }
            }
            updateObj.updateTime = new Date()
            if (updateObj.status) {
                isIdExist(updateObj.status, "status", db.dbStatusCollection, res)
            }
            if (updateObj.stakeHolder) {
                isIdExist(updateObj.stakeHolder, "stakeHolder", db.dbUserCollection, res)
            }
            if (updateObj.updatedBy) {
                isIdExist(updateObj.updatedBy, "updatedBy", db.dbUserCollection, res)
            }
            updateData({ _id: new ObjectId(inpBody.id) }, updateObj, db.dbCollection, (upRes) => {
                if (upRes.acknowledged && upRes.matchedCount) {
                    res.send({ status: true, message: "Success", data: "Error updated" })
                } else {
                    if (upRes.matchedCount === 0) {
                        res.send({ status: false, message: "Fail", data: "Error not found" })
                    } else {
                        res.send({ status: false, message: "Fail", data: upRes })
                    }
                }
            })
        } else {
            res.send({ status: false, message: "Fail", data: "Please provide id" })
        }
    } catch (e) {
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.deleteErr = async function (req, res) {
    try {
        const { id } = req.body
        if (id) {
            deleteData({ _id: new ObjectId(id) }, db.dbCollection, (delRes) => {
                if (delRes.acknowledged && delRes.deletedCount) {
                    res.send({ status: true, message: "Success", data: "Error deleted" })
                } else {
                    if (delRes.deletedCount === 0) {
                        res.send({ status: false, message: "Fail", data: "Error not found" })
                    } else {
                        res.send({ status: false, message: "Fail", data: delRes })
                    }
                }
            })
        } else {
            res.send({ status: false, message: "Fail", data: "Please provide id" })
        }
    } catch (e) {
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

// user api's
module.exports.insertUser = async function (req, res) {
    try {
        const { username, email } = req.body;
        if (username && email) {
            getData({ username }, {}, db.dbUserCollection, (rsp) => {
                if (rsp.length) {
                    res.send({ status: false, message: "Fail", data: "User already exist" })
                } else {
                    const data = { username, email, isActive: true }
                    insertData(data, db.dbUserCollection, (insertRsp) => {
                        if (insertRsp.acknowledged) {
                            res.send({ status: true, message: "Success", data: "User added successfully" })
                        } else {
                            res.send({ status: false, message: "Fail", data: insertRsp })
                        }
                    })
                }
            })
        } else {
            res.send({ status: false, message: "Fail", data: "Please provide required node" });
        }

    } catch (e) {
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.getUser = async function (req, res) {
    try {
        const queryParams = req.query
        const sortObj = {}
        for (const key in queryParams) {
            if (key === "id") {
                sortObj._id = new ObjectId(queryParams[key])
            } else if (key === "isActive") {
                sortObj[key] = JSON.parse(queryParams[key])
            } else if (queryParams[key] && queryParams[key] !== undefined) {
                sortObj[key] = queryParams[key]
            }
        }
        getData(sortObj, {}, db.dbUserCollection, (rsp) => {
            res.send({ status: true, message: "Success", data: rsp })
        })

    } catch (e) {
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.updateUser = async function (req, res) {
    try {
        const inpBody = req.body
        if (inpBody.id) {
            const updateObj = {}
            for (const key in inpBody) {
                if (key !== "id") {
                    if (inpBody[key] !== undefined) {
                        updateObj[key] = inpBody[key]
                    }
                }
            }
            updateData({ _id: new ObjectId(inpBody.id) }, updateObj, db.dbUserCollection, (upRes) => {
                if (upRes.acknowledged && upRes.matchedCount) {
                    res.send({ status: true, message: "Success", data: "User updated" })
                } else {
                    if (upRes.matchedCount === 0) {
                        res.send({ status: false, message: "Fail", data: "User not found" })
                    } else {
                        res.send({ status: false, message: "Fail", data: upRes })
                    }
                }
            })
        } else {
            res.send({ status: false, message: "Fail", data: "Please provide id" })
        }
    } catch (e) {
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

// status api's
module.exports.insertStatus = async function (req, res) {
    try {
        const { status } = req.body;

        if (status) {
            getData({ status }, {}, db.dbStatusCollection, (rsp) => {
                if (rsp.length) {
                    res.send({ status: false, message: "Fail", data: "Status already exist" })
                } else {
                    insertData({ status, isActive: true }, db.dbStatusCollection, (insertRsp) => {
                        if (insertRsp.acknowledged) {
                            res.send({ status: true, message: "Success", data: "Status added successfully" })
                        } else {
                            res.send({ status: false, message: "Fail", data: insertRsp })
                        }
                    })
                }
            })
        } else {
            res.send({ status: false, message: "Fail", data: "Please provide required node" });
        }

    } catch (e) {
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.getStatus = async function (req, res) {
    try {
        const queryParams = req.query
        const sortObj = {}
        for (const key in queryParams) {
            if (key === "id") {
                sortObj._id = new ObjectId(queryParams[key])
            } else if (key === "isActive") {
                sortObj[key] = JSON.parse(queryParams[key])
            } else if (queryParams[key] && queryParams[key] !== undefined) {
                sortObj[key] = queryParams[key]
            }
        }
        getData(sortObj, {}, db.dbStatusCollection, (rsp) => {
            res.send({ status: true, message: "Success", data: rsp })
        })

    } catch (e) {
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.updateStatus = async function (req, res) {
    try {
        const inpBody = req.body
        if (inpBody.id) {
            const updateObj = {}
            for (const key in inpBody) {
                if (key !== "id") {
                    if (inpBody[key] !== undefined) {
                        updateObj[key] = inpBody[key]
                    }
                }
            }
            updateData({ _id: new ObjectId(inpBody.id) }, updateObj, db.dbStatusCollection, (upRes) => {
                if (upRes.acknowledged && upRes.matchedCount) {
                    res.send({ status: true, message: "Success", data: "Status updated" })
                } else {
                    if (upRes.matchedCount === 0) {
                        res.send({ status: false, message: "Fail", data: "Status not found" })
                    } else {
                        res.send({ status: false, message: "Fail", data: upRes })
                    }
                }
            })
        } else {
            res.send({ status: false, message: "Fail", data: "Please provide id" })
        }
    } catch (e) {
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

const isIdExist = (node, type, db, res) => {
    try {
        getData({ _id: new ObjectId(node) }, {}, db, (sRsp) => {
            if (sRsp.length == 0) {
                res.send({ status: false, message: "Fail", data: `Please provide proper ${type} id` })
            }
        })
    } catch (err) {
        res.send({ status: false, message: "Fail", data: `Please provide proper ${type} id` })
    }
}


// Old code for future if revert
// const aggAry = [
//     {
//         $facet: {
//             count: [
//                 {
//                     $match: filObj,
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         totCount: { $sum: 1 },
//                     },
//                 },
//             ],
//             data: [
//                 {
//                     $match: filObj,
//                 },
//                 {
//                     $sort: {
//                         updateTime: -1,
//                     },
//                 },
//                 {
//                     $skip: (page - 1) * limit,
//                 },
//                 {
//                     $limit: limit,
//                 },
//                 {
//                     $lookup: {
//                         from: "error_logs_status",
//                         let: { statusStr: "$status" },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: {
//                                         $eq: [
//                                             { $toString: "$_id" },
//                                             "$$statusStr",
//                                         ],
//                                     },
//                                 },
//                             },
//                         ],
//                         as: "statusInfo",
//                     },
//                 },
//                 {
//                     $lookup: {
//                         from: "error_logs_users",
//                         let: { userNameStr: "$stakeHolder" },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: {
//                                         $eq: [
//                                             { $toString: "$_id" },
//                                             "$$userNameStr",
//                                         ],
//                                     },
//                                 },
//                             },
//                         ],
//                         as: "userNameVal",
//                     },
//                 },
//                 {
//                     $unwind: "$statusInfo",
//                 },
//                 {
//                     $unwind: "$userNameVal",
//                 },
//                 {
//                     $project: {
//                         statusVal: "$statusInfo.status",
//                         stakeHolderVal: "$userNameVal.username",
//                         projectName: 1,
//                         errString: 1,
//                         stakeHolder: 1,
//                         records: 1,
//                         branchName: 1,
//                         updatedBy: 1,
//                         updateTime: 1,
//                         jira: 1,
//                         title: 1,
//                         status: 1,
//                     },
//                 },
//             ],
//             stakeHolder: [
//                 {
//                     $match: filObj,
//                 },
//                 {
//                     $group: {
//                         _id: "$stakeHolder",
//                         count: {
//                             $sum: 1,
//                         },
//                     },
//                 },
//                 {
//                     $project: {
//                         _id: 0,
//                         id: "$_id",
//                         count: 1,
//                     },
//                 },
//                 {
//                     $lookup: {
//                         from: "error_logs_users",
//                         let: { userNameStr: "$id" },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: {
//                                         $eq: [
//                                             { $toString: "$_id" },
//                                             "$$userNameStr",
//                                         ],
//                                     },
//                                 },
//                             },
//                         ],
//                         as: "userNameVal",
//                     },
//                 },
//                 {
//                     $unwind: "$userNameVal",
//                 },
//                 {
//                     $project: {
//                         name: "$userNameVal.username",
//                         id: 1,
//                         count: 1,
//                     },
//                 },
//             ],
//             status: [
//                 {
//                     $match: filObj,
//                 },
//                 {
//                     $group: {
//                         _id: "$status",
//                         count: {
//                             $sum: 1,
//                         },
//                     },
//                 },
//                 {
//                     $project: {
//                         _id: 0,
//                         id: "$_id",
//                         count: 1,
//                     },
//                 },
//                 {
//                     $lookup: {
//                         from: "error_logs_status",
//                         let: { statusStr: "$id" },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: {
//                                         $eq: [
//                                             { $toString: "$_id" },
//                                             "$$statusStr",
//                                         ],
//                                     },
//                                 },
//                             },
//                         ],
//                         as: "statusInfo",
//                     },
//                 },
//                 {
//                     $unwind: "$statusInfo",
//                 },
//                 {
//                     $project: {
//                         name: "$statusInfo.status",
//                         id: 1,
//                         count: 1,
//                     },
//                 },
//             ],
//             projectName: [
//                 {
//                     $match: filObj,
//                 },
//                 {
//                     $group: {
//                         _id: "$projectName",
//                         count: {
//                             $sum: 1,
//                         },
//                     },
//                 },
//                 {
//                     $project: {
//                         _id: 0,
//                         name: "$_id",
//                         count: 1,
//                     },
//                 },
//             ]
//         },
//     },
//     {
//         $unwind: {
//             path: "$count",
//         },
//     },
//     {
//         $project: {
//             count: "$count.totCount",
//             data: 1,
//             stakeHolder: 1,
//             status: 1,
//             projectName: 1,
//         },
//     },
// ]
// aggregationFunc(aggAry, db.dbCollection, (rsp) => {
//     if (rsp?.length && rsp[0].data?.length) {
//         rsp[0].data.map(item => {
//             item.totalCount = item.records.reduce((acc, cur) => acc + cur.count, 0)
//             const currentDate = new Date().toISOString().split('T')[0];
//             const exInd = item.records.findIndex(item => {
//                 const itemDate = new Date(item.date).toISOString().split('T')[0];
//                 return itemDate === currentDate;
//             });
//             let count = 0
//             if (exInd !== -1) {
//                 count = item.records[exInd].count
//             }
//             item.todayCount = count
//         })
//     }
//     res.send({ status: true, message: "Success", data: rsp?.length ? rsp[0] : [] })
// })