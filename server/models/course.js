const mongoose = require('mongoose');

// Define the schema for a video
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Video title is required']
    },
    url: {
        type: String,
        required: [true, 'Video URL is required'],
        // match: [/^https?:\/\/.+\.(mp4|webm|ogv)$/, 'Invalid URL format'] // Regex to validate URL format
    },
    duration: {
        type: Number,
        required: [true, 'Video duration is required'],
        min: [0, 'Duration must be a positive number']
    }
});

// Define the schema for a topic in the curriculum
const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Topic title is required']
    },
    description: {
        type: String
    },
    videos: {
        type: [videoSchema],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'Each topic must have at least one video'
        }
    }
});

// Define the schema for a review
const reviewSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, 'Review user is required']
    },
    rating: {
        type: Number,
        min: [0, 'Rating must be between 0 and 5'],
        max: [5, 'Rating must be between 0 and 5'],
        required: [true, 'Rating is required']
    },
    comment: {
        type: String
    }
});

// Define the schema for a course
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        minlength: [5, 'Title must be at least 5 characters long']
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        minlength: [5, 'Description must be at least 20 characters long']
    },
    thumbnailUrl: {
        type: String,
        required: [true, 'Thumbnail URL is required'],
        // match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, 'Invalid URL format for thumbnail']
    },
    curriculum: {
        type: [topicSchema],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'Course must have at least one topic in the curriculum'
        }
    },
    reviews: [reviewSchema],
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Course author is required']
    }
    
});

// Export the model
module.exports = mongoose.model('Course', courseSchema);
