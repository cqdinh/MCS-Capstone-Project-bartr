const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

let User = require('./models/user.model')
let Item = require('./models/item.model')
let Trade = require('./models/trade.model');
const { assert } = require('console');

var app = express()
port = 8080


/*
router.route('/first').get((req, res) => {

    User.findOne()
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});*/

var username = "capstone_user"
var password = "user_password"
var db_name = "capstone_db"

var uri = "mongodb+srv://" + username + ":" + password + "@capstonecluster.vrc3f.mongodb.net/" + db_name + "?retryWrites=true&w=majority"

//var client = mongo.MongoClient(uri, { useUnifiedTopology: true });

mongoose.connect(uri, 
    {
        useFindAndModify: false,
        useNewUrlParser: true, 
        useCreateIndex: true, 
        useUnifiedTopology: true
    }).catch((err) => {
        console.log("connection Failed")
});

const conn = mongoose.connection;

conn.once('open', () => {
    console.log("MongoDB connection successful");
});

// Create a User
app.post('/users/add', (req, res) => {
    User.create({
        display_name: req.query.display_name,
        location: {
            type: "Point",
            coordinates: [
                req.query.longitude, 
                req.query.latitude
            ]
        },
        email: req.query.email,
        phone: req.query.phone
    }).then(
        () => res.json("User Created")
    ).catch(err => res.status(400).json('Error: ' + err));;
})


// Get Items listed by a user
app.get('/users/items', (req, res) => {
    Item.find({user_id: mongoose.Types.ObjectId(req.query.id)}).then(
        items => {
            console.log(req.query.id)
            res.json(items);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})


// Get users near a specified point
app.get('/users/nearby', (req, res) => {
    User.find({
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [req.query.longitude, req.query.latitude]
                },
                $minDistance: 0,
                $maxDistance: 1000*req.query.distance_km
            } 
        }
    }, {_id: 1}).then(
        users => {
            console.log(req.query.id)
            res.json(users.map(user => user._id));
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Get Trades associated with a user
app.get('/users/trades', (req, res) => {
    Trade.find({
        $or: [
            {user1_id: mongoose.Types.ObjectId(req.query.id)},
            {user2_id: mongoose.Types.ObjectId(req.query.id)}
        ]}).then(
            trades => {
                res.json(trades);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Start a trade between two users
app.get('/trades/start', async (req, res) => {
    const session = await conn.startSession()

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

        assert(trade)
        trade = trade[0]

        assert(trade)

        const initiator = await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.initiator_id), {
            $push: {curr_trades: trade._id}
        }, {session: session})

        assert(initiator)

        const recipient = await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.recipient_id), {
            $push: {curr_trades: trade._id}
        }, {session: session})

        assert(recipient)

        await session.commitTransaction()
        session.endSession()

        res.json("Trade Started")

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        res.status(400).json("Error: " + err)
    }
})


// Create an item
app.post('/items/add', async (req, res) => {
    const session = await conn.startSession()

    console.log("Query:", req.query)
    
    session.startTransaction()

    try {
        var item = await Item.create([{
            name: req.query.name,
            value: req.query.value,
            user_id: req.query.user_id,
            status: "private"
        }], {session: session})

        assert(item)

        item = item[0];

        assert(item)

        const user = await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.user_id), {
            $push: {items: item._id}
        }, {session: session})

        assert(user)

        await session.commitTransaction()
        session.endSession()

        res.json("Item Created")

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        res.status(400).json("Error: " + err)
    }
})

// Add image to an item
app.post('/items/images/add', (req, res) => {
    Item.findByIdAndUpdate(req.query.id, {
        $push: {images: req.query.link}
    }).then(
        () => res.json("Image Added")
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Remove image from an item by index
app.post('/items/images/remove', async (req, res) => {
    try {
        var index_str = "images." + req.query.index
        var item = await Item.findByIdAndUpdate(req.query.id, {
            $unset: {index_str: 1}
        })

        assert(item)

        item = await Item.findByIdAndUpdate(req.query.id, {
            $pull: {index: null}
        })

        assert(item)
    }
    catch (err){
        res.status(400).json('Error: ' + err)
    }
})

var server = app.listen(port, function(){
    console.log("Expres server listening on port", server.address().port)
})