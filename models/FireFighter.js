const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    pump: String,
    seat: String,
    count: Number
});

const fireFighterSchema = new mongoose.Schema({
    number: Number,
    rank: String,
    name: String,
    md: Boolean,
    rescue: Boolean,
    aerial: Boolean,
    counts: [childSchema]
    });

const FireFighter = mongoose.model('FireFighter', fireFighterSchema);

module.exports = FireFighter;
