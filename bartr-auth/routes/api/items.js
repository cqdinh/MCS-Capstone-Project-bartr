const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateAddItemInput = require("../../validation/addItem");
// Load User model
const Item = require("../../models/Item");

// @route POST api/items/addItem
// @desc addItem Item
// @access Public
router.post("/addItem", (req, res) => {
  // Form validation
  const { errors, isValid } = validateAddItemInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Item.findOne({ id: req.body.id }).then((item) => {
    if (item) {
      return res.status(400).json({ email: "Item id already exists" });
    } else {
      const newItem = new Item({
        id: req.body.id,
        display_name: req.body.display_name,
        value: req.body.value,
        user_id: req.body.user_id,
      });
      newItem
        .save()
        .then((item) => res.json(item))
        .catch((err) => console.log(err));
    }
  });
});

// @route POST api/items/updateItem
// @desc updateItem Item
// @access Public
router.post("/updateItem", (req, res) => {
  // Form validation
  const { errors, isValid } = validateAddItemInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newItem = {
    id: req.body.id,
    display_name: req.body.display_name,
    value: req.body.value,
    user_id: req.body.user_id,
    status: req.body.status,
  };
  Item.findOneAndUpdate({ id: req.body.id }, newItem).then((item) => {
    res.json(item);
  });
});

module.exports = router;
