import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import PropTypes from 'prop-types';

function DistanceSlider({ minDistance, maxDistance, onChange }) {
    const [DistanceRange, setDistanceRange] = useState([minDistance, maxDistance]);

    const handleSliderChange = (values) => {
        setDistanceRange(values);
        if (onChange) {
            onChange(values);
        }
    };

    return (
        <div className="w-64 mt-5">
            <label htmlFor="Distance" className="block text-sm font-medium text-black">
                Vị trí cách bạn: {DistanceRange[0]} - {DistanceRange[1]} km
            </label>
            <Slider
                range
                min={minDistance}
                max={maxDistance}
                step={1}
                defaultValue={[minDistance, maxDistance]}
                value={DistanceRange}
                onChange={handleSliderChange}
            />
        </div>
    );
}

DistanceSlider.propTypes = {
    minDistance: PropTypes.number.isRequired,
    maxDistance: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default DistanceSlider;
