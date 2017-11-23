var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema(
    {
        name: {type: String, required: true, max: 100, min: 3},

    }
);

// Virtual for author's full name
//GenreSchema
//    .virtual('name')
//    .get(function () {
//        return this.family_name + ', ' + this.first_name;
//    });

// Virtual for author's URL
GenreSchema
    .virtual('url')
    .get(function () {
        return '/catalog/genre/' + this.name;
    });

//Export model
module.exports = mongoose.model('Genre', GenreSchema);