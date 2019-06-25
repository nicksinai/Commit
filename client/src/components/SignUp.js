import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { signup } from '../actions/auth';
import PropTypes from 'prop-types';

const SignUp = ({ signup }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            console.log('Passwords do not match');
        } else {
            signup({ name, email, password });
        }
    };

    return (
        <Fragment>
            <h2>Sign Up</h2>
            <form onSubmit={e => onSubmit(e)}>
                <input
                    name="name"
                    type="text"
                    required={true}
                    placeholder="Name"
                    value={name}
                    onChange={e => onChange(e)}
                />{' '}
                <br />
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
                <input
                    name="password2"
                    type="password"
                    required={true}
                    placeholder="Password"
                    value={password2}
                    onChange={e => onChange(e)}
                />{' '}
                <br />
                <input name="submit" type="submit" value="Sign Up" />
            </form>
        </Fragment>
    );
};

SignUp.propTypes = {
    signup: PropTypes.func.isRequired
};

// If you don't want to subscribe to store updates, pass null or undefined in place of mapStateToProps.
export default connect(
    null,
    { signup }
)(SignUp);
