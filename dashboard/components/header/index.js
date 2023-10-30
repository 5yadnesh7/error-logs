import React from 'react'
import { Box, Button, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'

const Header = () => {

    const router = useRouter()

    return (
        <>
            <Box
                display="flex"
                width="auto"
                height={80}
                alignItems="center"
                justifyContent="center"
                sx={{ textTransform: 'uppercase' }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 'bold', cursor: "pointer" }}
                    onClick={() => router.push("/")}>
                    Error Dashboard
                </Typography>
            </Box>
            {
                router.pathname == '/' ?
                    <Grid sx={{
                        width: "90%",
                        marginLeft: "5%",
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'end',
                    }}>
                        <Button onClick={() => router.push('/usersmanage')}>
                            Manage Users
                        </Button>
                        <Button onClick={() => router.push('/statusmanage')}>
                            Manage Status
                        </Button>
                    </Grid>
                    : null
            }
        </>
    )
}

export default Header
