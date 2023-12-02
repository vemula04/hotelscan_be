var express = require("express");
var router = express.Router();
require("../config/db");
// const tenantModel = require("../model/tenant");
const User = require("../models/user");
const Item = require("../models/item");
const Artifact = require("../models/artifact");
const path = require("path");
const utils = require("../utils/utils");
const moment = require("moment");
const item = require("../models/item");
// const auth = require('../middleware/auth');

router.get("/getAllSpecials", async (req, res, next) => {
  try {
  } catch (err) {
    console.log("ERROR :: getAllSpecials", err);
    res.status(400).send({ message: "Exception occurred" });
  }
});

router.post("/saveItem", async (req, res) => {
  try {
    const {
      tenant_id,
      name,
      is_special,
      item_price,
      promotional_price,
      is_promotional_applicable,
      is_coupon_applicable,
      coupon_code,
      item_desc,
      url,
      expired_on,
      created_by,
      spicy_level,
    } = req.body;
    console.log(`saveItem :: url ::`, url);
    const is_veg = true;
    // const fileExt = utils.getFileExtension(url);
    // console.log(fileExt);
    // const is_video = utils.isVideoType(fileExt);
    //Item saving...
    const item = new Item({
      tenant_id: tenant_id,
      name: name,
      is_video: false,
      is_special: is_special,
      expired_on: expired_on,
      item_price: item_price,
      promotional_price: promotional_price,
      is_promotional_applicable: is_promotional_applicable,
      is_coupon_applicable: is_coupon_applicable,
      coupon_code: coupon_code,
      item_desc: item_desc,
      created_by: created_by,
      spicy_level: spicy_level,
      is_veg: is_veg,
      created_on: moment().format(),
    });
    await item
      .save()
      .then(async (data) => {
        //artifact...

        console.log("Item saved Successfully");
      })
      .catch((err) => console.log(err));

    if (item._id) {
      let artifact = await Artifact.findOne({ title: name, item_id: item._id });
      if (!artifact) {
        artifact = new Artifact({
          title: name,
          item_id: item._id,
          url: url,
          created_by: created_by,
          created_on: moment().format(),
        });
        await artifact.save().then(async (data) => {
          console.log("Artifact saved ", artifact._id);
        });
      }
    }
    res.send({
      status: 200,
      data: item,
    });
  } catch (err) {
    res.status(402).send(err);
  }
});
const prepareItemsArtifacts = (finalResults, item_ids) => {
  try {
    let filtered_items = [];
    finalResults.map((fres) => {
      // console.log(fres);
      for (const item of fres.items) {
        if (item_ids.includes(fres.item_id.toString())) {
          console.log("id matched ::", fres.item_id.toString());
          filtered_items.push({
            artifact_id: fres._id,
            url: fres.url,
            ...item,
          });
        }
      }
    });

    return filtered_items;
  } catch (err) {
    throw err;
  }
};

router.get("/getitems", async (req, res, next) => {
  try {
    console.log(req.query);
    const { is_special, tenant_id, is_all } = req.query;
    let items,
      artifacts,
      query = {
        tenant_id: tenant_id,
        status: true,
      };

    if (!is_all) {
      query = {
        tenant_id: tenant_id,
        is_special: is_special,
        status: true,
      };
    }
    console.log(query);
    items = await Item.find(query);
    let item_ids = [];
    if (items.length) {
      item_ids = items.map(({ _id }) => _id.toString());
    }
    console.log(`item_ids ::`, item_ids);
    const agg = [
      {
        $lookup: {
          from: "items",
          // let: {ID: '_id'},
          localField: "item_id",
          foreignField: "_id",
          as: "items",
          // pipeline: [{$match: {
          //     $expr: {
          //      $eq: [
          //       '$item_id', '$$ID'
          //      ]
          // }}}]
        },
      },
    ];
    console.log(`agg :: `, JSON.stringify(agg));
    const result = await Artifact.aggregate(agg);
    if (result) {
      const finalResults = result.filter((res) => {
        return res.items.length > 0;
      });
      const aitems = prepareItemsArtifacts(finalResults, item_ids);
      res.send({
        statusCode: 200,
        data: aitems,
      });
    }
  } catch (err) {
    console.log("ERROR :: ");
    console.error(err);
    res.status(400).send({
      statusCode: 502,
      message: err,
    });
  }
});
//update an Item
router.post("/updateItem", async (req, res) => {
  try {
    const {
      _id,
      tenant_id,
      name,
      is_special,
      item_price,
      promotional_price,
      is_promotional_applicable,
      is_coupon_applicable,
      coupon_code,
      item_desc,
      url,
      expired_on,
      spicy_level,
      updated_by,
    } = req.body;
    console.log(`saveItem :: url ::`, url);
    const is_veg = true;
    // const fileExt = utils.getFileExtension(url);
    // console.log(fileExt);
    // const is_video = utils.isVideoType(fileExt);
    //Item saving...
    // const item = new Item({
    //     tenant_id: tenant_id,
    //     name: name,
    //     is_video: false,
    //     is_special: is_special,
    //     expired_on: (expired_on),
    //     item_price: item_price,
    //     promotional_price: promotional_price,
    //     is_promotional_applicable: is_promotional_applicable,
    //     is_coupon_applicable: is_coupon_applicable,
    //     coupon_code: coupon_code,
    //     item_desc: item_desc,
    //     created_by: created_by,
    //     spicy_level: spicy_level,
    //     is_veg: is_veg,
    // })
    const update_item = {
      tenant_id: tenant_id,
      name: name,
      is_video: false,
      is_special: is_special,
      expired_on: expired_on,
      item_price: item_price,
      promotional_price: promotional_price,
      is_promotional_applicable: is_promotional_applicable,
      is_coupon_applicable: is_coupon_applicable,
      coupon_code: coupon_code,
      item_desc: item_desc,
      spicy_level: spicy_level,
      is_veg: is_veg,
      updated_by: updated_by,
    };
    console.log(update_item);

    const doc = await Item.findByIdAndUpdate(_id, update_item, {
      new: true,
    });
    let response = {};
    // console.log(doc);
    if (doc._id) {
      // if (_id) {
      //   console.log(doc._id);
      const artifact = await Artifact.findOne({ item_id: _id });
      console.log(artifact);
      //   return res.send(artifact);
      if (artifact) {
        artifact.title = name;
        artifact.url = url;
        artifact.updated_by = updated_by;
        artifact.updated_on = moment().format();
        const art_doc = await Artifact.updateOne(
          { _id: artifact?._id },
          artifact,
          {
            new: true,
          }
        );
        if (art_doc) {
          response = {
            statusCode: 200,
            data: [doc, artifact],
            message: "Success",
          };
          res.send(response);
        }
      } else {
        console.log(`Artifact not found of an item :: ${_id}`);
      }
    } else {
      console.log(`Document not found`);
      response = { statusCode: 502, data: {}, message: `Item Not Found` };
      res.send(response);
    }
  } catch (err) {
    console.error(err);
  }
});
//bulk deletion or single deletion of an item
router.post("/deleteItems", async (req, res) => {
  try {
    const { _ids, status, updated_by } = req.body;
    console.log("deleteItem action triggered", _ids, status);
    if (Array.isArray(_ids)) {
      const status_items = await Item.updateMany(
        { _id: { $in: _ids } },
        {
          $set: {
            status: status,
            updated_by: updated_by,
            updated_on: moment().format(),
          },
        },
        { multi: true }
      );

      const updated_items = await Item.find({ _id: { $in: _ids } }).select({
        status: 1,
        _id: 1,
        tenant_id: 1,
        is_special: 1,
      });
      console.log(updated_items);
      res.send({ statusCode: 200, data: updated_items, message: "success" });
    } else {
      res.send({
        statusCode: 404,
        data: [],
        message: "_ids - expected as an array",
      });
    }
  } catch (err) {
    console.error(err);
    res.send({ statusCode: 404, data: [], message: err?.message });
  }
});
module.exports = router;
