import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import PropTypes from 'prop-types';

function AgeSlider({ minAge, maxAge, onChange }) {
    const [ageRange, setAgeRange] = useState([minAge, maxAge]);

    const handleSliderChange = (values) => {
        setAgeRange(values);
        if (onChange) {
            onChange(values);
        }
    };

    return (
        <div className="w-64 mt-3">
            <div>Sở thích về độ tuổi</div>
            <label htmlFor="age" className="block text-sm font-medium text-black">
                Tuổi: {ageRange[0]} - {ageRange[1]}
            </label>
            <Slider
                range
                min={minAge}
                max={maxAge}
                step={1}
                defaultValue={[minAge, maxAge]}
                value={ageRange}
                onChange={handleSliderChange}
            />
        </div>
    );
}

AgeSlider.propTypes = {
    minAge: PropTypes.number.isRequired,
    maxAge: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default AgeSlider;
