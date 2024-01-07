import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  is_completed: {
    type: Boolean,
    default: false,
  },
  is_reviewed: {
    type: Boolean,
    default: false,
  },
  media_url: {
    type: String,
  },
});

const Report = mongoose.model('Report', reportSchema);

export default Report