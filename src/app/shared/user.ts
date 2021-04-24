export interface Roles {
    admin?: boolean,
    editor?: boolean,
    user?: boolean
}

export interface User {
    uid: string,
    displayName: string,
    email: string,
    photoURL: string,
    roles: Roles
}
