var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listGroupSchema = new Schema({
    name: {type: String, required: true, unique: true},
    groups: [{
        title: {type: String, required: true},
        items: [{
            text: {type: String, required: true},
            checked: Boolean,
        }]
    }]
});

module.exports = mongoose.model('listGroup', listGroupSchema);