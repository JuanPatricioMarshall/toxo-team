//var Author = require('../models/author');
var async = require('async');
//var Book = require('../models/book');
var Player = require('../models/player');

exports.index = function (req, res) {

    async.parallel({
        player_count: function (callback) {
            Player.count(callback);
        },
    }, function (err, results) {
        res.render('player_index', {title: 'ToxoTeam', error: err, data: results});
    });
};

exports.player_list = function (req, res, next) {

    Player.find()
        .sort([['name', 'ascending']])
        .exec(function (err, player_list) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('player_list', {title: 'Player List', player_list: player_list});
        });

};

// Display detail page for a specific Player
exports.player_detail = function (req, res, next) {

    async.parallel({
        player: function (callback) {
            Player.findById(req.params.id)
                .exec(callback);
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        //Successful, so render
        res.render('player_detail', {title: 'Player Detail', player: results.player});
    });

};

// Display Player create form on GET
exports.player_create_get = function (req, res, next) {
    res.render('player_form', {title: 'Create Player'});
};

exports.player_make_team = function (req, res) {

    var players = req.body.players;

    if (players.length != 10) {
        res.render('team_error');
        return;
    }

    var team1 = [];
    var team2 = [];

    var score1 = 0;
    var score2 = 0;

    players = shuffle(players);

    for (var i = 0; i < 5; i++) {

        var playerI = JSON.parse(players.pop());
        var playerII = JSON.parse(players.pop());

        if(i === 0){
            team1.push(playerI);
            score1 = score1 + playerI.score;
            team2.push(playerII);
            score2 = score2 + playerII.score;

        }
        else{
            if(score1 >= score2){
                if (playerI.score > playerII.score){

                    team2.push(playerI);
                    score2 = score2 + playerI.score;

                    team1.push(playerII);
                    score1 = score1 + playerII.score;


                } else{
                    team2.push(playerII);
                    score2 = score2 + playerII.score;

                    team1.push(playerI);
                    score1 = score1 + playerI.score;
                }
            }
            else{
                if (playerI.score < playerII.score){

                    team2.push(playerI);
                    score2 = score2 + playerI.score;

                    team1.push(playerII);
                    score1 = score1 + playerII.score;


                } else{
                    team2.push(playerII);
                    score2 = score2 + playerII.score;

                    team1.push(playerI);
                    score1 = score1 + playerI.score;
                }
            }


        }
        //
        // if (playerI.score > playerII.score) {
        //     if (i % 2 === 0) {
        //         team1.push(playerI);
        //         team2.push(playerII);
        //     }
        //     else {
        //         team1.push(playerII);
        //         team2.push(playerI);
        //     }
        // }
        // else {
        //     if (i % 2 !== 0) {
        //         team1.push(playerI);
        //         team2.push(playerII);
        //     }
        //     else {
        //         team1.push(playerII);
        //         team2.push(playerI);
        //     }
        // }

    }

    res.render('player_teams', {title: 'Teams', team1: team1, team2: team2})

};

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


// Handle Author create on POST
exports.player_create_post = function (req, res, next) {

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
        {
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            score: req.body.score,
            nick: req.body.nick
        });

    if (errors) {
        res.render('player_form', {title: 'Create Player', player: player, errors: errors});
        return;
    }
    else {
        // Data from form is valid

        player.save(function (err) {
            if (err) {
                return next(err);
            }
            //successful - redirect to new author record.
            res.redirect(player.url);
        });
    }

};


// Display Player delete form on GET
exports.player_delete_get = function (req, res, next) {

    async.parallel({
        player: function (callback) {
            Player.findById(req.params.id).exec(callback);
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        //Successful, so render
        res.render('player_delete', {title: 'Delete Player', player: results.player});
    });

};
// Handle Player delete on POST
exports.player_delete_post = function (req, res, next) {

    req.checkBody('playerid', 'Player id must exist').notEmpty();

    async.parallel({
        player: function (callback) {
            Player.findById(req.body.playerid).exec(callback);
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        //Success
        //Author has no books. Delete object and redirect to the list of authors.
        Player.findByIdAndRemove(req.body.playerid, function deletePlayer(err) {
            if (err) {
                return next(err);
            }
            //Success - got to author list
            res.redirect('/players');
        });

    });

};


// Display Player update form on GET
exports.player_update_get = function (req, res) {

    req.sanitize('id').escape();
    req.sanitize('id').trim();

    //Get book, authors and genres for form
    async.parallel({
        players: function (callback) {
            Player.find(callback);
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }


        res.render('player_form', {title: 'Update Player', players: results.players});
    });

};

// Handle Player update on POST
exports.player_update_post = function (req, res) {

    req.checkBody('first_name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('family_name', 'Family name must be specified.').notEmpty();
    req.checkBody('family_name', 'Family name must be alphanumeric text.').isAlpha();
    req.checkBody('score', 'Score must be number').isNumeric();

    req.sanitize('first_name').escape();
    req.sanitize('family_name').escape();
    req.sanitize('first_name').trim();
    req.sanitize('family_name').trim();
    req.sanitize('nick').escape();
    req.sanitize('nick').trim();
    req.sanitize('score').toInt();
    req.sanitize('date_of_birth').toDate();

    //Sanitize id passed in.
    req.sanitize('id').escape();
    req.sanitize('id').trim();

    //Check other data

    var player = new Player(
        {
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            score: req.body.score,
            nick: req.body.nick
        });


    // Data from form is valid. Update the record.
    Player.findByIdAndUpdate(req.params.id, player, {}, function (err, player) {
        if (err) {
            return next(err);
        }
        //successful - redirect to book detail page.
        res.redirect(player.url);
    });

};
