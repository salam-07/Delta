import { useAuthStore } from "../store/useAuthStore";

import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";

const HomePage = () => {
    const { isAdmin, authUser } = useAuthStore();

    return (
        <div className="pt-16">
            <div className="max-w-6xl mx-auto">
                {/* Welcome Section */}
            </div>

            {/* Admin Content */}
            {isAdmin ? (
                <AdminDashboard />
            ) : (
                /* User Content */
                <UserDashboard />
            )}
        </div>
    );
};

export default HomePage;