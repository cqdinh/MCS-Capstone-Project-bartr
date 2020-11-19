const express = require("express");
const router = express.Router();

// Load User model
const User = require("../models/user.model");
const Trade = require("../models/trade.model");

const utils = require("../utils")
const assert = utils.assert;


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

    var id_arr = []
    var id_map = {}
    var id;
    for(var i = 0; i < Object.keys(req.query).length; i++){
        id = req.query[String(i)];
        id_arr.push(id)
        id_map[id] = i
    }
    
    Trade.find({_id: {$in: id_arr}}).then(
            trades => {
                var ordered = id_arr.map(id => null)
                
                trades.map((trade) => {
                    ordered[id_map[trade._id]] = trade
                })

                res.json(ordered);
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

    console.log("Query:", req.query)
    
    session.startTransaction()

    try {
        var trade = await Trade.create([{
            init_timestamp: new Date(),
            complete_timestamp: null,
            status: "offer",
            user1_id: req.query.initiator_id,
            user2_id: req.query.recipient_id,
            user1_items: req.query.initiator_items,
            user2_items: req.query.recipient_items
        }], {session: session})

        assert(trade.length != 0, "Trade Not Created")
        trade = trade[0]

        const initiator = await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.initiator_id), {
            $push: {curr_trades: trade._id}
        }, {session: session})

        assert(initiator != null, "Initiator Not Found")

        const recipient = await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.recipient_id), {
            $push: {curr_trades: trade._id}
        }, {session: session})

        assert(recipient != null, "Recipient Not Found")

        await session.commitTransaction()
        session.endSession()

        res.json("Trade Started")

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        res.status(400).json("Error: " + err)
    }
})

module.exports = router;