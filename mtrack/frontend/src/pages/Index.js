import React, { useEffect } from 'react';

function Index({ loggedIn, name, email }) {
    useEffect(() => {
        if (loggedIn) {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/login';
        }
    }, [loggedIn]);

    return (
        <div>
            Redirecting...
        </div>
    );
}

export default Index;