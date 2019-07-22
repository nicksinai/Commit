import React from 'react';
import axios from 'axios';

const Dashboard = props => {
    const handleClick = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async position => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const gym = {
                        lat,
                        lng
                    };
                    try {
                        const config = {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };
                        const body = gym;
                        const res = await axios.put(
                            'api/commitment/checkin/history',
                            body,
                            config
                        );
                        if (res.status === 200) {
                            alert('Checkin Successful');
                        }
                    } catch (err) {
                        alert(err.response.data.msg);
                    }
                },
                err => {
                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            alert('User denied the request for Geolocation.');
                            break;
                        case err.POSITION_UNAVAILABLE:
                            alert('Location information is unavailable.');
                            break;
                        case err.TIMEOUT:
                            alert(
                                'The request to get user location timed out.'
                            );
                            break;
                        case err.UNKNOWN_ERROR:
                            alert('An unknown error occurred.');
                            break;
                    }
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
            );
        } else {
            alert('Geolocation is not available on this browser right now.');
        }
    };

    return <button onClick={handleClick}>Check-in</button>;
};

export default Dashboard;
