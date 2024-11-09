import React, { useState } from 'react';

function LoginMenu({ checkLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        checkLogin(e);
    };

    return (
        <div className="bg-zinc-800 p-4 rounded-lg shadow-md w-fit text-left">
            <form onSubmit={handleLogin} className='flex flex-col gap-4'>
                <div>
                    <label className='text-xs uppercase text-neutral-200' htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className='text-xs uppercase text-neutral-200' htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    Login
                </button>
            </form>
            <p className="mt-4">
                Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up instead.</a>
            </p>
        </div>
    );
};

export default LoginMenu;