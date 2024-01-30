var express = require("express");
var router = express.Router();
require("../config/db");
// const tenantModel = require("../model/tenant");
const User = require("../models/user");
const Item = require("../models/item");
const Artifact = require("../models/artifact");
const path = require("path");
const utils = require("../utils/utils");
var moment = require("moment");
const item = require("../models/item");
const cron = require("node-cron");
const sendEmail = require("../utils/email");
const emailTempaltes = require("../config/emailtemplate");
const Tenant = require("../models/tenant");
const { config } = require("../config/config");
// const auth = require('../middleware/auth');

const prepareAndSendHTMLContent = async (item_details, item_details_obj) => {
  try {
    const baseURL = "http://h-app-scanner.s3-website-ap-southeast-2.amazonaws.com";
    console.log(`item_details_obj ------`, Object.keys(item_details_obj));
    for (let x in item_details_obj) {
      // console.log("=========", item_details_obj[x]);
      // console.log(`item_details:`, item_details);
      let html_string = `<table class="bg_white" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr style="border-bottom: 1px solid rgba(0,0,0,.05);">
      <th width="80%" style="text-align:left; padding: 0 2.5em; color: #000; padding-bottom: 20px">Item</th>
      <th width="20%" style="text-align:right; padding: 0 2.5em; color: #000; padding-bottom: 20px">Price</th>
    </tr>`;
      for (detail of item_details_obj[x]) {
        html_string += `
      <tr style="border-bottom: 1px solid rgba(0,0,0,.05);">
        <td valign="middle" width="80%" style="text-align:left; padding: 0 2.5em;">
          <div class="product-entry">
            <img src="${
              detail.item_image
            }" alt="" style="width: 100px; max-width: 600px; height: auto; margin-bottom: 20px; display: block;">
            <div class="text">
              <h3>${detail.name}</h3>
              <span>Expired on:: ${moment(detail.expired_on).format(
                "lll"
              )}</span>
              <p>${detail.desc}</p>
            </div>
          </div>
        </td>
        <td valign="middle" width="20%" style="text-align:left; padding: 0 2.5em;">
          <span class="price" style="color: #000; font-size: 20px;">$${
            detail.price
          }</span>
        </td>
      </tr>      
      `;
      }
      html_string += `</table>`;
//       html_string += `<tr>
//     <td valign="middle" style="text-align:left; padding: 1em 2.5em;">
//       <p><a href="${baseURL}/#/" class="btn btn-primary">Login & Update here</a></p>
//     </td>
//   </tr>
// </table>`;
      await sendEmail(
        x,
        "Items are going to be expired",
        "",
        emailTempaltes.loadExpirationTemplate(html_string)
      );
    }

    // return html_string;
  } catch (err) {}
};

router.get("/getAllSpecials", async (req, res, next) => {
  try {
    console.log(`getAllSpecials`);
    cron.schedule("10 13 01 * * *", async () => {
      console.log(`cron.schedule`);
      let startDate = moment("2023-11-13T11:53:56.882+00:00").format();
      let endDate = moment();
      let days = endDate.diff(startDate, "days");
      console.log("running a task every minute -- ", moment().format());
      console.log("before hitting mongo");
      const items = await Item.find({
        status: true,
        is_special: true,
        expired_on: { $lte: moment().format() },
      }).select({
        status: 1,
        name: 1,
        is_special: 1,
        _id: 1,
        tenant_id: 1,
        expired_on: 1,
        created_on: 1,
        item_desc: 1,
        currency_code: 1,
        item_price: 1,
      });
      // return Episode.
      // find({ airedAt: { $gte: '1987-10-19', $lte: '1987-10-26' } }).
      // sort({ airedAt: 1 });
      console.log(`items: ${items.length}`);
      // const tenant_ids = items.filter((item) => {
      //   return item.tenant_id;
      // });
      if (items.length) {
        let expired_items = [],
          tobeexpired_items = [];
        let tobeexpired_items_ = {},
          expired_items_ = {};
        // console.log(`if (items.length `, items)
        for (let item of items) {
          // console.log(item);
          // console.log(
          //   `moment ${moment()} item.expired_on :: ${item.expired_on}`
          // );
          startDate = moment(`${item.created_on}`);
          endDate = moment();
          days = endDate.diff(startDate, "days");
          console.log(`days: ${days}`);
          if (days >= 0) {
            const tenant_details = await Tenant.findById({
              _id: item.tenant_id,
            }).select({ name: 1, url: 1, email: 1 });
            console.log(tenant_details.email);
            // let artifact = await Artifact.findById({
            //   title: item.name,
            //   item_id: item._id,
            // }).select({ url: 1, status: 1 });

            if (days >= 1) {
              console.log(
                `trigger :: going to expired the items`,
                item.expired_on
              );
              tobeexpired_items.push({
                name: item.name,
                expired_on: item.expired_on,
                tenant_name: tenant_details.name,
                logo: tenant_details.url,
                desc: item.item_desc,
                email: tenant_details.email,
                item_image: "",
                currency_code: item.currency_code,
                price: item.item_price,
              });
              if (!tobeexpired_items_[`${tenant_details.email}`]) {
                tobeexpired_items_[`${tenant_details.email}`] = [];
              }
              tobeexpired_items_[`${tenant_details.email}`].push({
                name: item.name,
                expired_on: item.expired_on,
                tenant_name: tenant_details.name,
                logo: tenant_details.url,
                desc: item.item_desc,
                email: tenant_details.email,
                item_image: "",
                currency_code: item.currency_code,
                price: item.item_price,
              });
              // await sendEmail(tenant_details.email,"item is going to expire soon", "", emailTempaltes.loadExpirationTemplate())
            } else if (days == 0) {
              console.log(
                `trigger :: email :: ${item.name} is going to be expired today ... pls. renew the items immediately`
              );
              expired_items.push({
                name: item.name,
                expired_on: item.expired_on,
                tenant_name: tenant_details.name,
                logo: tenant_details.url,
                desc: item.description,
                email: tenant_details.email,
                item_image: "",
                currency_code: item.currency_code,
                price: item.item_price,
              });
              if (!expired_items_[`${tenant_details.email}`]) {
                expired_items_[`${tenant_details.email}`] = [];
              }
              expired_items_.push({
                name: item.name,
                expired_on: item.expired_on,
                tenant_name: tenant_details.name,
                logo: tenant_details.url,
                desc: item.description,
                email: tenant_details.email,
                item_image: "",
                currency_code: item.currency_code,
                price: item.item_price,
              });
              // await sendEmail()
            }
          }
        }
        if (tobeexpired_items.length) {
          prepareAndSendHTMLContent(tobeexpired_items, tobeexpired_items_);
        }
        if (expired_items.length) {
          prepareAndSendHTMLContent(expired_items, expired_items_);
        }
      } else {
        console.log(`no items`);
      }
    });
    res.send({ message: "scheduled successfully", data: "" });
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
      is_veg,
    } = req.body;
    console.log(`saveItem :: url ::`, url);
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
      is_veg,
    } = req.body;
    console.log(`saveItem :: url ::`, url);
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
