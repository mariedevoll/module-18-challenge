const { User, Thought } = require('../Models');

module.exports = {

//get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find()
            res.json(thoughts);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

//get a thought
    async getAThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }) //populating username
            if(!thought) {
                return res.status(404).json({ message: 'there is no thought with that id'});
            }
            res.json(thought);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

//create a thought
    async createThought(req, res) {
        try {
            const newThought = await Thought.create(req.body);
            await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: {thoughts: newThought._id} },
                { new: true }
            );
            res.json(newThought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

//delete a thought
    async deleteThought(req, res) {
        try {
            const terminateThought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
            await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: {thoughts: newThought._id} },
                { new: true }
            );
            if (!terminateThought) {
                return res.status(404).json({ message: 'no thought with that id'});
            }
            res.json({message: 'thought deleted'});
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

//update a thought
    async updateThought(req, res) {
        try {
            const changeThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!changeThought) {
                return res.status(404).json({ message: 'no thought with this id'});
            }
            res.json(changeThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

//create a reaction
    async createReaction(req, res) {
        try {
            const newReaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: {reactions: req.body} },
                { runValidators: true, new: true }
            );
            res.json(newReaction);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

//delete a reaction
    async deleteReaction(req, res) {
        try {
            const terminateReaction = await Thought.findByIdAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: {reactions: { reactionId: req.params.reactionId} } },
                { runValidators: true, new: true }
            );
            if (!terminateReaction) {
                return res.status(400).json({ message: 'no reaction with that id'});
            }
            res.json({ message: 'reaction deleted'});
        } catch (err) {
            res.status(500).json(err);
        }
    },
};
