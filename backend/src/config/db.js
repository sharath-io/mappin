import mongoose from "mongoose";

export const connectDB = async () => {
  console.log("🔌 Connection state:", mongoose.connection.readyState);
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb connected successfully");
  } catch (error) {
    console.error("error occured while connecting DB :", error);
    process.exit(1); // 1 is exit with failure, 0 is success
  }
};
