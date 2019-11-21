const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const expressValidator = require("express-validator"); //req.checkbody()
const mongoConfig = require("./configs/mongo-config");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

require("dotenv").config();

//mongodb://heroku_8bd94qrf:irstf0rv1ds970eebtislm0apf@ds029638.mlab.com:29638/heroku_8bd94qrf
mongoose.connect(
  mongoConfig,
  { useNewUrlParser: true, useCreateIndex: true },
  error => {
    if (error) throw error;
    console.log(`connected to DB`);
  }
);

const app = express();
app.use(cors());

// Express validator
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.lenght) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// view engine setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//routers
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // console.log(err);
  res.status(err.status || 500).json(err);
});

module.exports = app;
