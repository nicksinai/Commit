import React, { Fragment, useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        console.log('SUCCESS');
    };

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

export default Login;
