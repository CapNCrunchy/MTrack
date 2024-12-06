import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "@phosphor-icons/react";

function getCSRFToken() {
    const name = "csrftoken";
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
}

function AddMedication({ api, setAddMedicationVisible }) {
    const [medicationName, setMedicationName] = useState("");
    const [medicationForm, setMedicationForm] = useState("");
    const [medicationStrength, setMedicationStrength] = useState("");
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([""]);

    const navigate = useNavigate();

    const handleAddMedication = (e) => {
        e.preventDefault();

        const formData = {
            name: medicationName,
            form: medicationForm,
            strength: medicationStrength,
            days: selectedDays,
            times: selectedTimes,
        };

        const csrfToken = getCSRFToken();
        try {
            api.post("/api/medications", formData, {
                headers: {
                    "X-CSRFToken": csrfToken, // Include token here
                },
            });
            setAddMedicationVisible(false);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Error: " + err.response?.data?.error || "An error occurred");
        }
    };

    // function to toggle the selected days
    const toggleDay = (day) => {
        setSelectedDays((prevDays) =>
            prevDays.includes(day)
                ? prevDays.filter((d) => d !== day)
                : [...prevDays, day]
        );
    };

    const addTime = () => {
        setSelectedTimes((prevTimes) => [...prevTimes, ""]);
    };

    const removeTime = (index) => {
        setSelectedTimes((prevTimes) =>
            prevTimes.filter((time, i) => i !== index)
        );
    };

    const handleTimeChange = (e, index) => {
        const newTimes = [...selectedTimes];
        newTimes[index] = e.target.value;
        setSelectedTimes(newTimes);
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
            <div className="bg-zinc-800 p-4 rounded-lg w-full md:w-1/2 lg:w-1/3">
                <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-bold">Add Medication</h2>
                    <button onClick={() => setAddMedicationVisible(false)}>
                        <X size={24} />
                    </button>
                </div>

                <form
                    onSubmit={handleAddMedication}
                    className="flex flex-col gap-4"
                >
                    <div>
                        <label
                            className="text-xs uppercase text-neutral-200"
                            htmlFor="medicationName"
                        >
                            Medication Name:
                        </label>
                        <input
                            type="text"
                            id="medicationName"
                            placeholder="e.g. Aspirin"
                            value={medicationName}
                            onChange={(e) => setMedicationName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            className="text-xs uppercase text-neutral-200"
                            htmlFor="medicationForm"
                        >
                            Medication Form:
                        </label>
                        <select
                            id="medicationForm"
                            value={medicationForm}
                            onChange={(e) => setMedicationForm(e.target.value)}
                            className="mt-1 bg-zinc-800 block w-full px-3 py-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm placeholder-gray-400"
                        >
                            <option selected>Select a form</option>
                            <option value="tablet">Tablet</option>
                            <option value="capsule">Capsule</option>
                            <option value="liquid">Liquid</option>
                            <option value="injection">Injection</option>
                            <option value="inhaler">Inhaler</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label
                            className="text-xs uppercase text-neutral-200"
                            htmlFor="medicationStrength"
                        >
                            Medication Strength:
                        </label>
                        <input
                            type="text"
                            id="medicationStrength"
                            placeholder="e.g. 100mg"
                            value={medicationStrength}
                            onChange={(e) =>
                                setMedicationStrength(e.target.value)
                            }
                            className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase text-neutral-200">
                            Days to take medication:
                        </label>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {[
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
                            ].map((day, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => toggleDay(index)}
                                    className={`px-3 py-1 rounded-md text-sm ${
                                        selectedDays.includes(index)
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-300 text-black"
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs uppercase text-neutral-200">
                            Time(s) to take medication:
                        </label>
                        <div className="mt-1 flex flex-col gap-2">
                            {selectedTimes.map((time, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) =>
                                            handleTimeChange(e, index)
                                        }
                                        className="px-3 py-1 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTime(index)}
                                        className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                    >
                                        -
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addTime}
                                className="mt-2 px-4 py-2 w-fit bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                + Add Time
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Add Medication
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddMedication;
