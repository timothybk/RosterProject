
//old js for scorecard
//overly complicated and used the old mongoose schema
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

//old attempts to extract data from mongo
//might still be useful
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
        .group({ _id: "$number", name: { $push: "$name" }, pump: { $push: "$counts.pump" }, seats: { $push: "$counts.seat" }, seat_counts: { $push: "$counts.count" } })
        .exec(function(err, seat_count) {
            if (err) {
                return next(err)
            }
            if (seat_count) {
                for (var i = seat_count.length - 1; i >= 0; i--) {
                    for (var j = seat_count[i].seats.length - 1; j >= 0; j--) {
                        //console.log(seat_count[i].seat_counts[j] * 3)
                        console.log(seat_count[i].name[j]+ " " + seat_count[i].pump[j] + " " + seat_count[i].seats[j] + " : " + seat_count[i].seat_counts[j])
                    }
                }
            }
        })

    

        
