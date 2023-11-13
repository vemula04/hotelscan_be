var express = require('express');
var router = express.Router();
require("../config/db");
// const tenantModel = require("../model/tenant");
const User = require('../models/user');
const Item = require("../models/item");
const Artifact = require("../models/artifact");
const path = require("path");
const utils = require("../utils/utils");
const moment = require('moment');

router.get('/getAllSpecials', async (req, res, next) => {
    try {

    } catch (err) {
        console.log("ERROR :: getAllSpecials", err);
        res.status(400).send({ message: "Exception occurred" });
    }
});

router.post('/saveItem', async (req, res) => {

    try {

        const { tenant_id, name, is_special, item_price, promotional_price, is_promotional_applicable, is_coupon_applicable, coupon_code, item_desc, url, expired_on, created_by } = req.body;

        const fileExt = utils.getFileExtension(url);
        const is_video = utils.isVideoType(fileExt);
        //Item saving...
        const item = new Item({
            tenant_id: tenant_id,
            name: name,
            is_video: is_video,
            is_special: is_special,
            expired_on: (expired_on),
            item_price: item_price,
            promotional_price: promotional_price,
            is_promotional_applicable: is_promotional_applicable,
            is_coupon_applicable: is_coupon_applicable,
            coupon_code: coupon_code,
            item_desc: item_desc,
            created_by: created_by
        })
        await item.save()
            .then(async (data) => {
                //artifact...
                
                console.log('Item saved Successfully');

            })
            .catch((err) => console.log(err));

        if(item._id) {
            let artifact = await Artifact.findOne({ title: name, item_id: item._id });
                if (!artifact) {
                    artifact = new Artifact({
                        title: name,
                        item_id: item._id,
                        url: url,
                        created_by: created_by
                    });
                    await artifact.save()
                    .then( async (data) => {
                        console.log("Artifact saved ", artifact._id);
                    })
                }
        }
        res.send(item);

    } catch (err) {
        res.status(402).send(err);
    }
});

router.get("/getitems", async (req, res, next) => {
    try {
        const {is_special, tenant_id, is_all} = req.query;
        let items,
        artifacts, 
        query = {
            tenant_id:tenant_id,            
            status: true
        };
        if(!is_all) {
            query = {
                tenant_id:tenant_id, 
                is_special:is_special, 
                status: true
            }
        }
        items = await Item.find(query);
        // console.log(items)
        if(items) {
            console.log(items[0]._id)
            artifacts = await Artifact.find({item_id:items[0]._id})            
        }

        await artifacts.aggregate([            
            { $lookup:
                    { 
                        from: "items",
                        localField: "item_id",
                        foreignField: "_id",
                        as: "items"                        
                    }
            }]).exec(function(error, items){

                if(error){return next(error);}        
                console.log(items);
        });
        // res.send(artifacts);
    
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;