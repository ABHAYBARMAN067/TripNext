export const dynamic = 'force-dynamic';
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../../lib/db';
import Booking from '../../../models/Booking';
import Listing from '../../../models/Listing';
import { requireAuth } from '../../../lib/roles';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const user = await requireAuth();

        const bookings = await Booking.find({ guest: user.id })
            .populate('listing', 'title images location price')
            .sort({ createdAt: -1 });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const user = await requireAuth();
        const { listingId, checkIn, checkOut, guests } = await request.json();

        if (!listingId || !checkIn || !checkOut || !guests) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        if (guests > listing.maxGuests) {
            return NextResponse.json({ error: 'Too many guests' }, { status: 400 });
        }

        // Calculate total price
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * listing.price;

        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
            listing: listingId,
            $or: [
                { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
                { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
                { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } },
            ],
            status: { $ne: 'cancelled' },
        });

        if (conflictingBooking) {
            return NextResponse.json({ error: 'Dates not available' }, { status: 400 });
        }

        const booking = new Booking({
            listing: listingId,
            guest: user.id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests,
            totalPrice,
        });

        await booking.save();

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error('Create booking error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}