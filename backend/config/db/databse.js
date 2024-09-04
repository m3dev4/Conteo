import mongoose from 'mongoose';

const ConnectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB👌');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default ConnectDb;
