import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import styled from '@emotion/styled'
import { Pagination } from '@mui/material'
import { useRouter } from 'next/router'
import { getStakeHolderName, getStatusName } from '../../libs/frontend'

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

export default function ErrorTable(props) {
    const {
        respVal,
        page,
        setPage,
        users,
        pageCount,
        status,
    } = props
    const router = useRouter()

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const redirectPage = (id) => {
        router.push(`/details?id=${id}`)
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">
                                Project Name
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Title
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Stake Holder
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Status
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Today Count
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Total Count
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {respVal?.length > 0 ? (
                            respVal?.map((resp) => (
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
                                    >
                                        {resp.projectName}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="left"
                                        onClick={() =>
                                            redirectPage(resp._id)
                                        }
                                        sx={{
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {resp.title}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {resp?.stakeHolder !== ''
                                            ? getStakeHolderName(
                                                  resp?.stakeHolder,
                                                  users
                                              )
                                            : 'None'}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {getStatusName(resp.status, status)}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {resp.todayCount}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {resp.totalCount}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell></StyledTableCell>

                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell
                                    className=""
                                    style={{
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span>No Data Found</span>
                                </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <div
                style={{
                    justifyContent: 'center',
                    display: 'flex',
                    marginTop: '20px',
                }}
            >
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handleChangePage}
                    color="secondary"
                />
            </div>
        </>
    )
}
