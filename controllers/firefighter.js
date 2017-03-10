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
        genDutyCounts: {
            flyerOneCount: req.body.flyerOneCount,
            flyerTwoCount: req.body.flyerTwoCount,
            flyerThreeCount: req.body.flyerThreeCount,
            runnerOneCount: req.body.runnerOneCount,
            runnerTwoCount: req.body.runnerTwoCount,
            runnerThreeCount: req.body.runnerThreeCount,
            rescuePumpThreeCount: req.body.rescuePumpThreeCount,
            spareCount: req.body.spareCount
        },
        driverCounts: {
            flyerDriverCount: req.body.flyerDriverCount,
            runnerDriverCount: req.body.runnerDriverCount,
            rescuePumpDriverCount: req.body.rescuePumpDriverCount
        },
        rescueCounts: {
            rescuePumpOneCount: req.body.rescuePumpOneCount,
            rescuePumpTwoCount: req.body.rescuePumpTwoCount,
            salvageDriverCount: req.body.salvageDriverCount,
            salvageOffsiderCount: req.body.salvageOffsiderCount
        },
        brontoCounts: {
            brontoDriverCount: req.body.brontoDriverCount,
            brontoOffsiderCount: req.body.brontoOffsiderCount
        }
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
}
