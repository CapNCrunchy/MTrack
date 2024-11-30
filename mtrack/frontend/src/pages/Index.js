import { React } from "react";
import { SignOut, SignIn, UserPlus } from "@phosphor-icons/react";
import { Outlet, useNavigate } from "react-router-dom";

function Index({ loggedIn, setLoggedIn, api }) {
    const navigate = useNavigate();

    // handle user sign out
    const handleSignOut = () => {
        api.post("/api/logout", { withCredentials: true })
            .then(function (res) {
                if (res.status === 200) {
                    setLoggedIn(false);
                    navigate("/login");
                }
            })
            .catch(function (err) {
                console.error(err);
            });
    };

    return (
        <div className="mb-4">
            <div className="flex flex-row gap-2 justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-4xl font-bold">MTrack</h1>
                    <p className="text-xl font-light">
                        Your personal medication tracker
                    </p>
                </div>
                {loggedIn ? (
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 bg-red-700 p-2 rounded"
                    >
                        <SignOut size={24} />
                        <p className="hidden md:block">Sign Out</p>
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                window.location.href = "/login";
                            }}
                            className="flex items-center gap-2 bg-green-900 p-2 rounded"
                        >
                            <SignIn size={24} />
                            <p className="hidden md:block">Sign In</p>
                        </button>
                        <button
                            onClick={() => {
                                window.location.href = "/signup";
                            }}
                            className="flex items-center gap-2 bg-blue-900 p-2 rounded"
                        >
                            <UserPlus size={24} />
                            <p className="hidden md:block">Sign Up</p>
                        </button>
                    </div>
                )}
            </div>
            <hr className="border-t border-gray-700 w-full my-4" />
            <Outlet />
        </div>
    );
}

export default Index;
