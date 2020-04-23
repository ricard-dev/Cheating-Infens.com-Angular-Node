import { db } from "../utils/db";
const dateFormat = require("dateformat");

class bankModel {
  async addBank(data: any) {
    const sql = `INSERT INTO banks SET ?`;
    const feed = {
      bank_number: data.bank_number,
      account_number: data.account_number,
      name: data.name,
      bank_code: data.bank_code,
      iban: data.iban,
      bic: data.bic,
      companyId: data.companyId
    };

    const Resp = await db.insert(sql, feed);
    const bankId = Resp.insertId;
    return {
      bankId,
      status: "ok",
      message: "Bank has been inserted"
    };
  }

  async getBanks(request: any) {
    let req_data = request.body;
    let draw = req_data.draw;
    let length = req_data.length;
    let order = req_data.order;
    let search = req_data.search;
    let start = req_data.start;
    let status = req_data.status;
    let columns = req_data.columns;
    let recordsTotal = 0;
    let filterValue = "";
    let orderIdsExist: any = [];
    let cond = "";

    if (status == undefined) status = 1;
    if (search) {
      filterValue = search.value;
    }

    let orderby = "";

    if (order && order.length > 0 && order[0].column < 4) {
      let column = order[0].column;
      let dir = order[0].dir;

      orderby = ` ${columns[column].name} ${dir}`;
    } else {
      orderby = " created_time DESC ";
    }

    orderby = "  ORDER BY " + orderby + " ";

    if (!length) length = 234242134234;

    let limit = ` LIMIT ${length} `;

    if (start != undefined) {
      limit += ` OFFSET ${start}`;
    }

    if (filterValue && filterValue !== undefined && filterValue != "") {
      filterValue = filterValue.toLowerCase();
      cond += " AND ( ";
      let flag = 0;
      if (columns) {
        columns.forEach((item: any, index: number) => {
          if (item.name != "") {
            if (flag)
              cond += ` OR LOWER(${item.name}) LIKE '%${filterValue}%' `;
            else cond += ` LOWER(${item.name}) LIKE '%${filterValue}%' `;
            flag = 1;
          }
        });
      }
      if (flag) cond += ") ";
      else cond = "";
    }

    if (columns) {
      columns.forEach((item: any, index: number) => {
        if (item.name != "" && item.search.value != "") {
          cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
        }
      });
    }

    const qry = `SELECT banks.*, company.code as company_code
                  FROM banks
                  LEFT JOIN company ON company.companyId = banks.companyId
                  WHERE 1 = 1 ${cond} ${orderby} ${limit}`;
    let qryResult: any;
    try {
      qryResult = await db.select(qry);
    } catch (e) {
      qryResult = [];
    }

    return {
      status: "ok",
      draw,
      recordsTotal: qryResult.length,
      recordsFiltered: qryResult.length,
      data: qryResult
    };
  }

  async getCompanyBanks(request: any){
    let req_data = request.body;
    let companyId = req_data.companyId;
    let draw = req_data.draw;
    let length = req_data.length;
    let order = req_data.order;
    let search = req_data.search;
    let start = req_data.start;
    let status = req_data.status;
    let columns = req_data.columns;
    let recordsTotal = 0;
    let filterValue = "";
    let orderIdsExist: any = [];
    let cond = "";

    if (status == undefined) status = 1;
    if (search) {
      filterValue = search.value;
    }

    let orderby = "";

    if (order && order.length > 0 && order[0].column < 4) {
      let column = order[0].column;
      let dir = order[0].dir;

      orderby = ` ${columns[column].name} ${dir}`;
    } else {
      orderby = " created_time DESC ";
    }

    orderby = "  ORDER BY " + orderby + " ";

    if (!length) length = 234242134234;

    let limit = ` LIMIT ${length} `;

    if (start != undefined) {
      limit += ` OFFSET ${start}`;
    }

    if (filterValue && filterValue !== undefined && filterValue != "") {
      filterValue = filterValue.toLowerCase();
      cond += " AND ( ";
      let flag = 0;
      if (columns) {
        columns.forEach((item: any, index: number) => {
          if (item.name != "") {
            if (flag)
              cond += ` OR LOWER(${item.name}) LIKE '%${filterValue}%' `;
            else cond += ` LOWER(${item.name}) LIKE '%${filterValue}%' `;
            flag = 1;
          }
        });
      }
      if (flag) cond += ") ";
      else cond = "";
    }

    if (columns) {
      columns.forEach((item: any, index: number) => {
        if (item.name != "" && item.search.value != "") {
          cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
        }
      });
    }
    
    let qry = "";
    if(companyId) {
      qry = `SELECT banks.*, company.code as company_code
              FROM (SELECT * FROM banks WHERE companyId = ${companyId}) banks
              LEFT JOIN company ON company.companyId = banks.companyId
              WHERE 1 = 1 ${cond} ${orderby} ${limit}`;
    } else {
      qry = `SELECT banks.*, company.code as company_code
              FROM banks
              LEFT JOIN company ON company.companyId = banks.companyId
              WHERE 1 = 1 ${cond} ${orderby} ${limit}`;
    }
    
    let qryResult: any;
    try {
      qryResult = await db.select(qry);
    } catch (e) {
      qryResult = [];
    }

    return {
      status: "ok",
      draw,
      recordsTotal: qryResult.length,
      recordsFiltered: qryResult.length,
      data: qryResult
    };
  }

  async updateBank(bankId: any, data: any) {
    const sql = `UPDATE banks SET ? WHERE bankId = ${bankId}`;

    const feed = {
      bank_number: data.bank_number,
      account_number: data.account_number,
      name: data.name,
      bank_code: data.bank_code,
      iban: data.iban,
      bic: data.bic,
      companyId: data.companyId
    };
    const result = await db.update(sql, feed);

    return result;
  }

  async deleteBank(bankId: any) {
    const sql = `DELETE FROM banks WHERE bankId = ${bankId}`;
    const result = await db.delete(sql);
    return {
      affectedRows: result.affectedRows
    };
  }

  async getBank(bankId: Number) {
    const sql = `SELECT * FROM banks WHERE bankId = ${bankId}`;
    const result = await db.selectRow(sql);
    return result;
  }

  async getNewBankId() {
    let newBankId = 0;
    const qry = "SELECT bankId FROM banks ORDER BY  bankId DESC LIMIT 1  ";
    const result = await db.selectRow(qry);
    if (result && result.bankId > 0) {
      newBankId = parseInt(result.bankId);
    }
    newBankId = newBankId + 1;
    return {
      status: "ok",
      newBankId
    };
  }
}

export let bankModelObj: any = new bankModel();
