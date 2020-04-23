var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var swaggerUi = require("swagger-ui-express");
var swaggerJSDoc = require("swagger-jsdoc");

var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var jwt = require("./application/utils/jwt");
var cors = require("cors");
var app = express();
var whitelist = [
  "http://localhost:4200",
  "http://localhost:4300",
  "http://51.68.126.2:3100",
  "http://51.68.126.2",
  "51.68.126.2:3100"
];

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Logistic Rest API", // Title of the documentation
    version: "1.0.0", // Version of the app
    description: "" // short description of the app
  },
  servers: [
    {
      url: "http://localhost:3100/api/"
      // url: 'http://100.26.197.6:3100/api/'
    }
  ],
  security: {
    bearerAuth: []
  }
};

const options = {
  swaggerDefinition,
  apis: ["./docs/**/*.yaml"]
};

swaggerSpec = swaggerJSDoc(options);

// var corsOptions = {
//   origin: function (origin, callback) {
//     console.log("this is origin", origin);
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "OPTION, GET, PUT, PATCH, POST, DELETE, PATCH"
  );
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(jwt());
app.use("/api", apiRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Unauthorized. Invalid token!" });
  } else {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  }
});

module.exports = app;
