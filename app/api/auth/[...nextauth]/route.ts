// NextAuth route is deprecated - using custom JWT authentication
// This file is kept for backwards compatibility but is no longer used
// See /app/api/auth/login for authentication

export async function GET() {
	return new Response(
		"NextAuth is not configured. Use /api/auth/login instead.",
		{
			status: 405,
		},
	);
}

export async function POST() {
	return new Response(
		"NextAuth is not configured. Use /api/auth/login instead.",
		{
			status: 405,
		},
	);
}
