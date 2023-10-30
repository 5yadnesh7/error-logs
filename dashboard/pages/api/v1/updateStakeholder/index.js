import axios from 'axios'

const updateStakeholder = async (req, res) => {
    try {
        let { id, isActive } = req.body

        const axiosOpt = {
            method: 'POST',
            data: { id, isActive },
            url: `${process.env.ERROR_LOG}/updateUser`,
        }
        let resDeal = await axios(axiosOpt)

        const data = resDeal.data
        if (data.status) {
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

export default updateStakeholder
