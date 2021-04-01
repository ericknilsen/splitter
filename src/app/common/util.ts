import { UserGroup } from "../models/user-group.model";
import { ACTION_APPROVE, ACTION_REJECT, STATUS_APPROVED, STATUS_REJECTED } from "./constants";

export abstract class Util {

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser')!);
    }

    static getActionsList() {
        const actionsList = [ACTION_APPROVE, ACTION_REJECT];
        return actionsList;
    }

    static getStatusList() {
        const statusList = [STATUS_APPROVED, STATUS_REJECTED];
        return statusList;
    }

    static getActionStatusMap() {
        const statusMap = new Map([[ACTION_APPROVE, STATUS_APPROVED],[ACTION_REJECT, STATUS_REJECTED]]);
        return statusMap;
    }

    static getCategories(userGroup: UserGroup, chargedUser: string) {
        let categories = new Map();
        const categoryList = userGroup.categories.map(c => {
            return {type: c.type, proportion: c.proportions.filter((p: { user: any; }) => p.user === chargedUser).shift().value};
          })
        for (let i = 0; i < categoryList.length; ++i) {
            categories.set(categoryList[i].type, categoryList[i].proportion);
        }

        return categories;
    }

    static getCurrentDate() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
    
        return mm + '/' + dd + '/' + yyyy;
    }

    static getMonths() {

        const months = new Map([["01", "January"],
                                    ["02", "February"],
                                    ["03", "March"],
                                    ["04", "April"],
                                    ["05", "May"],
                                    ["06", "June"],
                                    ["07", "July"],
                                    ["08", "August"],
                                    ["09", "September"],
                                    ["10", "October"],
                                    ["11", "November"],
                                    ["12", "December"],
                                 ]);
        return months;
    }

    static getCurrentMonth() {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');

        return mm;
    }
 }