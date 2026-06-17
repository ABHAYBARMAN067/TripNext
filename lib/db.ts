import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

function _getMongoUriOrThrow() {
	if (!MONGO_URI) {
		throw new Error(
			"MONGO_URI or MONGODB_URI is required. Set it in .env (or GitHub Secrets).",
		);
	}
	return MONGO_URI;
}

/**

 * Reusable Mongoose connection helper.
 * Ensures we only create a single connection across hot reloads in dev.
 */
async function dbConnect(): Promise<typeof mongoose> {
	if (mongoose.connection.readyState >= 1) {
		return mongoose;
	}

	return mongoose.connect(MONGO_URI, {
		bufferCommands: false,
	});
}

export default dbConnect;
