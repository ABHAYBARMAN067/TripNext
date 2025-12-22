import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface BookingDocument extends Document {
  listing: mongoose.Types.ObjectId;
  guest: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
}

const bookingSchema = new Schema<BookingDocument>({
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure no overlapping bookings for the same listing
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });

const Booking: Model<BookingDocument> =
  mongoose.models.Booking || mongoose.model<BookingDocument>('Booking', bookingSchema);

export default Booking;


