import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface ReviewDocument extends Document {
	rating: number;
	comment: string;
	listing: mongoose.Types.ObjectId;
	author: mongoose.Types.ObjectId;
	createdAt: Date;
}

const reviewSchema = new Schema<ReviewDocument>({
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	comment: {
		type: String,
		required: true,
		trim: true,
	},
	listing: {
		type: Schema.Types.ObjectId,
		ref: "Listing",
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Ensure one review per user per listing
reviewSchema.index({ listing: 1, author: 1 }, { unique: true });

const Review: Model<ReviewDocument> =
	mongoose.models.Review ||
	mongoose.model<ReviewDocument>("Review", reviewSchema);

export default Review;
