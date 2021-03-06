import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Map from './Map';
import { createCommitment } from '../actions/commitment';

const NewCommitment = ({ createCommitment, history }) => {
    const [formData, setFormData] = useState({
        days: '',
        weeks: '',
        gym: {
            lat: 0,
            lng: 0
        },
        price: ''
    });

    // TODO: Get not gym working
    const { days, weeks, price, gym } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        createCommitment(formData, history);
    };

    const handleGymChange = gym => {
        setFormData({ ...formData, gym: { lat: gym.lat, lng: gym.lng } });
    };

    return (
        <Fragment>
            <form onSubmit={e => onSubmit(e)}>
                <h3>Find your gym and build your commitment</h3>
                <Map id="map" onGymChange={handleGymChange} /> <br />
                <input
                    name="days"
                    type="number"
                    required={true}
                    placeholder="Days per week"
                    value={days}
                    onChange={e => onChange(e)}
                />{' '}
                <br />
                <input
                    name="weeks"
                    type="number"
                    required={true}
                    placeholder="Weeks in a row"
                    value={weeks}
                    onChange={e => onChange(e)}
                />{' '}
                <br />
                <input
                    name="price"
                    type="number"
                    required={true}
                    placeholder="Price per failed week ($)"
                    value={price}
                    onChange={e => onChange(e)}
                />{' '}
                <br />
                <input name="submit" type="submit" value="Commit" />
            </form>
        </Fragment>
    );
};

NewCommitment.propTypes = {
    createCommitment: PropTypes.func.isRequired
};

export default connect(
    null,
    { createCommitment }
)(withRouter(NewCommitment));
