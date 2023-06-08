const rolesUsersFunction = (role) => {
    let roleName;
    switch (role) {
        case 0: roleName = "Admin";
            break;
        case 1: roleName = "User";
            break;
        case 2: roleName = "Doctor";
            break;
        default: roleName = "User";
    }
    return roleName;
};

const appointmentsFunction = (status) => {
    let statusName;
    switch (status) {
        case 0: statusName = "Cancelled";
            break;
        case 1: statusName = "Pending";
            break;
        case 2: statusName = "Completed";
            break;
        case 3: statusName = "Rescheduled";
            break;
        default: statusName = "Cancelled";
    }
    return statusName;
};

module.exports = {
    roleUsers: rolesUsersFunction,
    appointments: appointmentsFunction
};