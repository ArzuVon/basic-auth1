'user strict';

const express = require('express');

const userCollection = require('../models/index.js').User;

const router = express.Router();

router.get('/user/:id', getOneUsers);
router.get('/user', createUsers);

async function getOneUsers(req, res) {
  let id = req.params.id;
  let theUsers = await userCollection.read(id);
  res.status(200).json(theUsers);
}

async function createUsers(req, res) {
  let obj = req.body;
  let newUsers = await userCollection.create(obj);
  res.status(200).json(newUsers);
}

module.exports = router;
