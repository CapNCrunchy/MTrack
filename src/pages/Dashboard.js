import React from 'react';
import RecordContainer from '../components/RecordContainer';
import MedicationContainer from '../components/MedicationContainer';
import { Pill, Files, CalendarDots } from '@phosphor-icons/react';

function Dashboard() {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col md:flex-row justify-between gap-4'>
                <div className='flex-col'>
                    <h1 className='text-3xl md:text-5xl font-bold'>Dashboard</h1>
                    <h2 className='text-xl md:text-2xl font-light'>October 27, 2024</h2>
                </div>
                <div className='flex flex-row gap-4'>
                    <button onClick={() => { window.location.href = '/calendar'; }} className='flex h-fit items-center gap-2 bg-indigo-700 text-white p-4 rounded-lg hover:bg-indigo-600 active:bg-indigo-700'>
                        <CalendarDots size={20} />
                        Calendar View
                    </button>
                    <button className='flex h-fit items-center gap-2 bg-green-800 text-white p-4 rounded-lg hover:bg-green-600 active:bg-green-700'>
                        <Pill size={20} />
                        Add Medication
                    </button>
                    <button className='flex h-fit items-center gap-2 bg-blue-800 text-white p-4 rounded-lg hover:bg-blue-600 active:bg-blue-700'>
                        <Files size={20} />
                        Add Record
                    </button>
                </div>
            </div>

            <h2 className='text-xl md:text-2xl font-light mt-4'>Your medications today:</h2>
            <div className="flex flex-wrap gap-4">
                <MedicationContainer title='Medication 1' dosage='1 pill (20mg)' takenToday={true} requiredToday={true} />
                <MedicationContainer title='Medication 2' dosage='2 pills (40mg)' takenToday={true} requiredToday={true} />
                <MedicationContainer title='Medication 3' dosage='1 pill (10mg)' takenToday={false} requiredToday={true} />
                <MedicationContainer title='Medication 4' dosage='4 pills' takenToday={false} requiredToday={true} />
            </div>
            <h2 className='text-xl md:text-2xl font-light mt-4'>Your records:</h2>
            <div className="flex flex-wrap gap-4">
                <RecordContainer title='Covid-19 Vaccine' date='09-23-2021' type='Vaccine' />
                <RecordContainer title='Flu Vaccine' date='05-15-2023' type='Vaccine' />
                <RecordContainer title='Record 3' date='2021-09-03' type='Type 3' />
                <RecordContainer title='Record 4' date='2021-09-04' type='Type 4' />
            </div>
        </div>
    );
}

export default Dashboard;