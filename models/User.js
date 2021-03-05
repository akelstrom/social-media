const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: 'Username is required'
    },
    email: {
        type: String,
        trim: true,
        required: 'Email is required',
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address.']
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        //referencing same model
        ref: 'Users'
    }]
});

const User = model('User', UserSchema)

module.exports =  User;