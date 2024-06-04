const { User, Thought } = require('../Models');

module.exports = {

//get all users
    async getUsers(req, res) {
        try{
            const users = await User.find().populate('thoughts');
            console.log(users);
            return res.json(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

//get a single user
    async getSingleUser(req, res) {
        try{
            const user = await User.findOne({ _id: req.params.id }).populate('thoughts');
            if(!user) {
                return res.status(404).json({ message: 'no user has that id'});
            }
            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

//create a new user
    async createUser(req, res) {
        try{
            const newUser = await User.create(req.body);
            res.json(newUser);
        } catch (err) {
            console.log("error: ", err)
            res.status(500).json(err);
        }
    },
    
    // update exisitng user
    async updateUser(req, res) {
        // we need to find the current USER by the params.id
        // we also need the DATA to be updated sent in the req.body 
        try {
            const currentUser = await User.findOneAndUpdate(
                                            {  _id: req.params.id }, 
                                            { $set: req.body },
                                            { 
                                                runValidators: true,
                                                new: true
                                            }
                                        );
            
            if(!currentUser) {
                return res.status(404).json({ msg: "No user with that id"})
            }

            res.status(203).json(currentUser);
        } catch(err) {
            console.log("error: ", err);
            res.status(500).json(err);
        }
    },

//delete a user and their thoughts
    async deleteUser(req, res) {
        try{
            const terminateUser = await User.findOneAndRemove({ _id: req.params.id });
            if (!terminateUser) {
                return res.status(404).json({ message: 'no such user exists'});
            }
            console.log("User: ", terminateUser)
//calling thoughts so they can also be deleted with the user
          /*  const thought = await Thought.deleteMany(
                { userId: req.params.id },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );
            */
           const thought = await Thought.deleteMany({ _id: { $in: terminateUser.thoughts }})
           console.log("Removed Associated Thoughts: ", thought)
            if (!thought) {
                return res.status(404).json({ message: 'user deleted, but they have no thoughts assicated'});
            }
            res.json({ message: 'user and their thoughts successfully deleted'});
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

//add a friend
    async addFriend(req, res) {
        try{
            const newFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );
            if (!newFriend) {
                return res.status(404).json({message: 'no user found with that id'});
            }
            res.json(newFriend);
        } catch (err) {
            res.status(500).json(err);
        }
    },

//remove a friend
    async removeFriend(req, res) {
        try{
            const terminateFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );
            if (!terminateFriend) {
                return res.status(404).json({message: 'no usre found with that id'});
            }
            res.json(terminateFriend);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};