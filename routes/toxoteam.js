var express = require('express');
var router = express.Router();

// Require controller modules
var player_controller = require('../controllers/playerController');

/* GET catalog home page. */
router.get('/', player_controller.index);


/// PLAYER ROUTES ///

/* GET request for creating Player. NOTE This must come before route for id (i.e. display author) */
router.get('/player/create', player_controller.player_create_get);

/* POST request for creating Player. */
router.post('/player/create', player_controller.player_create_post);


/* GET request for one Author. */
router.get('/player/:id', player_controller.player_detail);

/* GET request for list of all Authors. */
router.get('/players', player_controller.player_list);


module.exports = router;