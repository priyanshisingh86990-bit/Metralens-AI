const express = require("express");

const {
  createInspection,
} = require("../controllers/inspectionController");

const router = express.Router();

router.post(
  "/",
  createInspection
);

module.exports = router;