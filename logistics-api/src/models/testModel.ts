import { db } from "../utils/db";

class testModel {
    async get() {
        var qr = "SELECT * FROM users WHERE idusers = ? ";
        var result = await db.select(qr, [1]);
        return result;
    }
}

export let testModelObj: any = new testModel();