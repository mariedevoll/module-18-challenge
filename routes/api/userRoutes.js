const { User } = require("../../Models");

const router = require("express").Router();

router.get("/", (req,res) => {
    User.find().select("-__v")
})

router.post("/", async (req,res) => {
    try {
        const dbUserData = await User.create(req.body);
        res.status(200).json(dbUserData);
    } catch(err) {
        res.status(500).json(err)
    }
})

module.exports = router;