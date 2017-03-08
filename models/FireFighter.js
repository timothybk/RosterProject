const mongoose = require('mongoose');

const fireFighterSchema = new mongoose.Schema({
    number: Number,
    rank: String,
    name: String,
    md: Boolean,
    rescue: Boolean,
    aerial: Boolean,
    genDutyCounts: {
      flyerOneCount: Number,
      flyerTwoCount: Number,
      flyThreeCount: Number,
      runneroneCount: Number,
      runnerTwoCount: Number,
      runnerThreeCount: Number,
      rescuePumpThreeCount: Number,
      spareCount: Number
    },
    driverCounts: {
      flyerDriverCount: Number,
      runnerDriverCount: Number,
      rescuePumpDriverCount: Number
    },
    rescueCounts: {
      rescuePumpOneCount: Number,
      rescuePumpTwoCount: Number,
      salvageDriverCount: Number,
      salvageOffsiderCount: Number
    },
    brontoCounts: {
      brontoDriverCount: Number,
      brontoOffsiderCount: Number
    }
  },{ timestamps: true });

const FireFighter = mongoose.model('FireFighter', fireFighterSchema);

module.exports = FireFighter;
