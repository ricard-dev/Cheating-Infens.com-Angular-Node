import { db } from "../utils/db";

class invoiceModel {
  response: any = {};

  async getInvoiceList(request: any) {
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
          orderby = " invoice_no ";
        } else if (column == 1) {
          orderby = " invoice_date ";
        } else if (column == 2) {
          orderby = " invoice_net ";
        } else if (column == 3) {
          orderby = " invoice_vat ";
        } else if (column == 4) {
          orderby = " invoice_gross ";
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
        cond = ` AND ( LOWER(invoice_no) LIKE '%${filterValue}%' OR LOWER(invoice_date) LIKE '%${filterValue}%' OR LOWER(invoice_net) LIKE '%${filterValue}%' OR LOWER(invoice_vat) LIKE '%${filterValue}%' OR LOWER(invoice_gross) LIKE '%${filterValue}%'  ) `;
      }

      if (columns) {
        columns.forEach((item: any, index: number) => {
          if (item.name != "" && item.search.value != "") {
            cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
          }
        });
      }
      if (status == 1) {
        cond = cond + ` AND status = 1`;
      } else if (status == 0) {
        cond = cond + ` AND status = 0`;
      }

      const invoicescountQry =
        "SELECT count(*) AS total_count FROM invoices WHERE 1 = 1 " + cond;
      const totalLenResp = await db.selectRow(invoicescountQry);
      recordsTotal = totalLenResp.total_count;

      let select = "";
      if (columns && global != undefined && global == false) {
        columns.forEach((item: any, index: number) => {
          if (index > 0) select += `,${item.name}`;
          else select += `${item.name}`;
        });
      }

      if (select == "") select = "*";
      const invoiceQry =
        `SELECT ${select} FROM invoices
          WHERE 1 = 1 ` +
        cond +
        orderby +
        limit;

      let result = await db.select(invoiceQry);

      this.response.status = "ok";
      this.response.draw = draw;
      this.response.recordsTotal = recordsTotal;
      this.response.recordsFiltered = recordsTotal;
      this.response.data = result;

      return this.response;
    } catch (e) {
      return {
        status: false,
        message: e.message
      };
    }
  }

  async getContractorInvoices(request: any) {
    try {
      this.response = {};
      let req_data = request.body;

      let contractorId = req_data.contractorId;
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
      let cond = ` AND contractorId = ${contractorId}`;
      let orderby = "";

      if (order && order.length > 0) {
        let column = order[0].column;
        let dir = order[0].dir;

        if (column == 0) {
          orderby = " invoice_no ";
        } else if (column == 1) {
          orderby = " invoice_date ";
        } else if (column == 2) {
          orderby = " invoice_net ";
        } else if (column == 3) {
          orderby = " invoice_vat ";
        } else if (column == 4) {
          orderby = " invoice_gross ";
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
        cond = ` AND ( LOWER(invoice_no) LIKE '%${filterValue}%' OR LOWER(invoice_date) LIKE '%${filterValue}%' OR LOWER(invoice_net) LIKE '%${filterValue}%' OR LOWER(invoice_vat) LIKE '%${filterValue}%' OR LOWER(invoice_gross) LIKE '%${filterValue}%'  ) `;
      }

      if (columns) {
        columns.forEach((item: any, index: number) => {
          if (item.name != "" && item.search.value != "") {
            cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
          }
        });
      }
      if (status == 1) {
        cond = cond + ` AND status = 1`;
      } else if (status == 0) {
        cond = cond + ` AND status = 0`;
      }

      const invoicescountQry =
        "SELECT count(*) AS total_count FROM contractors_invoices ci LEFT JOIN invoices i ON ci.invoiceId=i.id WHERE 1 = 1 " + cond;
      const totalLenResp = await db.selectRow(invoicescountQry);
      recordsTotal = totalLenResp.total_count;

      let select = "";
      if (columns && global != undefined && global == false) {
        columns.forEach((item: any, index: number) => {
          if (index > 0) select += `,${item.name}`;
          else select += `${item.name}`;
        });
      }

      if (select == "") select = "*";
      const invoiceQry =
        `SELECT ${select} FROM contractors_invoices ci LEFT JOIN invoices i ON ci.invoiceId=i.id WHERE 1 = 1 ` +
        cond +
        orderby +
        limit;

      let result = await db.select(invoiceQry);

      this.response.status = "ok";
      this.response.draw = draw;
      this.response.recordsTotal = recordsTotal;
      this.response.recordsFiltered = recordsTotal;
      this.response.data = result;

      return this.response;
    } catch (e) {
      return {
        status: false,
        message: e.message
      };
    }
  }

  async getClientInvoices(request: any) {
    try {
      this.response = {};
      let req_data = request.body;

      let clientId = req_data.clientId;
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
      let cond = ` AND client_id = ${clientId}`;
      let orderby = "";

      if (order && order.length > 0) {
        let column = order[0].column;
        let dir = order[0].dir;

        if (column == 0) {
          orderby = " invoice_no ";
        } else if (column == 1) {
          orderby = " invoice_date ";
        } else if (column == 2) {
          orderby = " invoice_net ";
        } else if (column == 3) {
          orderby = " invoice_vat ";
        } else if (column == 4) {
          orderby = " invoice_gross ";
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
        cond = ` AND ( LOWER(invoice_no) LIKE '%${filterValue}%' OR LOWER(invoice_date) LIKE '%${filterValue}%' OR LOWER(invoice_net) LIKE '%${filterValue}%' OR LOWER(invoice_vat) LIKE '%${filterValue}%' OR LOWER(invoice_gross) LIKE '%${filterValue}%'  ) `;
      }

      if (columns) {
        columns.forEach((item: any, index: number) => {
          if (item.name != "" && item.search.value != "") {
            cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
          }
        });
      }
      if (status == 1) {
        cond = cond + ` AND status = 1`;
      } else if (status == 0) {
        cond = cond + ` AND status = 0`;
      }

      const invoicescountQry =
        "SELECT count(*) AS total_count FROM invoices WHERE 1 = 1 " + cond;
      const totalLenResp = await db.selectRow(invoicescountQry);
      recordsTotal = totalLenResp.total_count;

      let select = "";
      if (columns && global != undefined && global == false) {
        columns.forEach((item: any, index: number) => {
          if (index > 0) select += `,${item.name}`;
          else select += `${item.name}`;
        });
      }

      if (select == "") select = "*";
      const invoiceQry =
        `SELECT ${select} FROM invoices
        WHERE 1 = 1 ` +
        cond +
        orderby +
        limit;

      let result = await db.select(invoiceQry);

      this.response.status = "ok";
      this.response.draw = draw;
      this.response.recordsTotal = recordsTotal;
      this.response.recordsFiltered = recordsTotal;
      this.response.data = result;

      return this.response;
    } catch (e) {
      return {
        status: false,
        message: e.message
      };
    }
  }

  async getInvoiceItems(request: any) {
    try {
      this.response = {};
      let req_data = request.body;

      let invoiceId = req_data.invoiceId;
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
      let cond = ` AND invoiceId = ${invoiceId}`;
      let orderby = "";

      if (order && order.length > 0) {
        let column = order[0].column;
        let dir = order[0].dir;

        if (column == 0) {
          orderby = " pos_no ";
        } else if (column == 1) {
          orderby = " type ";
        } else if (column == 2) {
          orderby = " description ";
        } else if (column == 3) {
          orderby = " price ";
        } else if (column == 4) {
          orderby = " day ";
        } else if (column == 5) {
          orderby = " value ";
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
        cond = ` AND ( LOWER(pos_no) LIKE '%${filterValue}%' OR LOWER(type) LIKE '%${filterValue}%' OR LOWER(description) LIKE '%${filterValue}%' OR LOWER(price) LIKE '%${filterValue}%' OR LOWER(day) LIKE '%${filterValue}%' OR LOWER(value) LIKE '%${filterValue}%' ) `;
      }

      if (columns) {
        columns.forEach((item: any, index: number) => {
          if (item.name != "" && item.search.value != "") {
            cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
          }
        });
      }
      if (status == 1) {
        cond = cond + ` AND status = 1`;
      } else if (status == 0) {
        cond = cond + ` AND status = 0`;
      }

      const invoiceItemsCountQry =
        "SELECT count(*) AS total_count FROM invoice_items WHERE 1 = 1 " + cond;
      const totalLenResp = await db.selectRow(invoiceItemsCountQry);
      recordsTotal = totalLenResp.total_count;

      let select = "";
      if (columns && global != undefined && global == false) {
        columns.forEach((item: any, index: number) => {
          if (index > 0) select += `,${item.name}`;
          else select += `${item.name}`;
        });
      }

      if (select == "") select = "*";
      const invoiceItemsQry =
        `SELECT ${select} FROM invoice_items
        WHERE 1 = 1 ` +
        cond +
        orderby +
        limit;

      let result = await db.select(invoiceItemsQry);

      this.response.status = "ok";
      this.response.draw = draw;
      this.response.recordsTotal = recordsTotal;
      this.response.recordsFiltered = recordsTotal;
      this.response.data = result;

      return this.response;
    } catch (e) {
      return {
        status: false,
        message: e.message
      };
    }
  }
}

export let invoiceModelObj: any = new invoiceModel();
