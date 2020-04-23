import { db } from "../utils/db";
const dateFormat = require('dateformat');

class tourModel {
    response: any = {};
    async getTourList(request: any) {
        this.response = {};
        let req_data = request.body;

        let draw = req_data.draw;
        let length = req_data.length;
        let order = req_data.order;
        let search = req_data.search;
        let start = req_data.start;
        let recordsTotal = 0;
        let filterValue = '';
        if (search) {
            filterValue = search.value;
        }

        let orderby = "";

        if (order && order.length > 0) {

            let column = order[0].column;
            let dir = order[0].dir;

            if (column == 0) {
                orderby = " tour_id ";
            }
            else if (column == 1) {
                orderby = " description ";
            }
            else if (column == 2) {
                orderby = " customer ";
            }
            else if (column == 3) {
                orderby = " client_award ";
            }
            else if (column == 4) {
                orderby = " price_basis ";
            }

            orderby += dir;


        } else {
            orderby = " created_time DESC ";
        }

        orderby = "  ORDER BY " + orderby + " ";

        let limit = " LIMIT  " + start + " , " + length + " ";

        let cond = "";
        if (filterValue && filterValue !== undefined) {
            filterValue = filterValue.toLowerCase();
            cond = ` AND ( LOWER(tour_id) LIKE '%${filterValue}%' OR LOWER(surname) LIKE '%${filterValue}%' OR LOWER(description) LIKE '%${filterValue}%' OR LOWER(customer) LIKE '%${filterValue}%' OR LOWER(client_award) LIKE '%${filterValue}%' OR LOWER(price_basis) LIKE '%${filterValue}%' OR LOWER(tour_type) LIKE '%${filterValue}%' OR LOWER(service_power_partners) LIKE '%${filterValue}%'  ) `

        }

        const tourcountQry = "SELECT count(*) AS total_count FROM tours WHERE status = 1 " + cond;
        const totalLenResp = await db.selectRow(tourcountQry);
        recordsTotal = totalLenResp.total_count;
        const tourQry = "SELECT * FROM tours WHERE status = 1 " + cond + orderby + limit;

        const tourResult = await db.select(tourQry);

        this.response.status = 'ok';
        this.response.draw = draw;
        this.response.recordsTotal = recordsTotal;
        this.response.recordsFiltered = recordsTotal;
        this.response.data = tourResult;

        return this.response;
    }


    async addedit(req: any) {

        const formData = req.body;

        let toursId = formData.toursId;
        toursId = (toursId > 0) ? toursId : 0;

        if (toursId > 0) {
            return await this.editInformation(toursId, formData);
        }
        else {
            return await this.addInformation(formData);
        }


    }


    async addInformation(formData: any) {

        let now = new Date();
        let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

        const insertQry = `INSERT INTO tours SET ?`;

        const insertData = { tour_no: formData.tour_no, surname: formData.surname, description: formData.description, customer: formData.customer, client_award: formData.client_award, price_basis: formData.price_basis, day: formData.day, valid_from: formData.valid_from, date_of_expiry: formData.date_of_expiry, tour_type: formData.tour_type, service_power_partners: formData.service_power_partners, service_valid_from: formData.service_valid_from, service_date_of_expiry: formData.service_date_of_expiry, service_ltp_prize_week: formData.service_ltp_prize_week, service_ltp_prize_we: formData.service_ltp_prize_we, comment: formData.comment, created_time: current_time, updated_time: current_time };

        await db.insert(insertQry, insertData);

        this.response.status = 'ok';
        this.response.message = 'Person has been inserted successfully.';

        return this.response;
    }

    async editInformation(toursId: any, formData: any) {

        let now = new Date();
        let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

        const insertQry = `UPDATE tours SET ? WHERE toursId = ${toursId}`;

        const insertData = { tour_no: formData.tour_no, surname: formData.surname, description: formData.description, customer: formData.customer, client_award: formData.client_award, price_basis: formData.price_basis, day: formData.day, valid_from: formData.valid_from, date_of_expiry: formData.date_of_expiry, tour_type: formData.tour_type, service_power_partners: formData.service_power_partners, service_valid_from: formData.service_valid_from, service_date_of_expiry: formData.service_date_of_expiry, service_ltp_prize_week: formData.service_ltp_prize_week, service_ltp_prize_we: formData.service_ltp_prize_we, comment: formData.comment, updated_time: current_time };

        await db.update(insertQry, insertData);

        this.response.status = 'ok';
        this.response.message = 'Person has been updated successfully.';

        return this.response;

    }

    async getTourDetails(data: any) {
        this.response = {};
        let resultData: any = {};
        let toursId = parseInt(data.toursId);

        const tourQry = "SELECT * FROM tours WHERE status = ? AND toursId = ? ";
        const tourResult = await db.selectRow(tourQry, [1, toursId]);

        this.response.status = 'ok';
        this.response.data = tourResult;

        return this.response;
    }


    async deleteTour(data: any) {
        let resultData: any = {};
        let toursId = parseInt(data.toursId);

        const deleteTourQry = ` DELETE FROM tours WHERE toursId = ${toursId} `
        await db.delete(deleteTourQry);

        this.response.status = 'ok';
        this.response.message = 'Article Has been deleted successfully.';

        return this.response;

    }

    async getNewToursNo() {
        this.response = {};
        let newtoursId = 0;
        const toursQry = "SELECT toursId FROM tours WHERE status = ? ORDER BY  toursId DESC LIMIT 1  ";
        const toursResult = await db.selectRow(toursQry, [1]);
        if (toursResult && toursResult.toursId > 0) {
            newtoursId = parseInt(toursResult.toursId);
        }
        newtoursId = newtoursId + 1;
        this.response.status = 'ok';
        this.response.newtoursId = newtoursId;
        return this.response;

    }


}

export let tourModelObj: any = new tourModel();