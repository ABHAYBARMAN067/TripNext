import { notFound } from "next/navigation";
import ListingDetail from "../../../components/listings/ListingDetail";

export const dynamic = "force-dynamic";

async function getListing(id) {
	try {
		const res = await fetch(
			`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/listings/${id}`,
			{
				cache: "no-store",
			},
		);

		if (!res.ok) {
			return null;
		}

		return res.json();
	} catch (_error) {
		return null;
	}
}

export default async function ListingPage({ params }) {
	const { id } = params;

	const listing = await getListing(id);

	if (!listing) {
		notFound();
	}

	return <ListingDetail listing={listing} />;
}
