function parsePermission(string) {
    let newString = string;
    // newString = newString.substring('permission.'.length);
    let subpermissions = newString.split('.');
    return {
        category: subpermissions[0],
        subpermissions: subpermissions.slice(1)
    }
}

export function getPermissions( player ) {
    let permissionCheck = /permission\.([\s\S]*?)/;
    let permissions = player.getTags().filter(tag=> permissionCheck.test(tag)).map(permission=> parsePermission(permission));
    return permissions;
}

export function hasPermission( player, permissionData ) {
    return getPermissions(player).find(_=>_ == parsePermission(permissionData)) ? true : false;
}