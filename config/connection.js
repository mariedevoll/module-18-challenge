// const mongoose = require("mongoose");


// mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialmedia", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// module.exports = mongoose.connection;

const {connect, connection} = require('mongoose');

const connectionString = 'mongodb://127.0.0.1:27017/socialmedia';
connect(connectionString);

module.exports = connection;