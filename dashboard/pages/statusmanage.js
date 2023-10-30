import React, { useState, useEffect } from 'react'
import { addStatus, getStatusRespData, updateStatus } from '../libs/api_requests'
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
import styled from '@emotion/styled'

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

const StatusManage = () => {

    const [allStatus, setAllStatus] = useState([])
    const [inpStatus, setInpStatus] = useState("")

    useEffect(() => {
        getStatus()
    }, [])

    const getStatus = async () => {
        const data = await getStatusRespData()
        setAllStatus(data.data.result)
    }

    const handleCheckboxChange = (ind, curVal) => {
        const existingAry = [...allStatus]
        existingAry[ind].isActive = !curVal
        setAllStatus([...existingAry])
    }

    const updatecurStatus = async (curStatus) => {
        const data = await updateStatus({ id: curStatus._id, isActive: curStatus.isActive })
        if (data.data.success) {
            alert(`Status updated ${curStatus.status}`)
        } else {
            console.log("Fail ", data.data);
            alert(`Fail to update status ${curStatus.status}`)
        }
    }

    const addcurStatus = async () => {
        if (inpStatus == "") {
            alert("Enter Status")
        } else {
            const data = await addStatus({ status: inpStatus })
            if (data.data.success) {
                alert(`Status added ${inpStatus}`)
                setInpStatus("")
                getStatus()
            } else {
                console.log("Fail ", data.data.message);
                alert(`Fail to add status ${inpStatus} msg: ${data.data.message}`)
            }
        }
    }

    return (
        <div style={{ width: "90%", marginLeft: '5%', minHeight: "100vh" }}>
            <Grid sx={{ display: 'flex' }}>
                <TextField
                    id="outlined-basic"
                    label="Status"
                    variant="outlined"
                    value={inpStatus}
                    onChange={(e) => setInpStatus(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={addcurStatus} sx={{ marginLeft: "20px" }}>
                    Add
                </Button>
            </Grid>
            <div style={{ marginTop: '20px', marginBottom: "20px" }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">
                                    Status
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
                            {allStatus?.map((resp, ind) => (
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
                                        {resp.status}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="center"
                                        component="th"
                                        scope="row"
                                        sx={{ padding: "8px" }}
                                    >
                                        <Checkbox
                                            checked={resp.isActive}
                                            onChange={() => handleCheckboxChange(ind, resp.isActive)}
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
                                        <Button onClick={() => updatecurStatus(resp)}>Update</Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default StatusManage
