export const dynamic = 'force-dynamic';
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../../../lib/db';
import Review from '../../../../models/Review';
import { requireAuth } from '../../../../lib/roles';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        const user = await requireAuth();
        const { id } = await params;

        const review = await Review.findById(id);
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        // Only author can delete their review
        if (review.author.toString() !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await Review.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}