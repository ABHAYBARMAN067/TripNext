import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
	throw new Error(
		"Please define the MONGO_URI or MONGODB_URI environment variable inside .env",
	);
}

/**
 * Reusable Mongoose connection helper.
 * Ensures we only create a single connection across hot reloads in dev.
 */
async function dbConnect(): Promise<typeof mongoose> {
	if (mongoose.connection.readyState >= 1) {
		return mongoose;
	}

	return mongoose.connect(MONGO_URI!, {
		bufferCommands: false,
	});
}

export default dbConnect;
