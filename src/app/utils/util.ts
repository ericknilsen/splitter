import { ACTION_APPROVE, ACTION_REJECT } from "./constants";

export abstract class Util {

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser')!);
    }

    static getActionsList() {
        const statusList = [ACTION_APPROVE, ACTION_REJECT];
        return statusList;
    }
}