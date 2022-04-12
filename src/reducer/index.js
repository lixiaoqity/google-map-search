const initState = {
    locations: []
};
const reducer = (state = initState, action) => {
    switch (action.type) {
        case "add":
            state.locations.push(action.value);
            return {...state};
        case "delete":
            if (action.value.length > 0) {
                const result = state.locations.filter(s => {
                    return !action.value.includes(s.key);
                });
                return {locations: result};
            }
            return {...state};
        default:
            return {...state};
    }
}

module.exports = {
    reducer
}