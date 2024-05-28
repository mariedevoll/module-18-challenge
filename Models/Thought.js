const { Schema, model, Types } = require("mongoose");
//const reactionSchema = require("./Reaction");
const dateFormat = require("../utils/dateFormat");

const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maclength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: timestamp => dateFormat(timestamp)
    },
    username: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        virtuals: true,
    },
    id: false
});

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: "must enter thought",
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat(timestamp)
        },
        username: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema],
    }, {
        toJSON: {
            virtuals: true,
            getters: true,
        }, id: false,
    }
);

ThoughtSchema.virtual("reactionCount").get(function(){
    return this.reactions.length;
})

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;