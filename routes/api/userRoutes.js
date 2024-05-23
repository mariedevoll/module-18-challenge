const router = require('express').Router();

const { getUsers, getSingleUser, createUser, deleteUser, addFriend, removeFriend, } = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);

router.route('/:userId').get(getSingleUser).delete(deleteUser);

router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;