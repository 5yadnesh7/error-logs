import ErrorTable from '../components/errortable'
import { Box, Grid } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'
import Filter from '../components/filter'
import { responseData } from '../data/respData'
import { useEffect, useState } from 'react'
import {
    getStakeHolderId,
    getStatusId,
    searchBarDrop,
    getSearchByName,
} from '../libs/frontend'
import { getErrorData } from '../libs/api_requests'

export default function Home() {
    const [respValue, setRespValue] = useState()
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [status, setStatus] = useState()
    const [dropdownVal, setDropdownVal] = useState({
        stakeHolder: [],
        status: [],
        projectName: [],
    })
    const [filterState, setFilterState] = useState({
        projectName: undefined,
        status: undefined,
        stakeHolder: undefined,
        title: undefined,
    })
    const [searchBy, setSearchBy] = useState('')
    const [searchKeyword, setSearchKeyword] = useState('')
    const [users, setUsers] = useState()
    const [pageCount, setPageCount] = useState()

    useEffect(() => {
        const getAll = async () => {
            const respObj = await getErrorData({ page: page })
            const resp = respObj.data.result
            setPageCount(Math.floor(resp.count / 10))
            setRespValue(resp.data)
            setUsers(resp.stakeHolder)
            setStatus(resp.status)

            setDropdownVal((prevState) => ({
                ...prevState,
                projectName: respObj.data.result.projectName,
                stakeHolder: resp.stakeHolder,
                status: resp.status,
            }))

            setSearchBy('Title')
        }

        if (page > 0) {
            getAll()
        }
    }, [])

    useEffect(() => {
        let timeId
        if (searchKeyword.length >= 0 && searchBy) {
            timeId = setTimeout(() => {
                callFilter()
            }, 369)
        }

        return () => clearInterval(timeId)
    }, [searchKeyword])

    useEffect(() => {
        callFilter()
    }, [filterState, page])

    const callFilter = async () => {
        const resp = await getFilteredData({ ...filterState, page: page })
        setRespValue(resp.data)
        setPageCount(Math.floor(resp.count / 10))

        setDropdownVal({
            projectName: resp.projectName,
            stakeHolder: resp.stakeHolder,
            status: resp.status
        })
    }

    const getFilteredData = async (obj) => {
        let data = obj

        const search = getSearchByName(searchBy, searchBarDrop)

        if (search && searchKeyword) {
            data = {
                ...data,
                search,
                searchKeyword,
            }
        }

        const getData = await getErrorData(data)

        return {
            data: getData.data.result.data,
            count: getData.data.result.count,
            projectName: getData.data.result.projectName,
            stakeHolder: getData.data.result.stakeHolder,
            status: getData.data.result.status,
        }
    }

    const handleEnterSearch = () => {
        document.onkeydown = function (e) {
            if (e.key === 'Enter') {
                callFilter()
            }
        }
    }

    const handleOnChange = (e) => {
        setSearchKeyword(e.target.value)
        setPage(0)
    }

    const handleStatus = (e, value) => {
        if (value !== 'unAssign' || value !== '') {
            const val = getStatusId(value, status)

            setFilterState((prev) => ({ ...prev, status: val }))
        } else {
            setRespValue(respValue)
        }
    }

    const handleStakeholders = async (e, value) => {
        if (value !== 'unAssign' || value !== '') {
            const val = getStakeHolderId(value, users)

            setFilterState((prev) => ({ ...prev, stakeHolder: val }))
        } else {
            setFilterState((prev) => ({ ...prev, stakeHolder: null }))
            setRespValue(respValue)
        }
    }

    const handleProjectName = async (e, value) => {
        if (value !== 'unAssign' || value == '') {
            setFilterState((prev) => ({ ...prev, projectName: value }))
        } else {
            setRespValue(respValue)
        }
    }

    const handleSearchDropdown = (e) => {
        setSearchBy(e.target.value)
    }

    const closeSearch = () => {
        setSearchBy('')
    }

    return (
        <StyledEngineProvider>
            <Grid container spacing={0} sx={{ minHeight: '100vh' }}>
                <Box style={{ width: "90%", marginLeft: '5%' }}>
                    <Filter
                        search={responseData}
                        handleEnterSearch={handleEnterSearch}
                        handleOnChange={handleOnChange}
                        handleStatus={handleStatus}
                        handleStakeholders={handleStakeholders}
                        filters={dropdownVal}
                        handleProjectName={handleProjectName}
                        handleSearchDropdown={handleSearchDropdown}
                        setSearchKeyword={setSearchKeyword}
                        searchBy={searchBy}
                        users={users}
                        closeSearch={closeSearch}
                    />
                    <div style={{ marginTop: '10px', marginBottom: "20px" }}>
                        <ErrorTable
                            respVal={respValue}
                            page={page}
                            setPage={setPage}
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            users={users}
                            status={status}
                            pageCount={pageCount}
                        />
                    </div>
                </Box>
            </Grid>
        </StyledEngineProvider>
    )
}
