import { db } from "../utils/db";

class testModel2 {
    async get() {
        var qr = "SELECT * FROM cl_users WHERE id = ? ";
        var result = await db.select(qr, [1]);
        return result;
    }
}

export let testModel2Obj: any = new testModel2();