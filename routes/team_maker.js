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


/* GET request for one Player. */
router.get('/player/:id', player_controller.player_detail);

/* GET request for list of all Player. */
router.get('/players', player_controller.player_list);


/* GET request for list of all Player. */
router.get('/players_light', player_controller.player_list_no_img);

router.post('/players_team', player_controller.player_make_team);

router.post('/players_team_no_img', player_controller.player_make_team_no_img);

/* GET request to delete Player. */
router.get('/player/:id/delete', player_controller.player_delete_get);

// POST request to delete Player
router.post('/player/:id/delete', player_controller.player_delete_post);


/* GET request to delete Player. */
router.get('/player/:id/update', player_controller.player_update_get);

// POST request to delete Player
router.post('/player/:id/update', player_controller.player_update_post);

module.exports = router;