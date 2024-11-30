import React, { useState } from "react";
import PropTypes from "prop-types";
import { DotsThree } from "@phosphor-icons/react";

const MedicationContainer = ({ medication_ID }) => {
    // change bg color based on taken status
    const getBackgroundColor = () => {
        if (takenToday) {
            return "bg-green-700";
        } else if (skipToday) {
            return "bg-amber-700";
        } else if (!takenToday) {
            return "bg-red-700";
        }
    };

    // change content based on taken status
    const getTakenStatus = () => {
        if (takenToday) {
            return <p className="text-white">Taken today</p>;
        } else if (skipToday) {
            return <p className="text-white">Skipped today</p>;
        } else {
            return (
                <button
                    className="text-white text-left underline hover:text-neutral-300 transition-all"
                    onClick={() => setTakenToday(true)}
                >
                    Mark as taken
                </button>
            );
        }
    };

    // hamburger menu for more options
    const [showMenu, setShowMenu] = useState(false);

    const [takenToday, setTakenToday] = useState(false);
    const [skipToday, setSkipToday] = useState(false);

    return (
        <div
            className={`relative flex flex-col justify-between p-4 rounded-lg shadow-md w-fit text-left justify-self-center ${getBackgroundColor()}`}
        >
            <div className="flex flex-row justify-between gap-2">
                <p className="text-sm font-light">09:00 AM</p>
                <p className="text-sm font-light">2 pills</p>
            </div>

            <p className="text-xl leading-tight font-medium">
                Medication Title
            </p>

            <hr className="my-2 border-t border-gray-300 w-full" />
            <div className="flex flex-row justify-between">
                {getTakenStatus()}
                <button
                    className="hover:text-neutral-300 transition-all"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <DotsThree size={24} weight="bold" />
                </button>
            </div>

            {showMenu && (
                <div className="absolute left-full bottom-0 bg-zinc-800 bg-opacity-80 backdrop-blur-sm p-2 px-4 rounded-lg text-left text-sm z-10 text-nowrap flex flex-col items-start">
                    <button
                        className="hover:text-gray-300 transition-all"
                        onClick={() => setTakenToday(!takenToday)}
                    >
                        {takenToday ? "Mark not taken" : "Mark taken"}
                    </button>
                    <hr className="my-1 border-t border-gray-500 w-full" />
                    <button
                        className="hover:text-gray-300 transition-all"
                        onClick={() => setSkipToday(!skipToday)}
                    >
                        {skipToday ? "Unskip" : "Skip"}
                    </button>
                    <hr className="my-1 border-t border-gray-500 w-full" />
                    <button
                        className="text-red-500 hover:text-red-300 transition-all"
                        onClick={() => setShowMenu(false)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

MedicationContainer.propTypes = {
    medication_ID: PropTypes.number.isRequired,
};

export default MedicationContainer;
