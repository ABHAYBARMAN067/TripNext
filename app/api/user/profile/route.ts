import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { requireAuth } from '../../../../lib/roles';

export async function GET(request) {
    try {
        await dbConnect();
        const user = await requireAuth();

        const userProfile = await User.findById(user.id)
            .select('-password -emailVerificationOTP -emailVerificationOTPExpires')
            .populate('wishlist', 'title images price location.address')
            .populate('recentlyViewed.listing', 'title images price location.address')
            .populate('savedSearches');

        return NextResponse.json(userProfile);
    } catch (error) {
        console.error('Get user profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const user = await requireAuth();
        const body = await request.json();

        const { name, bio } = body;

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            {
                name: name.trim(),
                bio: bio ? bio.trim() : '',
            },
            { new: true }
        ).select('-password -emailVerificationOTP -emailVerificationOTPExpires');

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Update user profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
