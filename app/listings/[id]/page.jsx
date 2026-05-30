import { notFound } from 'next/navigation';
import ListingDetail from '../../../components/listings/ListingDetail';

async function getListing(id) {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/listings/${id}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (error) {
        return null;
    }
}

export default async function ListingPage({ params }) {
    const { id } = await params;
    const listing = await getListing(id);

    if (!listing) {
        notFound();
    }

    return <ListingDetail listing={listing} />;
}
