import styled from '@emotion/styled'
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
import moment from 'moment/moment'
import React from 'react'

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

const RecordTable = ({ data }) => {
    return (
        <div>
            <TableContainer component={Paper}>
                <Table
                    sx={
                        {
                            //  minWidth: 650
                        }
                    }
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">
                                Date
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Count
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((resp, idx) => (
                            <StyledTableRow
                                key={idx}
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
                                >
                                    {moment(resp.date).format('DD-MM-YYYY')}
                                </StyledTableCell>
                                <StyledTableCell
                                    align="center"
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                >
                                    {resp.count}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default RecordTable
