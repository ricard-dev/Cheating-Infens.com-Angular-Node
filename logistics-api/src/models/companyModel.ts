import { db } from "../utils/db";
import { historyServiceObj } from "../services/historyService";
import { invoiceModelObj } from "./invoiceModel";

const dateFormat = require("dateformat");

class companyModel {
  response: any = {};
  async getCompanyList(request: any) {
    try {
      this.response = {};
      let req_data = request.body;

      let draw = req_data.draw;
      let length = req_data.length;
      let order = req_data.order;
      let search = req_data.search;
      let start = req_data.start;
      let status = req_data.status;
      let columns = req_data.columns;
      let global = req_data.global;
      let recordsTotal = 0;
      let filterValue = "";
      if (search) {
        filterValue = search.value;
      }
      let cond = "";
      let orderby = "";

      if (order && order.length > 0) {
        let column = order[0].column;
        let dir = order[0].dir;

        if (column == 0) {
          orderby = " company_number ";
        } else if (column == 1) {
          orderby = " group_name ";
        } else if (column == 2) {
          orderby = " name1 ";
        } else if (column == 3) {
          orderby = " phone1 ";
        }

        orderby += dir;
      } else {
        orderby = " created_time DESC ";
      }

      orderby = "  ORDER BY " + orderby + " ";

      if (!length) length = 234242134234;

      let limit = ` LIMIT ${length} `;

      if (start != undefined) {
        limit += ` OFFSET ${start}`;
      }
      if (filterValue && filterValue !== undefined) {
        filterValue = filterValue.toLowerCase();
        cond = ` AND ( LOWER(company_number) LIKE '%${filterValue}%' OR LOWER(group_name) LIKE '%${filterValue}%' OR LOWER(name1) LIKE '%${filterValue}%' OR LOWER(name2) LIKE '%${filterValue}%' OR LOWER(street) LIKE '%${filterValue}%' OR LOWER(postcode) LIKE '%${filterValue}%' OR LOWER(phone1) LIKE '%${filterValue}%' OR LOWER(phone2) LIKE '%${filterValue}%' OR LOWER(invoice_number) LIKE '%${filterValue}%' OR LOWER(num_invoice) LIKE '%${filterValue}%'  ) `;
      }

      if (columns) {
        columns.forEach((item: any, index: number) => {
          if (
            item.name != undefined &&
            item.search != undefined &&
            item.search.value != undefined &&
            item.name != "" &&
            item.search.value != ""
          ) {
            cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
          }
        });
      }
      if (status == 1) {
        cond = cond + ` AND status = 1`;
      } else if (status == 0) {
        cond = cond + ` AND status = 0`;
      }

      let select = "";
      if (columns && global != undefined && global == false) {
        columns.forEach((item: any, index: number) => {
          if (index > 0) select += `,${item.name}`;
          else select += `${item.name}`;
        });
      }

      const companycountQry =
        "SELECT count(*) AS total_count FROM company WHERE 1 = 1 " + cond;
      const totalLenResp = await db.selectRow(companycountQry);
      recordsTotal = totalLenResp.total_count;

      if (select == "") select = "*";
      const companyQry =
        `SELECT ${select} FROM company WHERE 1 = 1 ` + cond + orderby + limit;
      const companyResult = await db.select(companyQry);

      this.response.status = "ok";
      this.response.draw = draw;
      this.response.recordsTotal = recordsTotal;
      this.response.recordsFiltered = recordsTotal;
      this.response.data = companyResult;
      return this.response;
    } catch (e) {
      return {
        status: false,
        message: e.message
      };
    }
  }

  async addedit(req: any) {
    const formData = req.body;

    const basicData = JSON.parse(formData.basicData);

    let companyId = basicData.companyId;
    companyId = companyId > 0 ? companyId : 0;

    let result;
    if (companyId > 0) {
      const result = await this.editInformation(companyId, formData);
      await historyServiceObj.logHistory(
        req.user,
        `edited the company ${companyId}`,
        "company",
        companyId
      );
      return result;
    } else {
      const result = await this.addInformation(formData);
      await historyServiceObj.logHistory(
        req.user,
        `created the company ${result.newCompanyId}`,
        "company",
        result.newCompanyId
      );
      return result;
    }
  }

  async addInformation(formData: any) {
    let now = new Date();
    let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

    const basicData = JSON.parse(formData.basicData);
    const bankingData = JSON.parse(formData.bankingData);
    const invoiceData = JSON.parse(formData.invoiceData);

    let ustr_mandatory = basicData.ustr_mandatory ? 1 : 0;

    const insertQry = `INSERT INTO company SET ?`;

    let insertData: any = {
      company_number: basicData.company_number,
      group_name: basicData.group_name,
      name1: basicData.name1,
      name2: basicData.name2,
      street: basicData.street,
      postcode: basicData.postcode,
      phone1: basicData.phone1,
      phone2: basicData.phone2,
      fax: basicData.fax,
      ustr_mandatory: ustr_mandatory,
      ustr_mandatory_value: basicData.ustr_mandatory_value,
      invoice_number: basicData.invoice_number,
      num_invoice: basicData.num_invoice,
      num_r_branch: basicData.num_r_branch,
      last_set_position: basicData.last_set_position,
      ag_ltp_number: basicData.ag_ltp_number,
      prefix_client: basicData.prefix_client,
      prefix_power_partner: basicData.prefix_power_partner,
      last_rech_date: basicData.last_rech_date,
      code: basicData.code,
      country_name: basicData.country_name,
      created_time: current_time,
      updated_time: current_time
    };
    insertData = { ...insertData, status: 1 };

    const companyResp = await db.insert(insertQry, insertData);
    const companyId = companyResp.insertId;

    if (bankingData.account && bankingData.account !== "") {
      const insertBankingQry = `INSERT INTO company_banking SET ?`;
      const insertBankingData = {
        companyId: companyId,
        account: bankingData.account,
        bankId: bankingData.bankId,
        iban: bankingData.iban,
        bic: bankingData.bic,
        dtaus_no: bankingData.dtaus_no,
        usage: bankingData.usage,
        dtaus_path: bankingData.dtaus_path,
        sepa: bankingData.sepa,
        converter: bankingData.converter,
        sepa_path: bankingData.sepa_path,
        sepa_no: bankingData.sepa_no
      };
      await db.insert(insertBankingQry, insertBankingData);
    }

    if (
      invoiceData.executive_director &&
      invoiceData.executive_director !== ""
    ) {
      const insertInvoiceQry = `INSERT INTO company_rechnungsfull SET ?`;
      const insertInvoiceData = {
        companyId: companyId,
        executive_director: invoiceData.executive_director,
        commercial_register: invoiceData.commercial_register,
        commercial_register_number: invoiceData.commercial_register_number,
        complementary: invoiceData.complementary,
        hra: invoiceData.hra,
        ust_id: invoiceData.ust_id,
        tax_number: invoiceData.tax_number,
        logo_file: formData.logoFile,
        logo_position: invoiceData.logo_position,
        website: invoiceData.website
      };

      await db.insert(insertInvoiceQry, insertInvoiceData);
    }
    this.response = {};
    this.response.status = "ok";
    this.response.message = "company has been inserted successfully.";
    this.response.newCompanyId = companyId;

    console.log(this.response);
    return this.response;
  }

  async editInformation(companyId: any, formData: any) {
    let now = new Date();
    let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

    const basicData = JSON.parse(formData.basicData);
    const bankingData = JSON.parse(formData.bankingData);
    const invoiceData = JSON.parse(formData.invoiceData);

    let ustr_mandatory = basicData.ustr_mandatory ? 1 : 0;

    const insertQry = `UPDATE company SET ? WHERE companyId = ${companyId}`;

    let insertData: any = {
      company_number: basicData.company_number,
      group_name: basicData.group_name,
      name1: basicData.name1,
      name2: basicData.name2,
      street: basicData.street,
      postcode: basicData.postcode,
      phone1: basicData.phone1,
      phone2: basicData.phone2,
      fax: basicData.fax,
      ustr_mandatory: ustr_mandatory,
      ustr_mandatory_value: basicData.ustr_mandatory_value,
      invoice_number: basicData.invoice_number,
      num_invoice: basicData.num_invoice,
      num_r_branch: basicData.num_r_branch,
      last_set_position: basicData.last_set_position,
      ag_ltp_number: basicData.ag_ltp_number,
      prefix_client: basicData.prefix_client,
      prefix_power_partner: basicData.prefix_power_partner,
      last_rech_date: basicData.last_rech_date,
      code: basicData.code,
      country_name: basicData.country_name,
      updated_time: current_time
    };
    insertData = { ...insertData, status: 1 };
    await db.update(insertQry, insertData);

    const deleteBanking = ` DELETE FROM company_banking WHERE companyId = ${companyId} `;
    await db.delete(deleteBanking);

    if (bankingData.account && bankingData.account !== "") {
      const insertBankingQry = `INSERT INTO company_banking SET ?`;
      const insertBankingData = {
        companyId: companyId,
        account: bankingData.account,
        bankId: bankingData.bankId,
        iban: bankingData.iban,
        bic: bankingData.bic,
        dtaus_no: bankingData.dtaus_no,
        usage: bankingData.usage,
        dtaus_path: bankingData.dtaus_path,
        sepa: bankingData.sepa,
        converter: bankingData.converter,
        sepa_path: bankingData.sepa_path,
        sepa_no: bankingData.sepa_no
      };
      await db.insert(insertBankingQry, insertBankingData);
    }

    const deleteInvoiceQry = ` DELETE FROM company_rechnungsfull WHERE companyId = ${companyId} `;
    await db.delete(deleteInvoiceQry);
    if (
      invoiceData.executive_director &&
      invoiceData.executive_director !== ""
    ) {
      const insertInvoiceQry = `INSERT INTO company_rechnungsfull SET ?`;
      let insertInvoiceData:any = {
        companyId: companyId,
        executive_director: invoiceData.executive_director,
        commercial_register: invoiceData.commercial_register,
        commercial_register_number: invoiceData.commercial_register_number,
        complementary: invoiceData.complementary,
        hra: invoiceData.hra,
        ust_id: invoiceData.ust_id,
        tax_number: invoiceData.tax_number,
        logo_position: invoiceData.logo_position,
        website: invoiceData.website
      };

      if (formData.logoFile !== undefined && formData.logoFile !== null) {
        insertInvoiceData["logo_file"] = formData.logoFile;
      }
      await db.insert(insertInvoiceQry, insertInvoiceData);
    }
    this.response = {};
    this.response.status = "ok";
    this.response.message = "company has been updated successfully.";

    return this.response;
  }

  async getCompanyDetails(data: any) {
    let resultData: any = {};
    let companyId = parseInt(data.companyId);

    const companyQry = "SELECT * FROM company WHERE companyId = ? ";
    const companyResult = await db.selectRow(companyQry, [companyId]);

    const bankingQry = `SELECT company_banking.*, banks.name as bank_name FROM company_banking
                        LEFT JOIN banks ON banks.bankId = company_banking.bankId WHERE company_banking.companyId = ? `;
    const bankingData = await db.selectRow(bankingQry, [companyId]);

    const invoiceQry =
      "SELECT * FROM company_rechnungsfull WHERE  companyId = ? ";
    const invoiceData = await db.selectRow(invoiceQry, [companyId]);

    resultData.basicData = companyResult;
    resultData.bankingData = bankingData;
    resultData.invoiceData = invoiceData;

    this.response.status = "ok";
    this.response.data = resultData;

    return this.response;
  }

  async deleteCompany(data: any) {
    let resultData: any = {};
    let companyId = parseInt(data.companyId);

    const deletecompanyQry = ` DELETE FROM company WHERE companyId = ${companyId} `;
    await db.delete(deletecompanyQry);

    const deletebkQry = ` DELETE FROM company_banking WHERE companyId = ${companyId} `;
    await db.delete(deletebkQry);

    const deleteInvQry = ` DELETE FROM company_rechnungsfull WHERE companyId = ${companyId} `;
    await db.delete(deleteInvQry);
    this.response.status = "ok";
    this.response.message = "Company Has been deleted successfully.";

    return this.response;
  }

  async getNewCompanyNo() {
    this.response = {};
    let newcompanyId = 0;
    const companyQry =
      "SELECT companyId FROM company ORDER BY  companyId DESC LIMIT 1  ";
    const companyResult = await db.selectRow(companyQry);
    if (companyResult && companyResult.companyId > 0) {
      newcompanyId = parseInt(companyResult.companyId);
    }
    newcompanyId = newcompanyId + 1;
    this.response.status = "ok";
    this.response.newcompanyId = newcompanyId;
    return this.response;
  }
}

export let companyModelObj: any = new companyModel();
