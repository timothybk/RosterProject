const async = require('async');
const FireFighter = require('../models/FireFighter.js');

/**
 * GET /
 * Scorecard
 */
exports.scorecard = (req, res, next) => {
    console.log(req.params.ffid);
    const ffid = parseInt(req.params.ffid);
    FireFighter.aggregate()
        .match({ number: ffid })
        .unwind('$counts')
        .group({ _id: { pump: "$counts.pump", seat: "$counts.seat" }, total: { $sum: '$counts.count' } })
        .group({ _id: { pump: "$_id.pump" }, seats: { $addToSet: { seat: "$_id.seat", total: "$total" } } })
        .unwind("$seats")
        .sort({ _id: -1, seats: 1 })
        .group({ _id: { pump: "$_id.pump" }, seats: { $push: "$seats" } })
        .exec(function(err, ffid_seat) {
            if (err) {
                return next(err)
            }
            if (ffid_seat) {
                console.log(ffid_seat)

                function render(ffid_total, all_seat, all_total, ffid_object) {
                    res.render('fire_fighter/scorecard', {
                        title: "firefighter scorecard",
                        ffid_total: ffid_total,
                        ffid_seat: ffid_seat,
                        all_seat: all_seat,
                        all_total: all_total,
                        ffid_object: ffid_object
                    });
                }


            }

            FireFighter.aggregate()
                .match({ number: ffid })
                .unwind('$counts')
                .group({ _id: null, total: { $sum: "$counts.count" }, avg: { $avg: "$counts.count" } })
                .exec(function(err, ffid_total_count) {
                    if (err) {
                        return next(err)
                    }
                    if (ffid_total_count) {
                        var ffid_total = ffid_total_count[0]

                        FireFighter.aggregate()
                            .unwind('$counts')
                            .group({ _id: { pump: "$counts.pump", seat: "$counts.seat" }, total: { $sum: '$counts.count' } })
                            .group({ _id: { pump: "$_id.pump" }, seats: { $addToSet: { seat: "$_id.seat", total: "$total" } } })
                            .unwind("$seats")
                            .sort({ _id: -1, seats: 1 })
                            .group({ _id: { pump: "$_id.pump" }, seats: { $push: "$seats" } })
                            .exec(function(err, all_seat_count) {
                                if (err) {
                                    return next(err)
                                }
                                if (all_seat_count) {
                                    var all_seat = all_seat_count
                                }

                                FireFighter.aggregate()
                                    .unwind('$counts')
                                    .group({ _id: null, total: { $sum: "$counts.count" }, avg: { $avg: "$counts.count" } })
                                    .exec(function(err, all_total_count) {
                                        if (err) {
                                            return next(err)
                                        }
                                        if (all_total_count) {
                                            var all_total = all_total_count[0]

                                            FireFighter
                                                .find({})
                                                .where('number').equals(req.params.ffid)
                                                .lean()
                                                .exec(function(err, ffid_full) {
                                                    if (err) {
                                                        return next(err)
                                                    }
                                                    if (ffid_full) {
                                                        var ffid_object = ffid_full[0];
                                                        render(ffid_total, all_seat, all_total, ffid_object);
                                                    }
                                                })

                                            
                                        }
                                    })



                            })

                    }
                })



        })
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
        .unwind('$counts')
        .group({ _id: { pump: "$counts.pump", seat: "$counts.seat" }, total: { $sum: '$counts.count' } })
        .group({ _id: { pump: "$_id.pump" }, seats: { $addToSet: { seat: "$_id.seat", total: "$total" } } })
        .unwind("$seats")
        .sort({ _id: -1, seats: 1 })
        .group({ _id: { pump: "$_id.pump" }, seats: { $push: "$seats" } })
        .exec(function(err, seat_count) {
            if (err) {
                return next(err)
            }
            if (seat_count) {
                console.log(seat_count)

                function render(count_total) {
                    res.render('fire_fighter/think', {
                        title: "firefighter think",
                        count_total: count_total,
                        seat_count: seat_count

                    });
                }


            }

            FireFighter.aggregate()
                .unwind('$counts')
                .group({ _id: null, total: { $sum: "$counts.count" }, avg: { $avg: "$counts.count" } })
                .exec(function(err, total_count) {
                    if (err) {
                        return next(err)
                    }
                    if (total_count) {
                        var count_total = total_count[0].total
                        render(count_total);
                    }
                })



        })

}
