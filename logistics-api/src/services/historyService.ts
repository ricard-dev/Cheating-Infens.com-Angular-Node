import { db } from "../utils/db";
const dateFormat = require('dateformat');

class historyService {

    async logHistory(user: any, description: String, menuItem: String, menuId: Number) {
        const insertQry = `INSERT INTO history_log SET ?`;
        let insertData: any = {
            description,
            menuId,
            menuItem,
            userId: user.userId,
            user_name: user.user_name,
        };

        const result = await db.insert(insertQry, insertData);
    }
}

export let historyServiceObj: any = new historyService();