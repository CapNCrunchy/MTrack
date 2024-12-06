import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home({ loggedIn }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn) {
            navigate("/dashboard");
        }
    });

    return (
        <div className="md:pt-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Welcome to MTrack
            </h1>
            <p className="text-base md:text-lg lg:text-xl">
                ### ADD SOME TEXT HERE ###
            </p>
            <hr className="my-6" />
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <p className="text-base md:text-lg lg:text-xl">
                    Ready to get started?
                </p>
                <a
                    href="/signup"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Sign Up
                </a>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:items-center mt-4">
                <p className="text-base md:text-lg lg:text-xl">
                    Already have an account?
                </p>
                <a
                    href="/login"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Sign In
                </a>
            </div>
        </div>
    );
}

export default Home;
