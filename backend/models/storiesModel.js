import mongoose from 'mongoose';

// Utilisation correcte de mongoose.Schema.Types.ObjectId
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
    type: mongoose.Schema.Types.ObjectId, // Correction ici
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

const PageSchema = new mongoose.Schema({
  pageNumber: { type: Number, required: true },
  content: { type: String, required: true },
});

const ChapterSchema = new mongoose.Schema({
  story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
  pages: [PageSchema],
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Story = mongoose.model('Story', StorySchema);
const Chapter = mongoose.model('Chapter', ChapterSchema);

export { Story, Chapter };
