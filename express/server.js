"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const axios = require('axios');
const cors = require('cors')

const router = express.Router();
const BASE_URL = "http://45.32.252.34:8080/being-local-api";

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    "<style>body {background-color: #56ded8;text-align: center;margin-top: 10%;font-size: xx-large;text-transform: uppercase;}</style>"
  );
  res.write(
    "<h1>Welcome To BeingLocal API</h1>"
  );
  res.end();
});

router.get("/another", (req, res) => res.json({ route: req.originalUrl }));
router.post("/", (req, res) => res.json({ postBody: req.body }));


router.get("/v1.0/product-categories", delegate());

router.get("/v1.0/product-category/:id/children", delegate());

router.get("/v1.0/product-category/:id", delegate());

router.get("/v1.0/countries", delegate());

router.get("/v1.0/country/:id", delegate());


app.use(cors())
app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
function delegate() {
  return (req, res) => {
    const api = axios.create({
      baseURL: BASE_URL,
    });
    api.get(req.path).then((resp) => {
      res.send(resp.data);
    });
  };
}

