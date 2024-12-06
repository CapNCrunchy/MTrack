import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { CaretLeft } from "@phosphor-icons/react";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/calendar.scss";

const localizer = momentLocalizer(moment); // calendar localizer
// calendar events - TODO: replace with actual data from the database
var events = [
    {
        start: new Date(
            moment().subtract(2, "days").set({ hour: 9, minute: 0 })
        ),
        end: new Date(
            moment().subtract(2, "days").set({ hour: 10, minute: 0 })
        ),
        title: "Ibuprofen 200mg",
    },
    {
        start: new Date(
            moment().subtract(2, "days").set({ hour: 14, minute: 0 })
        ),
        end: new Date(
            moment().subtract(2, "days").set({ hour: 15, minute: 0 })
        ),
        title: "Gabapentin 300mg",
    },
    {
        start: new Date(
            moment().subtract(1, "days").set({ hour: 9, minute: 0 })
        ),
        end: new Date(
            moment().subtract(1, "days").set({ hour: 10, minute: 0 })
        ),
        title: "Lisinopril 10mg",
    },
    {
        start: new Date(
            moment().subtract(1, "days").set({ hour: 14, minute: 0 })
        ),
        end: new Date(
            moment().subtract(1, "days").set({ hour: 15, minute: 0 })
        ),
        title: "Metformin 500mg",
    },
    {
        start: new Date(moment().set({ hour: 9, minute: 0 })),
        end: new Date(moment().set({ hour: 10, minute: 0 })),
        title: "Atorvastatin 20mg",
    },
    {
        start: new Date(moment().set({ hour: 14, minute: 0 })),
        end: new Date(moment().set({ hour: 15, minute: 0 })),
        title: "Simvastatin 40mg",
    },
    {
        start: new Date(moment().add(1, "days").set({ hour: 9, minute: 0 })),
        end: new Date(moment().add(1, "days").set({ hour: 10, minute: 0 })),
        title: "Aspirin 81mg",
    },
    {
        start: new Date(moment().add(1, "days").set({ hour: 14, minute: 0 })),
        end: new Date(moment().add(1, "days").set({ hour: 15, minute: 0 })),
        title: "Albuterol 90mcg",
    },
    {
        start: new Date(moment().add(2, "days").set({ hour: 9, minute: 0 })),
        end: new Date(moment().add(2, "days").set({ hour: 10, minute: 0 })),
        title: "Levothyroxine 50mcg",
    },
    {
        start: new Date(moment().add(2, "days").set({ hour: 14, minute: 0 })),
        end: new Date(moment().add(2, "days").set({ hour: 15, minute: 0 })),
        title: "Losartan 50mg",
    },
    {
        start: new Date(moment().add(3, "days").set({ hour: 9, minute: 0 })),
        end: new Date(moment().add(3, "days").set({ hour: 10, minute: 0 })),
        title: "Omeprazole 20mg",
    },
    {
        start: new Date(moment().add(3, "days").set({ hour: 14, minute: 0 })),
        end: new Date(moment().add(3, "days").set({ hour: 15, minute: 0 })),
        title: "Metoprolol 50mg",
    },
    {
        start: new Date(moment().add(4, "days").set({ hour: 9, minute: 0 })),
        end: new Date(moment().add(4, "days").set({ hour: 10, minute: 0 })),
        title: "Hydrochlorothiazide 25mg",
    },
];



function CalendarView({api, loggedIn}) {
    const [medEvents, setMedEvents] = useState([]);
    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const response = await api.get("/api/medications"); // Adjust the endpoint if needed
                const medications = response.data;

                // Transform medication data into calendar events
                const events = medications.map((med) => {
                    const start = new Date(moment(med.date).set({
                        hour: "09",
                        minute: "00",
                    }));
                    const end = new Date(moment(med.date).set({
                        hour: "09",
                        minute: "30",
                    }));

                    return {
                        start,
                        end,
                        title: `${med.name} ${med.strength}`, // Adjust based on API fields
                    };
                });

                setMedEvents(events); // Update state with transformed events
            } catch (error) {
                console.error("Error fetching medications:", error);
            }
        };

        fetchMedications();
    }, [api]);


    return (
        <div>
            <Link
                to={"/dashboard"}
                className="mb-6 flex h-fit w-fit items-center gap-2 bg-indigo-700 text-white p-2 pr-4 rounded-lg hover:bg-indigo-600 active:bg-indigo-700"
            >
                <CaretLeft size={20} />
                Dashboard
            </Link>
            <Calendar
                localizer={localizer}
                events={medEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
}

export default CalendarView;
