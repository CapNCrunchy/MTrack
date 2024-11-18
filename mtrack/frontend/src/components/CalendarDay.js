import React from "react";

function CalendarDay({ day, isToday, isCurrentMonth }) {
    return (
        <div className={`border p-2 h-20 ${isToday ? 'bg-green-500' : ''} ${isCurrentMonth ? '' : 'text-gray-400'}`}>
            {day}
        </div>
    );
}

export default CalendarDay;