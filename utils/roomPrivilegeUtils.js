function getPrivilege(role) {
    switch(role) {
        case 'Participant':
            return 0
        case 'Admin':
            return 1
        case 'Owner':
            return 2
        default:
            return undefined
    } 
}
exports.getValueOfPrivilege = getPrivilege

exports.ownerLevel = 2

exports.testPrivilege = (current, oponent) => {
    const getValueOfPrivilege = getPrivilege
    return getValueOfPrivilege(current)>getValueOfPrivilege(oponent)
}