import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../Context/useAuth";
import { toast } from "react-toastify";
import * as yup from "yup";
import { DatePicker, Modal, Button } from "rsuite";
import { CreatePartyAPI } from "../../Services/PartyService.tsx";
import 'rsuite/dist/rsuite.min.css';
import "./CreatePartyPopUp.css";
import { useEffect } from "react";

// Validation schema using yup
const validationSchema = yup.object().shape({
    name: yup.string().optional(),
    description: yup.string().optional(),
    date: yup
        .string()
        .required("Date is required")
        .test(
            "is-future-date",
            "Date must be today or in the future",
            function (value) {
                if (!value) return false; // Ensure value is provided
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset today's time to midnight for comparison
                return selectedDate >= today;
            }
        ),
    preparationDate: yup
        .string()
        .required("Preparation Date is required")
        .test(
            "is-before-date",
            "Preparation Date must be earlier than the event date",
            function (value) {
                const { date } = this.parent;
                if (!value || !date) return true; // Skip if either is missing
                const preparationDate = new Date(value);
                const eventDate = new Date(date);
                return preparationDate < eventDate;
            }
        )
        .test(
            "not-today",
            "Preparation Date cannot be today",
            function (value) {
                if (!value) return true;
                const preparationDate = new Date(value).toISOString().split("T")[0];
                const today = new Date().toISOString().split("T")[0];
                return preparationDate !== today;
            }
        )
        .test(
            "not-past-date",
            "Preparation Date cannot be in the past",
            function (value) {
                if (!value) return true; // Skip if value is not provided
                const preparationDate = new Date(value).setHours(0, 0, 0, 0); // Clear time for comparison
                const today = new Date().setHours(0, 0, 0, 0); // Clear time for comparison
                return preparationDate >= today; // Ensure the date is today or in the future
            }
        ),


    photo: yup.string().optional(),
    location: yup.string().optional(),
});

interface CreatePartyPopUpProps {
    show: boolean;
    handleClose: () => void;
}

const CreatePartyPopUp: React.FC<CreatePartyPopUpProps> = ({ show, handleClose }) => {
    const { user, token } = useAuth();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        if (show) {
            const dropdown = document.querySelector('.rs-picker-dropdown');
            if (dropdown) {
                document.getElementById('portal-root')?.appendChild(dropdown);
            }
        }
    }, [show]);

    const onSubmit = async (data: { name?: string; description?: string; date: string; preparationDate:string; photo?: string; location?: string; }) => {
        console.log("Create party form submitted");
        console.log(data.date);
        try {
            const response = await CreatePartyAPI(
                data.name || "",
                data.description || "",
                data.date,
                data.preparationDate,
                data.photo || "",
                data.location || "",
                user?.userName,
                token
            );
            toast.success("Party created successfully!");
            console.log(response);
            handleClose(); // Close the modal on success
        } catch (error) {
            console.error(error);
            toast.error("Failed to create party");
        }
    };

    return (
        <>
            {show && <div className="modal-backdrop create-party" />} {/* Add this backdrop */}
            <Modal open={show} onClose={handleClose}>
                <Modal.Header className="text-center w-100">
                    <Modal.Title className="modal-title-bold-create">Create Party</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Party Name Field */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Party Name <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                id="name"
                                placeholder="Enter party name"
                                {...register("name", { required: true })}
                            />
                            {errors.name && (
                                <p className="text-danger">Party Name is required</p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                placeholder="Optional description"
                                {...register("description")}
                            />
                            <p className="text-danger">{errors.description?.message}</p>
                        </div>

                        {/* Date Field */}
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">
                                Date and Time <span style={{ color: "red" }}>*</span>
                            </label>
                            <DatePicker
                                format="yyyy-MM-dd HH:mm"
                                oneTap
                                onChange={(value) => {
                                    if (value) {
                                        const localDate = new Date(value);
                                        localDate.setHours(localDate.getHours() + 1);
                                        setValue("date", localDate.toISOString());
                                    } else {
                                        setValue("date", "");
                                    }
                                }}
                                placement="auto"
                                block
                                ranges={[]} // Remove preset ranges if any
                                className={`${errors.date ? "date-picker-error" : ""}`}
                            />
                            {errors.date && (
                                <p className="text-danger">{errors.date.message}</p>
                            )}
                        </div>

                        {/* Preparation Date Field */}
                        <div className="mb-3">
                            <label htmlFor="preparationDate" className="form-label">
                                Preparation Date and Time <span style={{ color: "red" }}>*</span>
                            </label>
                            <DatePicker
                                format="yyyy-MM-dd HH:mm"
                                oneTap
                                onChange={(value) => {
                                    if (value) {
                                        const localDate = new Date(value);
                                        localDate.setHours(localDate.getHours() + 1);
                                        setValue("preparationDate", localDate.toISOString());
                                    } else {
                                        setValue("preparationDate", "");
                                    }
                                }}
                                placement="auto"
                                block
                                ranges={[]} // Remove preset ranges if any
                                className={`${errors.preparationDate ? "date-picker-error" : ""}`}
                            />
                            {errors.preparationDate && (
                                <p className="text-danger">{errors.preparationDate.message}</p>
                            )}
                        </div>

                        {/* Photo URL Field */}
                        <div className="mb-3">
                            <label htmlFor="photo" className="form-label">Photo URL</label>
                            <input
                                type="text"
                                className="form-control"
                                id="photo"
                                placeholder="Optional photo URL"
                                {...register("photo")}
                            />
                            <p className="text-danger">{errors.photo?.message}</p>
                        </div>

                        {/* Location Field */}
                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                placeholder="Optional location"
                                {...register("location")}
                            />
                            <p className="text-danger">{errors.location?.message}</p>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button
                                appearance="primary"
                                type="submit"
                                style={{ backgroundColor: "#000000", color: "white" }}
                            >
                                Create Party
                            </Button>
                            <Button
                                onClick={handleClose}
                                appearance="subtle"
                                style={{ backgroundColor: "#000000", color: "white" }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default CreatePartyPopUp;
