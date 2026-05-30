export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth-config';
import dbConnect from '../../../../lib/db';
import Booking from '../../../../models/Booking';
import Listing from '../../../../models/Listing';

export async function GET(request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'host') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 0;

        // Get host's listings first
        const listings = await Listing.find({ host: session.user.id });
        const listingIds = listings.map(listing => listing._id);

        // Get bookings for host's listings
        const bookings = await Booking.find({ listing: { $in: listingIds } })
            .populate('listing', 'title')
            .populate('guest', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit || 0);

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Host bookings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
