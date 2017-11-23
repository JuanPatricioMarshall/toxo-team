//var Author = require('../models/author');
var async = require('async');
//var Book = require('../models/book');
var Player = require('../models/player');

exports.index = function(req, res) {

    async.parallel({
        player_count: function(callback) {
            Player.count(callback);
        },
    }, function(err, results) {
        res.render('player_index', { title: 'Toxo-Team', error: err, data: results });
    });
};

exports.player_list = function(req, res, next) {

    Player.find()
        .sort([['name', 'ascending']])
        .exec(function (err, player_list) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('player_list', { title: 'Player List', player_list: player_list });
        });

};

// Display detail page for a specific Player
exports.player_detail = function(req, res, next) {

    async.parallel({
        player: function(callback) {
            Player.findById(req.params.id)
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('player_detail', { title: 'Player Detail', player: results.player});
    });

};

// Display Player create form on GET
exports.player_create_get = function(req, res, next) {
    res.render('player_form', { title: 'Create Player'});
};

// Handle Author create on POST
exports.player_create_post = function(req, res, next) {

    req.checkBody('first_name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('family_name', 'Family name must be specified.').notEmpty();
    req.checkBody('family_name', 'Family name must be alphanumeric text.').isAlpha();
//    req.checkBody('date_of_birth', 'Invalid date').optional({ checkFalsy: true }).isDate();
    req.checkBody('score', 'Score must be number').isNumeric();

    req.sanitize('first_name').escape();
    req.sanitize('family_name').escape();
    req.sanitize('first_name').trim();
    req.sanitize('family_name').trim();
    req.sanitize('nick').escape();
    req.sanitize('nick').trim();
    req.sanitize('score').toInt();
    req.sanitize('date_of_birth').toDate();

    var errors = req.validationErrors();

    var player = new Player(
        { first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            score : req.body.score,
            nick : req.body.nick
        });

    if (errors) {
        res.render('player_form', { title: 'Create Player', player: player, errors: errors});
        return;
    }
    else {
        // Data from form is valid

        player.save(function (err) {
            if (err) { return next(err); }
            //successful - redirect to new author record.
            res.redirect(player.url);
        });
    }

};
// Display Author delete form on GET
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};