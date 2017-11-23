var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PlayerSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        nick: {type: String, required: true},
        date_of_birth: {type: Date},
        score: {type: Number},
    }
);

// Virtual for player's full name
PlayerSchema
    .virtual('name')
    .get(function () {
        return this.family_name + " '" + this.nick +"' " + this.first_name;
    });

// Virtual for player's URL
PlayerSchema
    .virtual('url')
    .get(function () {
        return '/player/' + this._id;
    });

//Export model
module.exports = mongoose.model('Player', PlayerSchema);