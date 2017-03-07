const async = require('async');
const FireFighter = require('../models/FireFighter.js');

/**
 * GET /
 * Scorecard
 */
exports.scorecard = (req, res, next) => {
  console.log(req.params.ffid);

  // const fire_fighter = new FireFighter({
  //   number: 123,
  //   rank: 'Ball fighter'
  // });
  // fire_fighter.save((err) => {
  //   if (err) {
  //     console.log('balls error');
  //     return next(err);
  //   }

  // });

  FireFighter.findOne({ number: req.params.ffid }, (err, fire_fighter) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (fire_fighter) {
      req.flash('success', { msg: 'Found one fuckers' });
      res.render('scorecard', {
        title: 'Scorecard of amazing',
        fire_fighter: fire_fighter
      });
    }
    else
    {
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
    number: 124,
    rank: req.body.rank
  });
  fire_fighter.save((err) => {
    if (err) {
      console.log('balls error');
      return next(err);
    }

    req.flash('success', { msg: 'YEAH fuckers' });
    res.redirect('/firefighter/add');

  });

  
};