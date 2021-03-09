const { Thoughts, User }  = require('../models');

const thoughtController = {
    //get all thoughts api/thoughts
    getAllThoughts(req, res) {
        Thoughts.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: 1 })
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //get one thought by id api/thoughts/:thoughtId
    getThoughtbyId({ params }, res) {
        Thoughts.findOne({ _id: params.id })
        .populate({
            path: 'user',
            select: '-__v'
        })
        .select('-__v')
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                res.status(404).json({ message: "No thought found with this id!" });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
          });
    },

    //create thought api/thoughts-- needs username and thoughtText
    createThought({ body }, res) {
        Thoughts.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { username: body.username },
                { $push: {thoughts: _id }},
                { new: true }
            );
        } )
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => res.status(400).json(err));
    },

    //update thought by id api/thoughts/:thoughtId
    updateThoughtById({ params, body }, res) {
        Thoughts.findOneAndUpdate({ _id: params.id}, body, {new:true, runValidators:true })
        .then(updateThoughtById => {
            if(!updateThoughtById) {
                res.status(404).json({ message: "No thought found with this id!" });
                return;
            }
            res.json(updateThoughtById);
        })
        .catch(err => res.json(err));
    },

    //delete thought by id api/users/:userId
    deleteThoughtById({ params }, res) {
        Thoughts.findOneAndDelete({ _id:params.id })
        .then(deletedThought => {
            if(!DeletedThought) {
                res.status(404).json({ message: "No thought found with this id!" });
                return;
            }
            res.json(deletedThought);
        }) 
        .catch(err => res.json(err));
    },

    //add reaction to thought api/thoughts
    addReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No Thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
    },

    //remove reaction from thought
    removeReaction({ params }, res) {
        Thoughts.findOneAndUpdate(
            {_id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reaction.Id }}},
            { new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }
};



module.exports = thoughtController;