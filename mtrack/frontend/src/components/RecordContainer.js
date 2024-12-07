import React from "react";
import PropTypes from "prop-types";

const RecordContainer = ({ title, date, type }) => {
    return (
        <div className="bg-zinc-700 p-4 rounded-lg shadow-md w-fit text-left justify-self-center">
            <p className="text-sm font-light">{date}</p>
            <h2 className="text-lg font-medium">{title}</h2>
        </div>
    );
};

RecordContainer.propTypes = {
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default RecordContainer;
