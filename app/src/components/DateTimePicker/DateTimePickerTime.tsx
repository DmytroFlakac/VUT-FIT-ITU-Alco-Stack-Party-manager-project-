import { forwardRef, useImperativeHandle, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateTimePickerTime.css";

interface DateTimePickerProps {
    value: string | undefined; // ISO String for date value
    onChange: (date: string | undefined) => void; // Callback to handle date change
}

export interface DateTimePickerRef {
    focus: () => void; // Expose a method to open the calendar
}

const DateTimePickerTime = forwardRef<DateTimePickerRef, DateTimePickerProps>(
    ({ value, onChange }, ref) => {
        const date_timePickerRef = useRef<DatePicker>(null);

        const handleDateChange = (date: Date | null) => {
            if (date) {
                onChange(date.toISOString()); // Return ISO string including time
            } else {
                onChange(undefined); // Handle clearing of the date
            }
        };

        // Expose the focus method to the parent
        useImperativeHandle(ref, () => ({
            focus: () => {
                date_timePickerRef.current?.setOpen(true); // Programmatically open the calendar
            },
        }));

        return (
            <div className="datepicker-wrapper">
                <DatePicker
                    ref={date_timePickerRef}
                    selected={value ? new Date(value) : null} // Handle null for empty value
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd HH:mm" // Include time in the format
                    showTimeSelect // Enable time selection
                    timeFormat="HH:mm" // Use 24-hour time format
                    timeIntervals={15} // Set 15-minute intervals for time selection
                    timeCaption="Time" // Label for the time picker
                />
            </div>
        );
    }
);

export default DateTimePickerTime;