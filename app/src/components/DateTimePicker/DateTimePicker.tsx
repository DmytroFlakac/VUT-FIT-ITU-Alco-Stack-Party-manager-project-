import { forwardRef, useImperativeHandle, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateTimePicker.css";

interface DateTimePickerProps {
    value: string | null | undefined; // ISO String for date value
    onChange: (date: string | undefined) => void; // Callback to handle date change
}

export interface DateTimePickerRef {
    focus: () => void; // Expose a method to open the calendar
}

const DateTimePicker = forwardRef<DateTimePickerRef, DateTimePickerProps>(
    ({ value, onChange }, ref) => {
        const datePickerRef = useRef<DatePicker>(null);

        const handleDateChange = (date: Date | null) => {
            if (date) {
                // Format date as yyyy-MM-dd without UTC adjustment
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
                onChange(formattedDate);
            } else {
                onChange(undefined); // Handle clearing of the date
            }
        };

        // Expose the focus method to the parent
        useImperativeHandle(ref, () => ({
            focus: () => {
                datePickerRef.current?.setOpen(true); // Programmatically open the calendar
            },
        }));

        return (
            <div className="datepicker-wrapper">
                <DatePicker
                    ref={datePickerRef}
                    selected={value ? new Date(value) : null} // Handle null for empty value
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd" // Use date-only format
                />
            </div>
        );
    }
);

export default DateTimePicker;
