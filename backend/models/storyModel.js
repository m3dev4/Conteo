import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Référence à la collection User
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Précise que c'est un ObjectId
      ref: 'Category', // Référence à la collection Category
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model('Story', storySchema);

export default Story;
