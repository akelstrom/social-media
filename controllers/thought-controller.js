const { Thoughts, User }  = require('../models')

const thoughtController = {
    //get all thoughts
    getAllThought(req, res) {
        Thoughts.find([])
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .sort({_d: -1})
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //get one thought by id
    getThoughtbyId({ params }, res) {
        Thoughts.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
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

    //create thought and update user
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

    //update thought by id
    updateThoughtById({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id}, body, {new:true, runValidators:true })
        .then(deleteThoughtById => {
            if (!deleteThoughtById) {
              return res.status(404).json({ message: 'No Thought with this id!' });
            }
            return User.findOneAndUpdate(
              { _id: params.thoughtId },
              { $pull: { comments: params.thoughtId } },
              { new: true }
            );
          })
        .then(deleteThoughtById => {
            if(!deleteThoughtById) {
                res.status(404).json({ message: "No thought found with this id!" });
                return;
            }
            res.json(updateThoughtById);
        })
        .catch(err => res.json(err));
    },

    //delete thought by id
    deleteThoughtById({ params }, res) {
        Thought.findONeAndDelete({ _id:params.id })
        .then(deletedThought => {
            if(!DeletedThought) {
                res.status(404).json({ message: "No thought found with this id!" });
                return;
            }
            res.json(deleteThought);
        }) 
        .catch(err => res.json(err));
    },

    //add reaction to thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reaction: body } },
            { new: true }
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
        Thought.findOneAndUpdate(
            {_id: params.thoughtId },
            { $pull: { reaction: { reactionId: params.reaction.Id }}},
            { new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }
};



module.exports = thoughtController;