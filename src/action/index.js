const addAction = (type, value) => {
    return {
        type: type,
        value: value
    }
}

const deleteAction = (type, value) => {
    return {
        type: type,
        value: value
    }
}

module.exports = {
    addAction,
    deleteAction
}