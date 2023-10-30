import http_request from './http_request'
const { getBrowserEnv } = require('../setup-env')
const browserEnvs = getBrowserEnv(process.env.APP_ENV)

export const getErrorData = (data) => {
    return http_request({
        url: `/v1/geterrorlogs`,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    })
}

export const getUserRespData = (data) => {
    return http_request({
        url: `/v1/getstakeholders`,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    })
}

export const getStatusRespData = (data) => {
    return http_request({
        url: `/v1/getstatus`,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    })
}

export const updateErrorLog = (data) => {
    return http_request({
        url: `/v1/updateerrorlog`,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    })
}

export const deleteErrorLog = (data) => {
    return http_request({
        url: `/v1/deleteerrorlog`,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    })
}

export const updateStakeholder = (data) => {
    return http_request({
        url: `/v1/updateStakeholder`,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    })
}

export const addStakeholder = (data) => {
    return http_request({
        url: `/v1/addStakeholder`,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    })
}

export const addStatus = (data) => {
    return http_request({
        url: `/v1/addStatus`,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    })
}

export const updateStatus = (data) => {
    return http_request({
        url: `/v1/updateStatus`,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    })
}