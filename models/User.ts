import bcrypt from "bcryptjs";
import mongoose, { type Document, type Model, Schema } from "mongoose";

interface SavedSearchFilters {
	search?: string;
	minPrice?: number;
	maxPrice?: number;
	amenities?: string[];
	minRating?: number;
	instantBook?: boolean;
	location?: string;
	lat?: number;
	lng?: number;
	radius?: number;
}

interface SavedSearch {
	_id?: mongoose.Types.ObjectId;
	name: string;
	filters: SavedSearchFilters;
	createdAt: Date;
}

interface RecentlyViewed {
	listing: mongoose.Types.ObjectId;
	viewedAt: Date;
}

export interface UserDocument extends Document {
	name: string;
	email: string;
	password: string;
	role: "guest" | "host";
	avatar?: string;
	emailVerified: boolean;
	emailVerificationOTP?: string;
	emailVerificationOTPExpires?: Date;
	bio?: string;
	savedSearches: SavedSearch[];
	wishlist: mongoose.Types.ObjectId[];
	recentlyViewed: RecentlyViewed[];
	createdAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["guest", "host"],
		default: "guest",
	},
	avatar: {
		type: String,
	},
	emailVerified: {
		type: Boolean,
		default: false,
	},
	emailVerificationOTP: {
		type: String,
	},
	emailVerificationOTPExpires: {
		type: Date,
	},
	bio: {
		type: String,
		maxlength: 500,
	},
	savedSearches: [
		{
			name: {
				type: String,
				required: true,
			},
			filters: {
				search: String,
				minPrice: Number,
				maxPrice: Number,
				amenities: [String],
				minRating: Number,
				instantBook: Boolean,
				location: String,
				lat: Number,
				lng: Number,
				radius: Number,
			},
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	wishlist: [
		{
			type: Schema.Types.ObjectId,
			ref: "Listing",
		},
	],
	recentlyViewed: [
		{
			listing: {
				type: Schema.Types.ObjectId,
				ref: "Listing",
			},
			viewedAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

userSchema.pre<UserDocument>("save", async function () {
	if (!this.isModified("password")) return;

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
	candidatePassword: string,
) {
	return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<UserDocument> =
	mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export default User;
