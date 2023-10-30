import axios from 'axios'

const updateerrorlog = async (req, res) => {
    try {
        const { mobile, sid, source } = req.headers
        let { title, id } = req.body

        let query = {
            title: title,
            id,
        }

        const axiosOpt = {
            method: 'POST',
            data: query,
            url: `${process.env.ERROR_LOG}/deleteErr`,
        }
        let resDeal = await axios(axiosOpt)

        const data = resDeal.data
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

export default updateerrorlog
