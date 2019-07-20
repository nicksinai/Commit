import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

const Landing = ({ isAuthenticated, active }) => {
    if (isAuthenticated) {
        // TODO: Need to get an accurate active read from db, for now force auth users to dashboard.
        // Making a new commitment is less common than checking in.
        return active ? (
            <Redirect to="/dashboard" />
        ) : (
            <Redirect to="/dashboard" />
        );
    }

    return (
        <div>
            <Link to="/signup">Sign Up</Link>
            <br />
            <Link to="/login">Login</Link>
        </div>
    );
};

Landing.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    active: state.auth.active
});

export default connect(mapStateToProps)(Landing);
