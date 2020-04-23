import { db } from "../utils/db";
const dateFormat = require('dateformat');

class commonModel {
    response: any = {};

    async getStateList() {

        const stateQry = "SELECT * FROM states WHERE status = ?  ";
        const stateResult = await db.select(stateQry, [1]);

        this.response.status = 'ok';
        this.response.data = stateResult;
        return this.response;

    }

}


export let commonModelObj: any = new commonModel();