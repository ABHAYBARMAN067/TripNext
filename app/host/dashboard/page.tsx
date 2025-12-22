import HostDashboard from '../../../components/host/HostDashboard';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Host Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage your listings and bookings
                    </p>
                </div>
                <HostDashboard />
            </div>
        </div>
    );
}