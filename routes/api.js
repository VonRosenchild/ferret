var express = require('express');
var router = express.Router();
var series = require('../data/series');
var twitter = require('../data/twitter');

var dataMin = 50;

//TODO:fix for api prefix
router.get('/search', function(req, res){
  var term = req.query.q;
  var start = req.query.start;
  var end = req.query.end;
  if (!term){
    res.json({message: 'bad query'});
    res.end();
  }else{
    if (!start){
      start = Date.now();
    } else {
      start = Number(start);
    }

    if (!end){
      scale = 14*24*60*60*1000; 
      end = start - scale;
    } else {
      end = Number(end);
    }

    series.getSeriesFromSamples(term, start, end)
    .then(function(series){
      res.json(JSON.stringify(series));
      res.end();
    })
    .fail(function(reason){
      res.json({err: reason.message});
      res.end();
    });
  }
});

router.get('/select', function(req, res){
  var term = req.query.term;
  var time = req.query.time;
  twitter.getSampleAtTime(term, time)
  .then(function(tweets){
    res.json(JSON.stringify(tweets));
    res.end();
  });
});

/*
router.get('/select', function(req, res){
  var term = req.query.term;
  var start = req.query.start;
  var end = req.query.end;
  if(start && end){
    console.log('selecting');
    twitter.getAllTweets(term, new Date(start).getTime(), new Date(end).getTime(), function(err, tweets){
      res.json(JSON.stringify(tweets));
      res.end();
    });
  }else{
    res.json({message: 'bad query'});
    res.end();
  }
});
  */

module.exports = router;
