import axios from 'axios'

const addStatus = async (req, res) => {
    try {
        let { status } = req.body

        const axiosOpt = {
            method: 'POST',
            data: { status },
            url: `${process.env.ERROR_LOG}/insertStatus`,
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
                message: data?.data || data?.message || 'Something went wrong',
                result: [],
            })
        }
    } catch (error) {
        console.log('Error ' + error)
    }
}

export default addStatus
