const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load User model
const User = require("../models/user.model");
const Item = require("../models/item.model");

// Get mongodb connection
const mongoose = require("mongoose");
const conn = mongoose.connection;

// Get assertion functions
const utils = require("../utils");
const assertTrue = utils.assertTrue;
const assertFalse = utils.assertFalse;



// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        display_name: req.query.display_name,
        location: {
            type: "Point",
            coordinates: [
                req.query.longitude, 
                req.query.latitude
            ]
        },
        email: req.body.email,
        phone: req.query.phone,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user._id,
          display_name: user.display_name,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// Get a user's entire profile
router.get('/profile', (req, res) => {
    User.findById(req.query.id).then(
        user => {
            res.json(user);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Get name of a user
router.get('/name', (req, res) => {
    User.findById(req.query.id, {display_name: 1}).then(
        user => {
            res.json(user.display_name);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

// Get Items listed by a user
router.get('/items', (req, res) => {
    User.findById(req.query.id, {items: 1}).then(
        user => {
            res.json(user.items);
        }
    ).catch();;
})

// Get Items listed by a set of users
router.get('/items_batch', async (req, res) => {
    Item.find({"user_id": {$in: req.query.ids}}).then(
        items => res.json(items)
    ).catch(
        err => res.status(400).json('Error: ' + err)
    )
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
router.get('/nearby', (req, res) => {
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
router.get('/current_trades', (req, res) => {
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
router.get('/users/past_trades', (req, res) => {
    User.findById(req.query.id, {past_trades: 1}).then(
            user => {
                res.json(user.past_trades);
        }
    ).catch(err => res.status(400).json('Error: ' + err));;
})

module.exports = router;
