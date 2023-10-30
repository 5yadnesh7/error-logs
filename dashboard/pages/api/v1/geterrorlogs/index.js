import axios from 'axios'

const geterrorlogs = async (req, res) => {
    try {
        const { mobile, sid, source } = req.headers
        let {
            title,
            stakeHolder,
            status,
            projectName,
            search,
            searchKeyword,
            page,
            limit,
            id,
        } = req.body

        let query = {
            id: id,
            title: title,
            stakeHolder: stakeHolder,
            projectName: projectName,
            status: status,
        }
        if (page) {
            query = {
                ...query,
                page: page,
            }
        }
        if (limit) {
            query = {
                ...query,
                limit: limit,
            }
        }

        if (search && searchKeyword) {
            Object.assign(query, { [search]: searchKeyword })
        }

        const cleanData = Object.entries(query)
            .filter(([key, value]) => value !== undefined)
            .reduce((obj, [key, value]) => {
                obj[key] = value
                return obj
            }, {})

        const queryParams = new URLSearchParams(cleanData).toString()

        const results = await axios.get(
            `${process.env.ERROR_LOG}/getErr?${queryParams}`
        )

        const data = results.data
        if (data.message == 'Success') {
            res.status(200).send({
                code: 0,
                success: true,
                message: data.message,
                result: data.data,
            })
        } else {
            res.status(200).send({
                code: 1,
                success: false,
                message: data.message || 'Something went wrong',
                result: [],
            })
        }
    } catch (error) {
        console.log('Error ' + error)
    }
}

export default geterrorlogs
