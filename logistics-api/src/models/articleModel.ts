import { db } from "../utils/db";
const dateFormat = require("dateformat");

class articleModel {
  response: any = {};
  async getArticleList(request: any) {
    this.response = {};
    let req_data = request.body;

    let draw = req_data.draw;
    let length = req_data.length;
    let order = req_data.order;
    let search = req_data.search;
    let start = req_data.start;
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
        orderby = " article_number ";
      } else if (column == 1) {
        orderby = " description ";
      } else if (column == 2) {
        orderby = " price_customer ";
      } else if (column == 3) {
        orderby = " price_contractor ";
      }
      orderby += dir;
    } else {
      orderby = " created_time DESC ";
    }

    orderby = "  ORDER BY " + orderby + " ";

    let limit = " LIMIT  " + start + " , " + length + " ";

    if (filterValue && filterValue !== undefined) {
      filterValue = filterValue.toLowerCase();

      cond = ` AND ( LOWER(article_number) LIKE '%${filterValue}%' OR LOWER(description) LIKE '%${filterValue}%' OR LOWER(price_customer) LIKE '%${filterValue}%' OR LOWER(price_contractor) LIKE '%${filterValue}%'  ) `;
    }

    const articlecountQry =
      "SELECT count(*) AS total_count FROM article WHERE status = 1 " + cond;
    const totalLenResp = await db.selectRow(articlecountQry);
    recordsTotal = totalLenResp.total_count;

    const articleQry =
      "SELECT * FROM article WHERE status = 1 " + cond + orderby + limit;
    const articleResult = await db.select(articleQry);

    this.response.status = "ok";
    this.response.draw = draw;
    this.response.recordsTotal = recordsTotal;
    this.response.recordsFiltered = recordsTotal;
    this.response.data = articleResult;

    return this.response;
  }

  async addedit(req: any) {
    const formData = req.body;

    let articleId = formData.articleId;
    articleId = articleId > 0 ? articleId : 0;

    if (articleId > 0) {
      return await this.editInformation(articleId, formData);
    } else {
      return await this.addInformation(formData);
    }
  }

  async addInformation(formData: any) {
    let now = new Date();
    let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

    const insertQry = `INSERT INTO article SET ?`;

    const insertData = {
      article_number: formData.article_number,
      description: formData.description,
      price_customer: formData.price_customer,
      price_contractor: formData.price_contractor,
      group: formData.group,
      purchasing_price: formData.purchasing_price,
      created_time: current_time,
      updated_time: current_time
    };
    const companyResp = await db.insert(insertQry, insertData);

    this.response.status = "ok";
    this.response.message = "Article has been inserted successfully.";

    return this.response;
  }

  async editInformation(articleId: any, formData: any) {
    let now = new Date();
    let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

    const insertQry = `UPDATE article SET ? WHERE articleId = ${articleId}`;

    const insertData = {
      article_number: formData.article_number,
      description: formData.description,
      price_customer: formData.price_customer,
      price_contractor: formData.price_contractor,
      group: formData.group,
      purchasing_price: formData.purchasing_price,
      updated_time: current_time
    };

    await db.update(insertQry, insertData);

    this.response.status = "ok";
    this.response.message = "Article has been updated successfully.";

    return this.response;
  }

  async getArticleDetails(data: any) {
    let resultData: any = {};
    let articleId = parseInt(data.articleId);

    const articleQry =
      "SELECT * FROM article WHERE status = ? AND articleId = ? ";
    const articleResult = await db.selectRow(articleQry, [1, articleId]);

    this.response.status = "ok";
    this.response.data = articleResult;

    return this.response;
  }

  async deleteArticle(data: any) {
    let resultData: any = {};
    let articleId = parseInt(data.articleId);

    const deleteArticleQry = ` DELETE FROM article WHERE articleId = ${articleId} `;
    await db.delete(deleteArticleQry);

    this.response.status = "ok";
    this.response.message = "Article Has been deleted successfully.";

    return this.response;
  }

  async getNewArticleNo() {
    this.response = {};
    let newarticleId = 0;
    const articleQry =
      "SELECT articleId FROM article WHERE status = ? ORDER BY  articleId DESC LIMIT 1  ";
    const articleResult = await db.selectRow(articleQry, [1]);
    if (articleResult && articleResult.articleId > 0) {
      newarticleId = parseInt(articleResult.articleId);
    }
    newarticleId = newarticleId + 1;
    this.response.status = "ok";
    this.response.newarticleId = newarticleId;
    return this.response;
  }
}

export let articleModelObj: any = new articleModel();
