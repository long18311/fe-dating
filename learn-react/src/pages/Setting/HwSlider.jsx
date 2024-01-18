import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import PropTypes from 'prop-types';

function HwSlider({ min, max, type , onChange }) {
    const [range, seRange] = useState([min, max]);


    const handleSliderChange = (values) => {
        seRange(values);
        if (onChange) {
            onChange(values);
        }
    };

    return (
        <div className="w-64 mt-3">
            <label htmlFor={type[0]} className="block text-sm font-medium text-black">
                {type[0]}: {range[0]} - {range[1]} {type[1]}
            </label>
            <Slider
                range
                min={min}
                max={max}
                step={1}
                defaultValue={[min, max]}
                value={range}
                onChange={handleSliderChange}
            />
        </div>
    );
}

HwSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default HwSlider;
