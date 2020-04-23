import { db } from "../utils/db";
const dateFormat = require("dateformat");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const defaultConfig = require("../../application/utils/config");

const config = defaultConfig.default;

class userModel {
  response: any = {};

  async addUser(data: any) {
    const sql = `INSERT INTO users SET ?`;
    let password_md5 = md5(data.password);

    let feed: any = {
      userId: data.userId,
      user_name: data.user_name,
      email: data.email,
      password: password_md5,
      user_type: "user"
    };

    if (data.uploadedFile != undefined) {
      feed["profile_pic"] = data.uploadedFile;
    }
    const Resp = await db.insert(sql, feed);
    const userId = Resp.insertId;

    return {
      userId,
      status: "ok",
      message: "User has been inserted"
    };
  }

  async updateUser(userId: any, data: any) {
    const sql = `UPDATE users SET ? WHERE userId = ${userId}`;
    let password_md5 = md5(data.password);

    const feed: any = {
      user_name: data.user_name,
      email: data.email,
      password: password_md5,
      user_type: "user"
    };
    if (data.uploadedFile != undefined) {
      feed["profile_pic"] = data.uploadedFile;
    }
    const result = await db.update(sql, feed);
    return result;
  }

  async getUsers(query: any) {
    let { limit, offset, search, orderby, dir, status } = query;

    let condition: String = "",
      limitSql: String = "",
      orderBySql: String = "";
    let sql =
      "SELECT userId, user_name, email FROM users where 1 = 1 AND user_type = 'USER'";

    if (search) {
      const filterValue = query.search.toLowerCase();
      condition = ` AND ( LOWER(userId) LIKE '%${filterValue}%'
                    OR LOWER(user_name) LIKE '%${filterValue}%' 
                    OR LOWER(email) LIKE '%${filterValue}%' ) `;
    }

    if (status == 0) condition = condition + ` AND status=0`;
    if (status == 1) condition = condition + " AND status = 1";
    if (!dir) dir = "ASC";
    orderby && (orderBySql = ` ORDER BY ${orderby} ${dir}`);

    if (!limit) limit = 234242134234;
    limitSql = ` LIMIT ${limit} `;

    offset && (limitSql += ` OFFSET ${offset}`);

    sql += condition;
    sql += orderBySql;
    sql += limitSql;

    const result = await db.select(sql);

    return result;
  }

  async getUser(userId: Number) {
    const sql = `SELECT userId, user_name, email, password FROM users WHERE userId = ${userId}`;
    const result = await db.selectRow(sql);
    return result;
  }

  async deleteUser(userId: Number) {
    const sql = `DELETE FROM users WHERE userId = ${userId}`;
    const result = await db.delete(sql);
    return {
      affectedRows: result.affectedRows
    };
  }

  async getUsersList(req_data: any) {
    try {
      this.response = {};
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
          orderby = " userId " + dir;
        } else if (column == 1) {
          orderby = " user_name " + dir;
        } else if (column == 2) {
          orderby = " email " + dir;
        }

        orderby = "  ORDER BY " + orderby + " ";
      }

      if (!length) length = 234242134234;

      let limit = ` LIMIT ${length} `;

      if (start != undefined) {
        limit += ` OFFSET ${start}`;
      }
      if (filterValue && filterValue !== undefined) {
        filterValue = filterValue.toLowerCase();
        cond = ` AND ( LOWER(userId) LIKE '%${filterValue}%' OR LOWER(user_name) LIKE '%${filterValue}%' OR LOWER(email) LIKE '%${filterValue}%' )`;
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

      let select = "";
      if (columns && global != undefined && global == false) {
        columns.forEach((item: any, index: number) => {
          if (index > 0) select += `,${item.name}`;
          else select += `${item.name}`;
        });
      }

      const usercountQry =
        "SELECT count(*) AS total_count FROM users WHERE 1 = 1 " + cond;
      const totalLenResp = await db.selectRow(usercountQry);

      recordsTotal = totalLenResp.total_count;
      if (select == "") select = "userId, user_name, email, profile_pic";

      const userQry = `SELECT ${select} FROM users WHERE 1 = 1 ${cond} ${orderby} ${limit}`;
      const userResult = await db.select(userQry);

      this.response = {};
      this.response.status = "ok";
      this.response.draw = draw;
      this.response.recordsTotal = recordsTotal;
      this.response.recordsFiltered = recordsTotal;
      this.response.data = userResult;
      return this.response;
    } catch (e) {
      return {
        status: "error",
        message: e.message
      };
    }
  }

  async login(data: any) {
    let reqData = data.body;
    let email = reqData.email.trim().toLowerCase();
    let password = reqData.password.trim();

    let password_md5 = md5(password);

    let now = new Date();
    let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    const usersQry =
      "SELECT userId, first_name , last_name, user_name, user_type FROM users WHERE status = 1 AND email = '" +
      email +
      "' AND password ='" +
      password_md5 +
      "' ";
    const usersResult = await db.selectRow(usersQry);
    let rdata = {
      msg: ""
    };
    let status = "ok";
    let user = {};
    if (
      usersResult &&
      usersResult.userId != undefined &&
      usersResult.status !== "error"
    ) {
      rdata = usersResult;
      const tokenData = {
        userId: usersResult.userId,
        user_name: usersResult.user_name,
        first_name: usersResult.first_name,
        last_name: usersResult.last_name,
        user_type: usersResult.user_type,
        createdTime: current_time
      };
      const token = await this.generateToken(tokenData);
      usersResult.token = token;
      usersResult.msg = "login success";
    } else {
      status = "error";
      rdata.msg = "invalid credentials";
    }
    this.response.status = status;
    this.response.data = rdata;
    return this.response;
  }

  async generateToken(data: any) {
    const token = jwt.sign(data, config.apiSecret, {
      expiresIn: config.apiTokenExpire
    });
    return token;
  }

  async getNewUserId() {
    this.response = {};
    let newUserId = 0;
    const qry = "SELECT userId FROM users ORDER BY  userId DESC LIMIT 1  ";
    const result = await db.selectRow(qry);
    if (result && result.userId > 0) {
      newUserId = parseInt(result.userId);
    }
    newUserId = newUserId + 1;
    this.response.status = "ok";
    this.response.newUserId = newUserId;

    return this.response;
  }
}

export let userModelObj: any = new userModel();
