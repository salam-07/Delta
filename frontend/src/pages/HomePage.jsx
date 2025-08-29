import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
    const { isAdmin, authUser } = useAuthStore();

    return (
        <div className="pt-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {authUser?.fullName}!
                    </h1>
                    <p className="text-gray-400">
                        {isAdmin ? "Admin Dashboard" : "Trading Dashboard"}
                    </p>
                </div>

                {/* Admin Content */}
                {isAdmin ? (
                    <div className="space-y-6">
                        ADMIN
                    </div>
                ) : (
                    /* User Content */
                    <div className="space-y-6">
                        TRADER
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;