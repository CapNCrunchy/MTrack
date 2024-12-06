import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { CaretLeft } from "@phosphor-icons/react";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/calendar.scss";

const localizer = momentLocalizer(moment); // calendar localizer
moment.updateLocale("en", {
    week: {
        dow: 1, // Start the week on Monday
    },
});

function CalendarView({ api, loggedIn }) {
    const [medEvents, setMedEvents] = useState([]);

    useEffect(() => {
        const fetchMedications = async () => {
            const response = await api.get("/api/medications");
            const medications = Array.from(response.data);

            const events = [];

            const startOfMonth = moment().startOf("month");
            const endOfMonth = moment().endOf("month");

            for (
                let day = startOfMonth;
                day <= endOfMonth;
                day.add(1, "days")
            ) {
                medications.forEach((medication) => {
                    // Adjust day.day() to match the medication.days array where 0 is Monday and 6 is Sunday
                    const adjustedDay = (day.day() + 6) % 7;
                    if (medication.days.includes(adjustedDay)) {
                        medication.times.forEach((time) => {
                            const [hours, minutes] = time.split(":");
                            events.push({
                                title: `${medication.name} ${medication.strength}`,
                                start: day
                                    .clone()
                                    .set({ hour: hours, minute: minutes })
                                    .toDate(),
                                end: day
                                    .clone()
                                    .set({ hour: hours, minute: minutes })
                                    .add(1, "hour")
                                    .toDate(),
                            });
                        });
                    }
                });
            }

            setMedEvents(events);

            console.log(medications);
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
