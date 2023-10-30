import styled from '@emotion/styled'
import {
    Button,
    FormLabel,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import DetailDropdown from '../components/detaildropdown'
import {
    getStakeHolderName,
    getStatusName,
    getStakeHolderId,
    getStatusId,
} from '../libs/frontend'
import {
    deleteErrorLog,
    getErrorData,
    getStatusRespData,
    getUserRespData,
    updateErrorLog,
} from '../libs/api_requests'
import { useRouter } from 'next/router'
import StatusDropdown from '../components/statusdropdown'
import RecordTable from '../components/recordtable'
import { Textarea } from '@mui/joy'
import styles from '../styles/Details.module.css'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#1A2027',
    padding: 5,
    textAlign: 'center',
    color: '#fff',
}))

const Details = () => {
    const [updatedBy, setUpdatedBy] = useState('')
    const [statusChanged, setStatusChanged] = useState('')
    const [stakeHolded, setStakeHolded] = useState('')
    const [errorDetails, setErrorDetails] = useState()
    const [branchName, setBranchName] = useState('')
    const [jiraVal, setJiraVal] = useState('')
    const [updatedArr, setUpdatedArr] = useState()
    const [statusArr, setStatusArr] = useState()
    const [records, setRecords] = useState()
    const [desc, setDesc] = useState()
    const [projectName, setProjectName] = useState("")
    const router = useRouter()
    const id = router.query.id

    useEffect(() => {
        let updatedBy
        let status
        let stakeHolder
        const getDetails = async () => {
            const respObj = await getErrorData({ id: id })
            const resp = await respObj.data.result.data
            setErrorDetails(resp[0])
            setBranchName(resp[0]?.branchName)
            setJiraVal(resp[0]?.jira)
            updatedBy = resp[0]?.updatedBy
            status = resp[0]?.status
            stakeHolder = resp[0]?.stakeHolder
            setRecords(resp[0].records)
            setDesc(resp[0].errString)
            setProjectName(resp[0]?.projectName)
            if (updatedBy && respObj?.data?.result) {
                setUpdatedBy(getStakeHolderName(updatedBy, respObj.data.result.stakeHolder))
                setStakeHolded(getStakeHolderName(stakeHolder, respObj.data.result.stakeHolder))
            }
            setStatusArr(respObj.data.result.status)
            setStatusChanged(getStatusName(status, respObj.data.result.status))
        }
        const getUserResp = async () => {
            const respObj = await getUserRespData({ isActive: "true" })
            setUpdatedArr(respObj.data.result)
        }
        const getStatusResp = async () => {
            const respObj = await getStatusRespData({ isActive: "true" })
            setStatusArr(respObj.data.result)
        }

        if (id) {
            getDetails().then(() => {
                getUserResp().then(() => {
                    getStatusResp()
                })
            })
        }
    }, [id])

    const handleUpdatedBy = (e) => {
        setUpdatedBy(e.target.value)
    }

    const handleStatusChanged = (e) => {
        setStatusChanged(e.target.value)
    }

    const handleStakeHolded = (e) => {
        setStakeHolded(e.target.value)
    }

    const handleSave = async () => {
        const updatedId = getStakeHolderId(updatedBy, updatedArr)
        const stakeHolderId = getStakeHolderId(stakeHolded, updatedArr)
        const statusId = getStatusId(statusChanged, statusArr)

        const data = {
            id: id,
            title: errorDetails.title,
            branchName: branchName,
            projectName: errorDetails.projectName,
            status: statusId,
            stakeHolder: stakeHolderId,
            jira: jiraVal,
            updatedBy: updatedId,
        }
        const result = await updateErrorLog(data)

        if (result.data.code == 0) {
            router.push('/')
        }
    }

    const handleDelete = async () => {
        const data = {
            title: errorDetails.title,
            id: id,
        }
        let result = await deleteErrorLog(data)
        if (result.data.code == 0) {
            router.push('/')
        }
    }

    return (
        <div className={`${styles['container']}`}>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <div>
                        <div container rowSpacing={1}>
                            <Grid
                                display="flex"
                                justifyContent=""
                                spacing={10}>
                                <Typography variant="h5">
                                    Title: <b>{errorDetails?.title} </b>
                                </Typography>
                            </Grid>
                        </div>
                        <Grid container spacing={2}>
                            <Grid item xs={8} style={{ marginTop: '20px' }}>
                                <FormLabel>Description:</FormLabel>
                                <Textarea
                                    label="Description"
                                    placeholder="Desc"
                                    minRows={2}
                                    maxRows={8}
                                    variant="plain"
                                    value={desc}/>
                            </Grid>
                            <Grid
                                item
                                alignItems="center"
                                justifyContent="center">
                                <TextField
                                    id="outlined-basic-1"
                                    label="Project Name"
                                    placeholder="Project Name"
                                    variant="outlined"
                                    value={projectName}
                                    style={{
                                        marginLeft: '20px',
                                        marginTop: '10px',
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}/>

                                <br />
                                <TextField
                                    id="outlined-basic"
                                    label="Branch Name"
                                    variant="outlined"
                                    placeholder="BranchName"
                                    value={branchName}
                                    onChange={(e) =>
                                        setBranchName(e.target.value)
                                    }
                                    style={{
                                        marginTop: '10px',
                                        marginLeft: '20px',
                                    }}
                                />
                                <br />
                                <TextField
                                    id="outlined-basic"
                                    label="JIRA"
                                    variant="outlined"
                                    value={jiraVal}
                                    onChange={(e) => {
                                        setJiraVal(e.target.value)
                                    }}
                                    style={{
                                        marginTop: '10px',
                                        marginLeft: '20px',
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            display="flex"
                            justifyContent="space-evenly"
                            style={{ marginTop: '20px' }}>
                            <Grid spacing={4}>
                                <DetailDropdown
                                    value={updatedBy}
                                    onChange={handleUpdatedBy}
                                    items={updatedArr}
                                    label="Updated By"
                                    isSearch={true}
                                />
                            </Grid>
                            <Grid spacing={4}>
                                <StatusDropdown
                                    value={statusChanged}
                                    onChange={handleStatusChanged}
                                    items={statusArr}
                                    label="Status"
                                />
                            </Grid>
                            <Grid spacing={4}>
                                <DetailDropdown
                                    value={stakeHolded}
                                    onChange={handleStakeHolded}
                                    items={updatedArr}
                                    label="Stakeholder"
                                    isSearch={true}
                                />
                            </Grid>
                        </Grid>
                        <RecordTable data={records} />

                        <Grid
                            display="flex"
                            justifyContent="space-evenly"
                            spacing={10}>
                            <Stack
                                spacing={2}
                                direction="row"
                                style={{ marginTop: '20px', marginBottom: "20px" }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSave}>
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleDelete}>
                                    Delete
                                </Button>
                                <Button
                                    variant="contained"
                                    color="info"
                                    onClick={()=>router.push('/')}>
                                    Back
                                </Button>
                            </Stack>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Details
