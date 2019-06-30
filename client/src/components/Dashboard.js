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
                        alert(err.message);
                    }
                },
                err => {
                    alert(err.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 15000 }
            );
        } else {
            alert('Geolocation is not available on this browser right now.');
        }
    };

    return <button onClick={handleClick}>Check-in</button>;
};

export default Dashboard;
