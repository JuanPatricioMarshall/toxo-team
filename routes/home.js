var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home.pug', { title: 'tipit' });
});

module.exports = router;
