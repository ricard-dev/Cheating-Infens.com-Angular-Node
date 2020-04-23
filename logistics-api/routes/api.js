var express = require("express");
var router = express.Router();
const aws = require("aws-sdk");
const testController = require("../application/controllers/test");
var multer = require("multer");
var upload = multer();
const clientController = require("../application/controllers/clientController");
const contractorController = require("../application/controllers/contractorController");
const companyController = require("../application/controllers/companyController");
const articleController = require("../application/controllers/articleController");
const personController = require("../application/controllers/personController");
const orderController = require("../application/controllers/orderController");
const invoiceController = require("../application/controllers/invoiceController");
const bankController = require("../application/controllers/bankController");
const historyController = require("../application/controllers/historyController");
const userController = require("../application/controllers/userController");
const commonController = require("../application/controllers/commonController");
const fileUploader = require("../application/utils/fileupload");
const defaultConfig = require("../application/utils/config");

const config = defaultConfig.default;

const s3 = new aws.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
  bucket: config.aws.bucket
});

const mailer = require("../application/utils/mailer");

router.post("/login", userController.login);

router.get("/get", testController.get);
router.post(
  "/addeditClient",
  fileUploader.pdfUpload.single("contractFiles"),
  clientController.addedit
);

router.post("/clientsList", clientController.getClientList);
router.get("/getClientDetails", clientController.getClientDetails);
router.delete("/deleteClient", clientController.deleteClient);
router.get("/getNewClientNo", clientController.getNewClientNo);
router.post("/clientPersonList", clientController.clientPersonList);
router.post("/deleteClientPerson", clientController.deleteClientPerson);
router.post("/clientOrderList", clientController.clientOrderList);
router.post("/deleteClientOrder", clientController.deleteClientOrder);
router.get("/getPriceList", clientController.getPriceList);
router.get("/getAccountMangers", clientController.getAccountManagers);

router.post(
  "/addeditContractor",
  fileUploader.pdfUpload.single("contractFiles"),
  contractorController.addedit
);

router.post("/contractorsList", contractorController.getContractorList);
router.get("/getContractorDetails", contractorController.getContractorDetails);
router.delete("/deleteContractor", contractorController.deleteContractor);
router.get("/getNewContractorNo", contractorController.getNewContractorNo);
router.post("/contractorPersonList", contractorController.contractorPersonList);
router.post(
  "/deleteContractorPerson",
  contractorController.deleteContractorPerson
);
router.post("/contractorOrderList", contractorController.contractorOrderList);
router.post(
  "/deleteContractorOrder",
  contractorController.deleteContractorOrder
);
router.post("/addOpenItem", contractorController.addOpenItem);

router.post(
  "/addeditCompany",
  fileUploader.imageUpload.single("logo"),
  companyController.addedit
);
router.post("/companiesList", companyController.getCompanyList);
router.get("/getCompanyDetails", companyController.getCompanyDetails);
router.get("/deleteCompany", companyController.deleteCompany);
router.get("/getNewCompanyNo", companyController.getNewCompanyNo);

router.post("/addeditArticle", articleController.addedit);
router.post("/articleList", articleController.getArticleList);
router.get("/getArticleDetails", articleController.getArticleDetails);
router.delete("/deleteArticle", articleController.deleteArticle);
router.get("/getNewArticleNo", articleController.getNewArticleNo);

router.post("/addeditPerson", upload.none(), personController.addedit);
router.post("/personList", personController.getPersonList);
router.get("/getPersonDetails", personController.getPersonDetails);
router.delete("/deletePerson", personController.deletePerson);
router.get("/getNewPersonNo", personController.getNewPersonNo);
router.post("/personOrderList", personController.personOrderList);

router.post("/addeditOrder", orderController.addedit);
router.post("/orderList", orderController.getOrderList);
router.get("/getOrderDetails", orderController.getOrderDetails);
router.delete("/deleteOrder", orderController.deleteOrder);
router.get("/getNewOrderNo", orderController.getNewOrderNo);
router.post("/savePriceHistory", orderController.savePriceHisotry);
router.get("/getPriceHistory", orderController.getPriceHistory);

router.post("/getOpenPositionList", orderController.getOpenPositions);

router.get(
  "/payments/contractors",
  contractorController.getContractorsForPayment
);

router.post("/contractorInvoices", invoiceController.getContractorInvoices);

router.post("/invoices", invoiceController.getInvoiceList);
router.post("/clientInvoices", invoiceController.getClientInvoices);
router.post("/invoiceItems", invoiceController.getInvoiceItems);

router.post("/banksList", bankController.getBanks);
router.post("/companyBanks", bankController.getCompanyBanks);
router.get("/banks/:bankId", bankController.getBank);
router.post("/banks", bankController.addBank);
router.patch("/banks/:bankId", bankController.updateBank);
router.delete("/banks/:bankId", bankController.deleteBank);
router.get("/getNewBankId", bankController.getNewBankId);

router.get("/users/:userId", userController.getUser);
router.get("/users", userController.getUsers);
router.get("/getNewUserId", userController.getNewUserId);
router.post(
  "/users",
  fileUploader.imageUpload.single("profile_pic"),
  userController.addUser
);

router.patch(
  "/users/:userId",
  fileUploader.imageUpload.single("profile_pic"),
  userController.updateUser
);

router.delete("/users/:userId", userController.deleteUser);
router.post("/usersList", userController.getUsersList);

router.get("/getStateList", commonController.getStateList);
router.post("/getHistory", historyController.getHistory);

router.get("/test", async function(req, res, next) {
  try {
    await mailer.sendInvoiceMail("itamar.do.57@gmail.com");
    res.send({
      message: "Email was sent successfully"
    });
  } catch (e) {
    res.status(520).send({
      message: "Email server not working"
    });
  }
});

router.get("/download/:filename", function(req, res) {
  const params = {
    Bucket: config.aws.bucket,
    Key: req.params.filename
  };
  res.setHeader("Content-Disposition", "attachment");

  s3.getObject(params)
    .createReadStream()
    .on("error", function(err) {
      res.status(500).json({ error: "Error -> " + err });
    })
    .pipe(res);
});

module.exports = router;
