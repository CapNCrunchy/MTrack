import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupMenu({loggedIn, setLoggedIn, setName, setEmail}) {
    const [givenEmail, setGivenEmail] = useState('');
    const [givenName, setGivenName] = useState('');
    const [givenPassword, setGivenPassword] = useState('');

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const formData = {
            name: givenName,
            email: givenEmail,
            password: givenPassword
        };
        try {
            const response = await axios.post("http://localhost:8000/api/register", formData);
            if (response.data.success) {
                setLoggedIn(true);
                setName(givenName);
                setEmail(givenEmail);
                localStorage.setItem('email', givenEmail);
                navigate('/dashboard');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <div className="bg-zinc-800 p-4 rounded-lg shadow-md w-fit text-left justify-self-center">
            <form onSubmit={handleSignup} className='flex flex-col gap-4'>
                <div>
                    <label className='text-xs uppercase text-neutral-200' htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={givenName}
                        onChange={(e) => setGivenName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className='text-xs uppercase text-neutral-200' htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={givenEmail}
                        onChange={(e) => setGivenEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className='text-xs uppercase text-neutral-200' htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={givenPassword}
                        onChange={(e) => setGivenPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    Create Account
                </button>
            </form>
            <p className="mt-4">
                Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in instead.</a>
            </p>
        </div >
    );
}

export default SignupMenu;