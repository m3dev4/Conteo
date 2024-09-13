import mongoose from 'mongoose';

const ObjectId = new mongoose.Schema;

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  category: {
    type: ObjectId,
    ref: 'Category',
    required: true,
  },
  status: {
    type: String,
    enum: ['en cours', 'terminée'],
    default: 'en cours',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChapterSchema = new mongoose.Schema({
  story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Story = mongoose.model('Story', StorySchema);
const Chapter = mongoose.model('Chapter', ChapterSchema);

export { Story, Chapter };
