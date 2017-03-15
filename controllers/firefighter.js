const async = require('async');
const FireFighter = require('../models/FireFighter.js');

/**
 * GET /
 * Scorecard
 */
exports.scorecard = (req, res, next) => {
    console.log(req.params.ffid);

    FireFighter.findOne({ number: req.params.ffid }, (err, fire_fighter) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (fire_fighter) {
            const fire_fighterObject = fire_fighter.toObject();
            const fire_list = [];
            for (var i in fire_fighterObject.genDutyCounts) {
                fire_list.push([i, fire_fighterObject.genDutyCounts[i]])
            }
            for (var i in fire_fighterObject.driverCounts) {
                if (fire_fighterObject.driverCounts[i] != null) {
                    fire_list.push([i, fire_fighterObject.driverCounts[i]])
                }
            }
            for (var i in fire_fighterObject.rescueCounts) {
                if (fire_fighterObject.rescueCounts[i] != null) {
                    fire_list.push([i, fire_fighterObject.rescueCounts[i]])
                }
            }
            for (var i in fire_fighterObject.brontoCounts) {
                if (fire_fighterObject.brontoCounts[i] != null) {
                    fire_list.push([i, fire_fighterObject.brontoCounts[i]])
                }
            }

            fire_list.sort(function(a, b) {
                return a[1] - b[1]
            });

            console.log(fire_list)
            res.render('fire_fighter/scorecard', {
                title: 'Scorecard of amazing',
                fire_fighter: fire_fighterObject,
                fire_list: fire_list
            });
        } else {
            res.render('fire_fighter/scorecard', {
                title: 'Scorecard of shit'
            });
        }
    });


};

/**
 * GET /
 * Add
 */
exports.add = (req, res, next) => {

    res.render('fire_fighter/add', {
        title: 'Scorecard of shit'
    });


};

/**
 * POST /
 * Add
 */
exports.addPost = (req, res, next) => {

    const fire_fighter = new FireFighter({
        number: req.body.number,
        rank: req.body.rank,
        name: req.body.name,
        md: req.body.md,
        rescue: req.body.rescue,
        aerial: req.body.aerial,
        counts: [{
            pump: "flyer",
            seat: "driver",
            count: req.body.flyerDriverCount
        }, {
            pump: "flyer",
            seat: "one",
            count: req.body.flyerOneCount
        }, {
            pump: "flyer",
            seat: "two",
            count: req.body.flyerTwoCount
        }, {
            pump: "flyer",
            seat: "three",
            count: req.body.flyerOneCount
        }, {
            pump: "runner",
            seat: "driver",
            count: req.body.runnerDriverCount
        }, {
            pump: "runner",
            seat: "one",
            count: req.body.runnerOneCount
        }, {
            pump: "runner",
            seat: "two",
            count: req.body.runnerTwoCount
        }, {
            pump: "runner",
            seat: "three",
            count: req.body.runnerThreeCount
        }, {
            pump: "rp1",
            seat: "driver",
            count: req.body.rescuePumpDriverCount
        }, {
            pump: "rp1",
            seat: "one",
            count: req.body.rescuePumpOneCount
        }, {
            pump: "rp1",
            seat: "two",
            count: req.body.rescuePumpTwoCount
        }, {
            pump: "rp1",
            seat: "three",
            count: req.body.rescuePumpThreeCount
        }, {
            pump: "salvage",
            seat: "driver",
            count: req.body.salvageDriverCount
        }, {
            pump: "salvage",
            seat: "offsider",
            count: req.body.salvageOffsiderCount
        }, {
            pump: "bronto",
            seat: "driver",
            count: req.body.brontoDriverCount
        }, {
            pump: "bronto",
            seat: "offsider",
            count: req.body.brontoOffsiderCount
        }, {
            pump: "spare",
            seat: "spare",
            count: req.body.spareCount
        }]
    });
    fire_fighter.save((err) => {
        if (err) {
            console.log(err);
            return next(err);
        }

        req.flash('success', { msg: 'YEAH fuckers' });
        res.redirect('/firefighter/add');

    });


};

/**
 *GET /
 *list
 */

exports.list = (req, res, next) => {
    FireFighter.find({}, "number rank name", function(err, fire_fighter) {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (fire_fighter) {
            res.render('fire_fighter/list', {
                title: "firefighter list",
                fire_fighter: fire_fighter
            });
        } else {}

    })
};

exports.think = (req, res, next) => {
    FireFighter.aggregate()
        .unwind("$counts")
        .group({ _id: "$number", total: { $sum: "$counts.count" } })
        .exec(function(err, result) {
            if (err) {
                console.log(err)
            }
            if (result) {
                res.send(result);
            }
        })

    FireFighter.aggregate()
        .match({ 'aerial': true })
        .unwind('$counts')
        .group({ _id: "$name", seats: { $push: "$counts.seat" }, seat_counts: { $push: "$counts.count" } })
        .exec(function(err, seat_count) {
            if (err) {
                return next(err)
            }
            if (seat_count) {
                for (key in seat_count) {
                    for (i in key) {
                        console.log(seat_count[key].seats[5] + ":" + seat_count[key].seat_counts[5]);
                    }

                }
            }
        })
}
