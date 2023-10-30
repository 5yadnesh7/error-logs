export const searchBarDrop = [
    { name: 'title', username: 'Title', id: 0 },
    { name: 'jira', username: 'JIRA', id: 1 },
    { name: 'branchName', username: 'Branch Name', id: 2 },
]

export const getStakeHolderName = (id, data) => {
    for (let i = 0; i < data?.length; i++) {
        if (data[i].id == id) {
            return data[i].name
        }
    }
}

export const getStatusName = (id, data) => {
    for (let i = 0; i < data?.length; i++) {
        if (data[i].id == id) {
            return data[i].name
        }
    }
}

export const getStakeHolderId = (name, data) => {
    const selectedUser = data.find(item => item.name == name || item.username == name)
    return selectedUser?.id ? selectedUser.id : selectedUser?._id ? selectedUser._id : ""
}

export const getStatusId = (status, data) => {
    const selectedStatus = data.find(item => item.name == status || item.status == status)
    return selectedStatus?.id ? selectedStatus.id : selectedStatus?._id ? selectedStatus._id : ""
}

export const getSearchByName = (value, data) => {
    for (let i = 0; i < data?.length; i++) {
        if (data[i].username == value) {
            return data[i].name
        }
    }
}
