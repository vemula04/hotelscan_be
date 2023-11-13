var express = require('express');
var router = express.Router();
const db = require("../config/db");
const auth = require('../middleware/auth');
const Token = require("../models/token");
const Tenant = require('../models/tenant');
const Role = require('../models/roles');

/* GET link verification. */
router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email, password } = (req.body);

  const token = await Token.findOne({
    email: email,
    token: password,
  });
  if (!token) return res.status(400).send("Invalid credentails");

  const tenant_details = await Tenant.findOne({
    _id: token.tenant_id
  });

  if (!tenant_details) return res.status(502).send("Tenant not exist");
  //if tenant exist...
  const role = await Role.findOne({_id: token.role_id});
  const user_details = {
    role: role.name,
    tenant: tenant_details
  };
  res.send(user_details);

  // res.send('respond with a resource');
});

router.post("/createRole", async (req, res) => {
  try {
    const { rolename, created_by } = req.body;
    const role = new Role({ name: rolename, created_by: created_by, updated_by: created_by });
    role.save().then(async (data) => {
      console.log('Role created Successfully');
      res.send("Role created Successfully");
    }).catch((err) => console.log(err));

  } catch (err) {
    console.log("Exception occurred :: createRole", err)
  }
})

module.exports = router;
