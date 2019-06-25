import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div>
            <Link to="/signup">Sign Up</Link>
            <br />
            <Link to="/login">Login</Link>
        </div>
    );
};

export default Landing;
