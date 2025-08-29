import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, ChartNoAxesCombined, Settings, User } from "lucide-react";

const Navbar = () => {
    const { logout, authUser } = useAuthStore();

    return (
        <header
            className="fixed w-full top-0 z-40 bg-black/70 backdrop-blur-md">
            <div className="container mx-auto px-4 h-12">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <ChartNoAxesCombined className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">Delta</h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        {authUser && (
                            <>
                                <button className="flex gap-2 items-center" onClick={logout}>
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Navbar;