var express = require('express');
var router = express.Router();

/* GET users listing. */

/* '/waiter/:uuid' */

router.get('/:uuid', function(req, res, next) {
  // res.send('respond with a resource');
    res.render('users', { title: 'WAITER-TEST' + req.params.uuid });

});

module.exports = router;
