const { Schema, model} = require('mongoose');
const { format } = require('date-fns');
const ReactionSchema = require('./Reaction');

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        minLength: 1,
        maxLength: 280,
        required: 'Text is required'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (value)=> {
            return format(value, 'Pp');
        }
    },
    reactions: [ReactionSchema]
});

const Thought = model('Thought', ThoughtSchema)

module.exports = Thought;