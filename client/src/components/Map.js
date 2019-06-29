import React, { useEffect, useRef } from 'react';

export default function Map({ options, onMount, className }) {
    const props = { ref: useRef(), className };
    const onLoad = () => {
        const map = new window.google.maps.places.Autocomplete(
            props.ref.current,
            options
        );
        onMount && onMount(map);
        map.addListener('place_changed', function() {
            let place = map.getPlace();
            let lat = place.geometry.location.lat();
            let lng = place.geometry.location.lng();
            // dispatch update to the new commitment
            console.log(`${lat}, ${lng}`);
        });
    };

    useEffect(() => {
        if (!window.google) {
            const script = document.createElement(`script`);
            script.type = `text/javascript`;
            // TODO: USE SESSION API KEYS $$$
            script.src =
                'https://maps.googleapis.com/maps/api/js?key=AIzaSyBBKdUIQJDOot-g9QQ4FHywQiim6_cq__0&libraries=places';
            const headScript = document.getElementsByTagName(`script`)[0];
            headScript.parentNode.insertBefore(script, headScript);
            script.addEventListener(`load`, onLoad);
            return () => script.removeEventListener(`load`, onLoad);
        } else onLoad();
        // eslint-disable-next-line
    }, []);

    return (
        <input
            id="pac-input"
            onKeyDown={e => {
                if (e.keyCode === 13) {
                    e.preventDefault();
                }
            }}
            {...props}
        />
    );
}

Map.defaultProps = {};
