import mongoose, { Schema, type Document, type Model } from 'mongoose';

interface Location {
  type: 'Point';
  coordinates: [number, number];
  address: string;
}

interface Image {
  url?: string;
  public_id?: string;
}

export interface ListingDocument extends Document {
  title: string;
  description: string;
  location: Location;
  images: Image[];
  price: number;
  maxGuests: number;
  amenities: string[];
  instantBook: boolean;
  host: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<ListingDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  amenities: [String],
  instantBook: {
    type: Boolean,
    default: false,
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for geospatial queries
listingSchema.index({ location: '2dsphere' });

// Update updatedAt on save
listingSchema.pre('save', function () {
  this.updatedAt = new Date();
});

const Listing: Model<ListingDocument> =
  mongoose.models.Listing || mongoose.model<ListingDocument>('Listing', listingSchema);

export default Listing;


