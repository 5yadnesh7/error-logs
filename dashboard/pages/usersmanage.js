import styled from '@emotion/styled'
import {
    Button,
    Checkbox,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    tableCellClasses,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { addStakeholder, getUserRespData, updateStakeholder } from '../libs/api_requests'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'black',
        color: 'white',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: '#E0E0E0',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}))

const Usersmanage = () => {
    const [data, setData] = useState([])
    const [userDetails, setUserDetails] = useState({ username: "", email: "" })

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        const data = await getUserRespData()
        setData(data.data.result)
    }

    const handleCheckboxChange = (ind, curVal) => {
        const existingAry = [...data]
        existingAry[ind].isActive = !curVal
        setData([...existingAry])
    }

    const updateUser = async(curUser) => {
        const data = await updateStakeholder({ id: curUser._id, isActive: curUser.isActive })
        if(data.data.success){
            alert(`User updated ${curUser.username}`)
        }else{
            console.log("Fail ",data.data);
            alert(`Fail to update user ${curUser.username}`)
        }
    }

    const addUser = async () => {
        if (userDetails.username == "") {
            alert("Enter Username")
        } else if (userDetails.email == "") {
            alert("Enter Email")
        } else {
            const data = await addStakeholder(userDetails)
            if (data.data.success) {
                alert(`User added ${userDetails.username}`)
                setUserDetails({ username: "", email: "" })
                getUser()
            } else {
                console.log("Fail ", data.data.message);
                alert(`Fail to add user ${userDetails.username} msg: ${data.data.message}`)
            }
        }
    }

    return (
        <div style={{ width: "90%", marginLeft: '5%', minHeight: "100vh" }}>
            <Grid sx={{ display: 'flex' }}>
                <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    value={userDetails.username}
                    onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                />
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    sx={{ marginLeft: "20px" }}
                />
                <Button variant="contained" color="primary" onClick={addUser} sx={{ marginLeft: "20px" }}>
                    Add
                </Button>
            </Grid>
            <div style={{ marginTop: '20px', marginBottom: "20px" }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">
                                    Username
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    isActive
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    Update
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((resp,ind) => (
                                <StyledTableRow
                                    key={resp._id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <StyledTableCell
                                        align="center"
                                        component="th"
                                        scope="row"
                                        sx={{ padding: "8px" }}
                                    >
                                        {resp.username}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="center"
                                        component="th"
                                        scope="row"
                                        sx={{ padding: "8px" }}
                                    >
                                        <Checkbox
                                            checked={resp.isActive}
                                            onChange={() => handleCheckboxChange(ind,resp.isActive)}
                                            inputProps={{
                                                'aria-label': 'controlled',
                                            }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="center"
                                        component="th"
                                        scope="row"
                                        sx={{ padding: "8px" }}
                                    >
                                        <Button onClick={()=>updateUser(resp)}>Update</Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default Usersmanage
