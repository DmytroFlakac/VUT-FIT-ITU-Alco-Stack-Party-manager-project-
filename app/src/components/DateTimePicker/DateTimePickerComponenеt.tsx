import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DateTimePicker.css';
import icon_calendar from '../../assets/icon _calendar_.svg';

interface DateTimePickerComponentProps {
    value: string | undefined;
    onChange: (date: string | undefined) => void;
}

const CustomInput = React.forwardRef<HTMLInputElement, { value: string | undefined; onClick: () => void; placeholder: string }>(
    ({ value, onClick, placeholder }, ref) => (
        <div className="datepicker-custom-input-wrapper" onClick={onClick}>
            <input
                className="datepicker-custom-input"
                ref={ref}
                value={value}
                placeholder={placeholder}
                readOnly
            />
            <img src={icon_calendar} alt="Calendar Icon" className="datepicker-icon" />
        </div>
    )
);

const DateTimePickerComponent: React.FC<DateTimePickerComponentProps> = ({ value, onChange }) => {
    return (
        <div className="datepicker-container">
            <label htmlFor="dateOfBirth" className="datepicker-label">Date and Time</label>
            <DatePicker
                selected={value ? new Date(value) : null}
                onChange={(date: Date | null) => onChange(date ? date.toISOString() : undefined)}
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select Date and Time"
                customInput={<CustomInput
                    value={value}
                    onClick={() => {}}
                    placeholder="Select Date and Time"
                />}
                className="react-datepicker"
            />
        </div>
    );
};

export default DateTimePickerComponent;
