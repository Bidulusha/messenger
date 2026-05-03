export class UserShortInfo {
    id: number;
    login: string;
    avatar: string;

    constructor(id: number | void, login: string | void, avatar: string | void) {
        if (typeof(id) == undefined) {
            this.id = id!;
            this.login = login!;
            this.avatar = avatar!;
        }
    }
}