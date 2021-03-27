import { UserGroup } from "../models/user-group.model";
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
 }