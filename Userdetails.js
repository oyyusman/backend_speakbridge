const mongoose = require('mongoose');
const UserDetailSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    email: {
        type: String,

        unique: true
    },
    password: {
        type: String,

    },
    image: {
        type: String

    },
    freindRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    sentFriendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

}, {
    collection: 'UserDetails'
});
mongoose.model('UserDetails', UserDetailSchema);