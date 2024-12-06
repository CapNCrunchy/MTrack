import { React, useState } from "react";
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

function AddRecord({ api, setAddRecordVisible }) {
    const [recordTitle, setRecordTitle] = useState("");
    const [recordDate, setRecordDate] = useState("");

    const navigate = useNavigate();

    const handleAddRecord = (e) => {
        e.preventDefault();
        const csrfToken = getCSRFToken();

        api.post("/api/record", {
            title: recordTitle,
            date: recordDate,

        },{
            headers: {
                "X-CSRFToken": csrfToken, 
            },
        })
            .then(function (res) {
                setAddRecordVisible(false);
                navigate("/dashboard");
            })
            .catch(function (err) {
                alert("Error: " + err.response.data["error"]);
            });
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
            <div className="bg-zinc-800 p-4 rounded-lg w-full md:w-1/2 lg:w-1/3">
                <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-bold">Add Record</h2>
                    <button onClick={() => setAddRecordVisible(false)}>
                        <X size={24} />
                    </button>
                </div>

                <form
                    onSubmit={handleAddRecord}
                    className="flex flex-col gap-4"
                >
                    <div>
                        <label
                            className="text-xs uppercase text-neutral-200"
                            htmlFor="medicationName"
                        >
                            Record Title:
                        </label>
                        <input
                            type="text"
                            id="recordTitle"
                            placeholder="e.g. Covid-19 Vaccination"
                            value={recordTitle}
                            onChange={(e) => setRecordTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            className="text-xs uppercase text-neutral-200"
                            htmlFor="recordDate"
                        >
                            Record Date:
                        </label>
                        <input
                            type="date"
                            id="recordDate"
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Add Record
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddRecord;
