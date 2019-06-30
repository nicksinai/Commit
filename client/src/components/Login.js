import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/auth';

const Login = ({ login, isAuthenticated, active }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        login(email, password);
    };

    // Redirect if logged insla
    // TODO: Redirect to new commitment flow if no active commitment
    if (isAuthenticated) {
        return active ? <Redirect to="/dashboard" /> : <Redirect to="/new" />;
    }

    return (
        <Fragment>
            <h2>Login</h2>
            <form onSubmit={e => onSubmit(e)}>
                <input
                    name="email"
                    type="text"
                    required={true}
                    placeholder="Email"
                    value={email}
                    onChange={e => onChange(e)}
                />{' '}
                <br />
                <input
                    name="password"
                    type="password"
                    required={true}
                    placeholder="Password"
                    value={password}
                    onChange={e => onChange(e)}
                />{' '}
                <br />
                <input name="submit" type="submit" value="Login" />
            </form>
        </Fragment>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    active: state.auth.active
});

export default connect(
    mapStateToProps,
    { login }
)(Login);
