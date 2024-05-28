const connection = require('../config/connection');
const { User, Thought } = require('../Models');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');
    let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (userCheck.length) {
        await connection.dropCollection('users');
    }

    const users = [
        {
            username: "Shadow",
            email: "shadow@gmail.com"
        }, {
            username: "Lucille",
            email: "stinky@gmail.com"
        }, {
            username: "Marie",
            email: "marie@gmail.com"
        },
    ];

    const userData = await User.insertMany(users);

    console.info('seeding complete');
    process.exit(0);
});