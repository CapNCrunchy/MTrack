import React, { Component } from "react";
import { Link } from "react-router-dom";
import RecordContainer from "../components/RecordContainer";
import MedicationContainer from "../components/MedicationContainer";
import AddMedication from "../components/AddMedication";
import AddRecord from "../components/AddRecord";
import { Pill, Files, CalendarDots } from "@phosphor-icons/react";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addMedicationVisible: false,
            addRecordVisible: false,
            currentDate: new Date(),
            userMedications: [],
            todayUserMedications: [],
        };
    }

    componentDidMount() {
        const { api, history } = this.props;
        // check if user is logged in
        api.get("/api/user").catch((err) => {
            history.push("/");
        });
        // get user medications
        this.getMedications();
        // get user medications for today
        this.getTodayMedications();
    }

    async getMedications() {
        const { api } = this.props;
        try {
            const response = await api.get("/api/medications");
            this.setState({ userMedications: response.data });
        } catch (error) {
            console.error("Error fetching medications:", error);
        }
    }

    async getTodayMedications() {
        const { api } = this.props;
        try {
            const response = await api.get("/api/medications/today");
            this.setState({ todayUserMedications: response.data });
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching today medications:", error);
        }
    }

    render() {
        const { api } = this.props;
        const { addMedicationVisible, addRecordVisible, currentDate } =
            this.state;

        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-col">
                        <h1 className="text-3xl md:text-5xl font-bold">
                            Dashboard
                        </h1>
                        <h2 className="text-xl md:text-2xl font-light">
                            {currentDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </h2>
                    </div>
                    <div className="flex flex-row gap-4">
                        <Link
                            to={"/calendar"}
                            className="flex h-fit items-center gap-2 bg-indigo-700 text-white p-4 rounded-lg hover:bg-indigo-600 active:bg-indigo-700"
                        >
                            <CalendarDots size={20} />
                            Calendar View
                        </Link>
                        <button
                            onClick={() =>
                                this.setState({ addMedicationVisible: true })
                            }
                            className="flex h-fit items-center gap-2 bg-green-800 text-white p-4 rounded-lg hover:bg-green-600 active:bg-green-700"
                        >
                            <Pill size={20} />
                            Add Medication
                        </button>
                        <button
                            onClick={() =>
                                this.setState({ addRecordVisible: true })
                            }
                            className="flex h-fit items-center gap-2 bg-blue-800 text-white p-4 rounded-lg hover:bg-blue-600 active:bg-blue-700"
                        >
                            <Files size={20} />
                            Add Record
                        </button>
                    </div>
                </div>

                <h2 className="text-xl md:text-2xl font-light mt-4">
                    Your medications today:
                </h2>
                <div className="flex flex-wrap gap-4">
                    {this.state.todayUserMedications.map((medication) => (
                        <MedicationContainer
                            key={medication.medication.id}
                            name={medication.medication.name}
                            time={medication.time}
                            dosage={medication.medication.strength}
                        />
                    ))}
                </div>
                <h2 className="text-xl md:text-2xl font-light mt-4">
                    Your records:
                </h2>
                <div className="flex flex-wrap gap-4">
                    <RecordContainer
                        title="Covid-19 Vaccine"
                        date="09-23-2021"
                        type="Vaccine"
                    />
                    <RecordContainer
                        title="Flu Vaccine"
                        date="05-15-2023"
                        type="Vaccine"
                    />
                    <RecordContainer
                        title="Record 3"
                        date="2021-09-03"
                        type="Type 3"
                    />
                    <RecordContainer
                        title="Record 4"
                        date="2021-09-04"
                        type="Type 4"
                    />
                </div>

                {addMedicationVisible && (
                    <AddMedication
                        api={api}
                        setAddMedicationVisible={(visible) =>
                            this.setState({ addMedicationVisible: visible })
                        }
                    />
                )}

                {addRecordVisible && (
                    <AddRecord
                        api={api}
                        setAddRecordVisible={(visible) =>
                            this.setState({ addRecordVisible: visible })
                        }
                    />
                )}
            </div>
        );
    }
}

export default Dashboard;
