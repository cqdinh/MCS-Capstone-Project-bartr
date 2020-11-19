const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

let User = require('./models/user.model')
let Item = require('./models/item.model')
let Trade = require('./models/trade.model');

var app = express()
port = 8080

function assert(value, message){
    if (!value){
        throw message
    }
}


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

console.log(uri);

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
    User.findById(req.query.id, {items: 1}).then(
        user => {
            res.json(user.items);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})


// Get users near a specified point
/* 
Input Format: {
    longitude: Point longitude
    latitude: Point latitude
    distance_km: Radius within which to select users
}

Output Format:
[user_id_1, user_id_2, ...]

*/
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
/* 
Input Format: {
    id: id of the user to search for
}

Output Format:
[trade_id_1, trade_id_2, ...]

*/
app.get('/users/trades/current', (req, res) => {
    User.findById(req.query.id, {curr_trades: 1}).then(
            user => {
                res.json(user.curr_trades);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

/* 
Input Format: {
    id: id of the user to search for
}

Output Format:
[trade_id_1, trade_id_2, ...]

*/
app.get('/users/trades/past', (req, res) => {
    User.findById(req.query.id, {past_trades: 1}).then(
            user => {
                res.json(user.past_trades);
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
app.post('/trades/start', async (req, res) => {
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


// Create an item
app.post('/items/add', async (req, res) => {
    const session = await conn.startSession()

    console.log("Adding New Item:", req.query)
    
    session.startTransaction()

    try {
        var item = await Item.create([{
            name: req.query.name,
            value: req.query.value,
            user_id: req.query.user_id,
            status: "private"
        }], {session: session})

        assert(item.length != 0, "Item Not Created")

        item = item[0];

        const user = await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.user_id), {
            $push: {items: item._id}
        }, {session: session})

        assert(user != null, "User Not Found")

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
app.post('/items/images/add', (req, res) => {
    Item.findByIdAndUpdate(req.query.id, {
        $push: {images: req.query.link}
    }).then(
        () => res.json("Image Added")
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Remove image from an item by index
app.post('/items/images/remove', async (req, res) => {
    const session = await conn.startSession()

    console.log("Adding New Item:", req.query)
    
    session.startTransaction()

    try {
        var index_str = "images." + req.query.index
        var item = await Item.findByIdAndUpdate(req.query.id, {
            $unset: {index_str: 1}
        }, {session: session})

        assert(item != null, "Item Not Found")

        item = await Item.findByIdAndUpdate(req.query.id, {
            $pull: {index: null}
        }, {session: session})

        assert(item != null, "Item Not Found")

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
app.get('/trades', (req, res) => {
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
app.get('/items', (req, res) => {
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



var server = app.listen(port, function(){
    console.log("Expres server listening on port", server.address().port)
})