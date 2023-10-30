import axios from 'axios'

const getstatus = async (req, res) => {
    try {
        const { isActive } = req.body

        let queryParams = ""
        if (isActive) {
            queryParams = `?isActive=${JSON.parse(isActive)}`
        }
        const results = await axios.get(`${process.env.ERROR_LOG}/getStatus${queryParams}`)

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

export default getstatus
