const router = require("express").Router();
const { User, Thought } = require("../../Models");
const { findOneAndDelete } = require("../../Models/User");

//get all users
//.find
router.get("/", async (req,res) => {
    try {
        const dbUserData = await User.find().select("-__v");
        res.status(200).json(dbUserData);
    } catch(err) {
        res.status(500).json(err);
    }
});

//create a new user
//.create
router.post("/", async (req,res) => {
    try {
        const dbUserData = await User.create(req.body);
        res.status(200).json(dbUserData);
    } catch(err) {
        res.status(500).json(err);
    }
});

//api/users/:userId
//calling a user?
//.findOne, .populate, .select
router.get("/:userId", async (req, res) => {
    try {
        const dbUserData = await User.findOne({_id: req.params.userUd})
        .select("-__v")
        .populate("friends").populate("thoughts");
        if(!dbUserData){
            return res.status(404).json({message: "Oops! No user with this ID"});
        }
        res.status(200).json(dbUserData);
    } catch(err) {
        res.status(500).json(err);
    }
});

//updating a user
//.findOneAndUpdate
router.put("/:userId", async (req, res) => {
    try {
        const dbUserData = await User.findOneAndUpdate(
            {
                _id: req.params.userId,
            }, {
                $set: req.body,
            }, {
                runValidators: true,
                new: true,
            }
        );
        if(!dbUserData) {
            return res.status(404).json({message: "Oops! No user with this ID!"});
        }
        res.status(200).json(dbUserData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//deleting a user
//.findOneAndDelete, .deleteMany
router.delete("/:userId", async (req, res) => {
    try {
        const dbUserData = await User.findOneAndDelete({_id: req.params.userId});
        if(!dbUserData) {
            return res.status(404).json({message: "Oops! No user with this ID!"});
        }
        await Thought.deleteMany({_id: {$in: dbUserData.thoughts}});
        res.status(200).json({message: "User and their thoughts have been deleted"});
    } catch (err) {
        res.status(500).json(err);
    }
});


//api/users/:userId/friends/:friendId

router.post("/:userId/friends/:friendId", async (req, res) => {
    try{
        const dbUserData = User.findOneAndUpdate(
            {_id: req.params.userId},
            {$addToSet: {friends: req.params.friendId},},
            {new: true,}
        );
        if(!dbUserData) {
            return res.status(404).json({message: "No user with this ID!"});
        }
        res.status(200).json(dbUserData);
    } catch (err) {}
});


router.delete("/:userId/friends/:friendId", async (req, res) => {
    try {
        const dbUserData = User.findOneAndDelete(
            {_id: req.params.userId}, {$pull: {friends: req.params.friendId},},
            {new: true,}
            );
            if(!dbUserData) {
                return res.status(404).json({message: "No user with this ID!"});
            }
            res.status(200).json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
});


module.exports = router;