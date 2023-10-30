import styled from '@emotion/styled'
import { Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Dropdown from '../dropdown'
import { searchBarDrop } from '../../libs/frontend'
import DetailDropdown from '../detaildropdown'
import StatusDropdown from '../statusdropdown'

const Item = styled('div')(({ theme }) => ({
    backgroundColor: 'white',
    border: '1px solid',
    borderColor: '#444d58',
    padding: '1px',
    borderRadius: '4px',
    textAlign: 'center',
}))

const Filter = (props) => {
    const {
        handleEnterSearch,
        handleOnChange,
        handleStakeholders,
        handleStatus,
        filters,
        handleProjectName,
        handleSearchDropdown,
        closeSearch,
        searchBy,
        users,
    } = props
    const status = filters?.status
    const stakeholders = filters?.stakeHolder
    const projects = filters?.projectName
    const [stakeHolder, setStakeholder] = useState()
    const [isStatus, setStatus] = useState()
    const [isProject, setProject] = useState()

    useEffect(() => {
        if (users?.length > 0) {
            handleStakeholders('', 'unAssign')
            setStakeholder('unAssign')
        }
    }, [users])

    const handleStatusDropdown = (event) => {
        setStatus(event.target.value)
        handleStatus(event, event.target.value)
    }

    const handleStakeHolderDropdown = (event, id) => {
        handleStakeholders(event, event.target.value)
        setStakeholder(event.target.value)
    }

    const handleProjectDropdown = (event) => {
        handleProjectName(event, event.target.value)
        setProject(event.target.value)
    }

    const closeStakeHolder = (event) => {
        handleStakeholders(event, '')
        setStakeholder('')
    }

    const closeProjectName = () => {
        setProject('')
        handleProjectName('', '')
    }

    const closeStatus = () => {
        setStatus('')
        handleStatus('', '')
    }

    return (
        <Grid container justifyContent="space-evenly">
            <DetailDropdown
                value={searchBy}
                onChange={handleSearchDropdown}
                items={searchBarDrop}
                label="Search By"
                isCross="true"
                handleClose={closeSearch}
                isSearch="true"
            />
            <TextField
                label="Search"
                variant="outlined"
                inputProps={{
                    style: {
                        height: '35px',
                    },
                }}
                style={{
                    width: '21em',
                    marginTop: '8px',
                }}
                onKeyDown={() => handleEnterSearch()}
                id="SearchField"
                size="small"
                onChange={(e) => handleOnChange(e)}
            />

            <Grid>
                <StatusDropdown
                    value={isStatus}
                    onChange={handleStatusDropdown}
                    items={status}
                    label="Status"
                    isCross="true"
                    handleClose={closeStatus}
                    isCount="true"
                />
            </Grid>
            <Grid>
                <DetailDropdown
                    value={stakeHolder}
                    onChange={handleStakeHolderDropdown}
                    items={stakeholders}
                    label="Stakeholders"
                    handleClose={closeStakeHolder}
                    isCross="true"
                    isCount="true"
                />
            </Grid>
            <Grid>
                <Dropdown
                    value={isProject}
                    onChange={handleProjectDropdown}
                    items={projects}
                    label="Project Name"
                    handleClose={closeProjectName}
                    isCross="true"
                />
            </Grid>
        </Grid>
    )
}

export default Filter
