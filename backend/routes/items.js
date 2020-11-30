const express = require("express");
const router = express.Router();

// Load User model
const User = require("../models/user.model");
const Item = require("../models/item.model");

// Get mongodb connection
const mongoose = require("mongoose");
const conn = mongoose.connection;

// Get assertion functions
const utils = require("../utils")
const assertTrue = utils.assertTrue;
const assertFalse = utils.assertFalse;


// Get items by id
/* 
Input Format: {
    0: id_0 - Id of the first item to retrieve
    1: id_1 - Id of the second item to retrieve
    ...
}

Output Format:
Array of item documents in the order the ids were given
[item_1, item_2, ...]

*/
router.get('/get', (req, res) => {
    console.log(req.query)

    var id_arr = []
    var id_map = {}
    var id;
    for(var i = 0; i < Object.keys(req.query).length; i++){
        id = req.query[String(i)];
        id_arr.push(id)
        id_map[id] = i
    }
    
    Item.find({_id: {$in: id_arr}}).then(
            items => {
                var ordered = id_arr.map(id => null)
                
                items.map((item) => {
                    ordered[id_map[item._id]] = item
                })

                res.json(ordered);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Get a single item by id
/* 
Input Format: {
    id: Id of the item to retrieve
}

Output Format:
Item document

*/
router.get('/get_one', (req, res) => {
    console.log(req.query)

    var id_arr = []
    var id_map = {}
    var id;
    for(var i = 0; i < Object.keys(req.query).length; i++){
        id = req.query[String(i)];
        id_arr.push(id)
        id_map[id] = i
    }
    
    Item.find({_id: {$in: id_arr}}).then(
            items => {
                var ordered = id_arr.map(id => null)
                
                items.map((item) => {
                    ordered[id_map[item._id]] = item
                })

                res.json(ordered);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})


// @route POST api/items/updateItem
// @desc updateItem Item
// @access Public
router.post("/update", (req, res) => {
    Item.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        value: req.body.value
    }).then((item) => {
        res.json(item);
    }).catch((err) => {
        res.status(400).json("Error: " + err)
    });
});

// Create an item
router.post('/add', async (req, res) => {
    const session = await conn.startSession()

    console.log("Adding New Item:", req.query)
    
    session.startTransaction()

    try {
        var item = await Item.create([{
            name: req.query.name,
            value: req.query.value,
            user_id: req.query.user_id,
            description: req.query.description,
            images: [req.query.image_link],
            status: "private"
        }], {session: session})

        assertFalse(item.length == 0, "Item Not Created")

        item = item[0];

        const user = await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.user_id), {
            $push: {items: item._id}
        }, {session: session})

        assertFalse(user == null, "User Not Found")

        await session.commitTransaction()
        session.endSession()

        res.json("Item Created")

    } catch (err) {
        console.log(err)
        await session.abortTransaction()
        session.endSession()
        res.status(400).json("Error: " + err)
    }
})

// Add image to an item
router.post('/add_image', (req, res) => {
    Item.findByIdAndUpdate(req.query.id, {
        $push: {images: req.query.link}
    }).then(
        () => res.json("Image Added")
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Remove image from an item by index
router.post('/remove_image', async (req, res) => {
    const session = await conn.startSession()

    console.log("Adding New Item:", req.query)
    
    session.startTransaction()

    try {
        var index_str = "images." + req.query.index
        var item = await Item.findByIdAndUpdate(req.query.id, {
            $unset: {index_str: 1}
        }, {session: session})

        assertFalse(item == null, "Item Not Found")

        item = await Item.findByIdAndUpdate(req.query.id, {
            $pull: {index: null}
        }, {session: session})

        assertFalse(item == null, "Item Not Found")

        await session.commitTransaction()
        session.endSession()

        res.json("Image Removed")
    }
    catch (err){
        await session.abortTransaction()
        session.endSession()
        res.status(400).json("Error: " + err)
    }
})

module.exports = router;