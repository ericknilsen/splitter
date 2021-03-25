import { ACTION_APPROVE, ACTION_REJECT, STATUS_APPROVED, STATUS_REJECTED } from "./constants";

export abstract class Util {

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser')!);
    }

    static getActionsList() {
        const statusList = [ACTION_APPROVE, ACTION_REJECT];
        return statusList;
    }

    static getActionStatusMap() {
        const statusMap = new Map([[ACTION_APPROVE, STATUS_APPROVED],[ACTION_REJECT, STATUS_REJECTED]]);
        return statusMap;
    }
 }