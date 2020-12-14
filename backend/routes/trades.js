const express = require("express");
const router = express.Router();

// Load User model
const User = require("../models/user.model");
const Trade = require("../models/trade.model");
const Item = require("../models/item.model");

// Get mongodb connection
const mongoose = require("mongoose");
const conn = mongoose.connection;


// Get assertion functions
const utils = require("../utils")
const assertTrue = utils.assertTrue;
const assertFalse = utils.assertFalse;


// Get trades by id
/* 
Input Format: {
    0: id_0 - Id of the first trade to retrieve
    1: id_1 - Id of the second trade to retrieve
    ...
}

Output Format:
Array of trade documents in the order the ids were given
[trade_1, trade_2, ...]

*/
router.get('/get', (req, res) => {
    console.log(req.query)

    const object_ids = req.query.ids.map(x => mongoose.Types.ObjectId(x))
    
    Trade.find({_id: {$in: object_ids}}).then(
            trades => {
                
                res.json(trades);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Get all the offers a user needs to respond to
router.get('/get_received', (req, res) => {
    console.log(req.query)

    const user_id = mongoose.Types.ObjectId(req.query.id)
    
    Trade.find({$or: [{user1_id: user_id, status: "awaiting_user1"}, {user2_id: user_id, status: "awaiting_user2"}]}).then(
            trades => {
                res.json(trades);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Get all the offers a user has sent
router.get('/get_sent', (req, res) => {
    console.log(req.query)

    const user_id = mongoose.Types.ObjectId(req.query.id)
    
    Trade.find({$or: [{user1_id: user_id, status: "awaiting_user2"}, {user2_id: user_id, status: "awaiting_user1"}]}).then(
            trades => {
                res.json(trades);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

router.get('/get_accepted', (req, res) => {
    console.log(req.query)

    const user_id = mongoose.Types.ObjectId(req.query.id)
    
    Trade.find({$or: [{user1_id: user_id, status: "accepted"}, {user2_id: user_id, status: "accepted"}]}).then(
            trades => {
                res.json(trades);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Start a trade between two users
/* 
Input Format: {
    initiator_id: id of the user making the initial offer
    recipient_id: id of the user that the offer is made to
    initiator_items: array of the items belonging to the initiator
    recipient_items: array of the items belonging to the recipient
}
*/
router.post('/start', async (req, res) => {
    const session = await mongoose.connection.startSession()

    console.log("Query:", req.body)
    
    session.startTransaction()

    try {
        var trade = await Trade.create([{
            init_timestamp: new Date(),
            complete_timestamp: null,
            status: "awaiting_user2",
            user1_id: req.body.initiator_id,
            user2_id: req.body.recipient_id,
            user1_items: req.body.initiator_items,
            user2_items: req.body.recipient_items
        }], {session: session})

        assertFalse(trade.length == 0, "Trade Not Created")
        trade = trade[0]

        const initiator = await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.initiator_id), {
            $push: {curr_trades: trade._id}
        }, {session: session})

        assertFalse(initiator == null, "Initiator Not Found")

        const recipient = await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.recipient_id), {
            $push: {curr_trades: trade._id}
        }, {session: session})

        assertFalse(recipient == null, "Recipient Not Found")

        await session.commitTransaction()
        session.endSession()

        res.json("Trade Started")

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        res.status(400).json("Error: " + err)
    }
})

router.post('/delete', async (req, res) => {
    console.log("Cancelling Trade", req.body.id)
    
    await Trade.findByIdAndUpdate(req.body.id, {
        status: "cancelled"
    })
})

router.post('/accept', async (req, res) => {
    console.log("Accepting Trade", req.body.id)
    
    await Trade.findByIdAndUpdate(req.body.id, {
        status: "accepted"
    })
})

router.post('/complete', async (req, res) => {
    console.log("Completing Trade", req.body.id)
    
    const session = await mongoose.connection.startSession()

    console.log("Completing Trade:", req.body)
    
    session.startTransaction()

    try {
        let trade = await Trade.findByIdAndUpdate(req.body.id, {
            status: "completed",
            complete_timestamp: new Date()
        })

        assertFalse(trade.length == 0, "Trade Not Completed")

        console.log("Trade", trade)
        console.log("user1", trade.user1_items)

        for(var i = 0; i < trade.user1_items.length; i++){
            let item = await Item.findByIdAndUpdate(trade.user1_items[i], 
                {status: "unlisted"})
            assertFalse(item == null, "Item not Deleted")
        }
        for(var i = 0; i < trade.user2_items.length; i++){
            let item = await Item.findByIdAndUpdate(trade.user2_items[i],
                {status: "unlisted"})
            assertFalse(item == null, "Item not Deleted")
        }


        await session.commitTransaction()
        session.endSession()

        res.json("Trade Completed")

    } catch (err) {
        console.log(err)
        await session.abortTransaction()
        session.endSession()
        res.status(400).json("Error: " + err)
    }
})

router.post('/counter', (req, res) => {
    console.log("Completing Trade", req.body.id)
    
    if (req.body.current_status === "awaiting_user1"){
        Trade.findByIdAndUpdate(req.body.id, {
            status: "awaiting_user2",
            user1_items: req.body.items
        }).then(
            trade => res.json(trade)
        ).catch(
            err => res.status(400).json("Error: " + err)
        )
    }
    else if (req.body.current_status === "awaiting_user2"){
        Trade.findByIdAndUpdate(req.body.id, {
            status: "awaiting_user1",
            user2_items: req.body.items
        }).then(
            trade => res.json(trade)
        ).catch(
            err => res.status(400).json("Error: " + err)
        )
    }    
})


module.exports = router;