import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./ProfileCard.css";
import {Link} from "react-router-dom";
import {useAuth} from "../../Context/useAuth.tsx";
import {useForm} from "react-hook-form";
import {UserPhoto} from "../../Models/User.tsx";
import {yupResolver} from "@hookform/resolvers/yup";
import {Bounce, toast} from "react-toastify";
import {UpdatePhotoAPI} from "../../Services/UserService.tsx";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import * as Yup from "yup";
import Photobg from "../../assets/photobackground.svg"
import editprof from "../../assets/edit profile.svg";
import alcopopup from "../../assets/alcopopup.svg";
interface ProfileCardProps {
    UserName: string;
    name: string;
    Surname: string;
    Phone: string;
    Email: string;
    Gender: number;
    photoSrc: string;
    formBackgroundSrc: string;
}

const validationSchema = Yup.object().shape({
    photoChanged: Yup.boolean().required(),
    formBackgroundChanged: Yup.boolean().required(),
    photoFile: Yup.mixed<File>()
        .nullable()
        .optional()
        .test("fileSize", "File too large", (value) => {
            return !value || (value && value.size <= 5000000); // 5 MB file size limit
        })
        .test("fileType", "Unsupported File Format", (value) => {
            return (
                !value ||
                (value && ["image/jpeg", "image/png", "image/gif"].includes(value.type))
            );
        }),
        formBackgroundFile: Yup.mixed<File>()
        .nullable()
        .optional()
        .test("fileSize", "File too large", (value) => {
            return !value || (value && value.size <= 5000000); // 5 MB file size limit
        })
        .test("fileType", "Unsupported File Format", (value) => {
            return (
                !value ||
                (value && ["image/jpeg", "image/png", "image/gif"].includes(value.type))
            );
        }),
});

const ProfileCard: React.FC<ProfileCardProps> = ({
         name,
         Surname,
         Phone,
         Gender,
         photoSrc,
         formBackgroundSrc,
         UserName
    }) => {
    const [currentPhotoSrc, setCurrentPhotoSrc] = useState(photoSrc);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoChanged, setPhotoChanged] = useState(false);

    const { token, updateUser } = useAuth();

    useEffect(() => {
        setCurrentPhotoSrc(photoSrc);
    }, [photoSrc, formBackgroundSrc]);



    const profileCardStyle: React.CSSProperties = {

        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '90%',
        borderRadius: '20px',
        backgroundColor: 'transparent',
        border : 'transparent',
        color: 'white',
        marginTop: '-30px',

    };

    const { handleSubmit, formState: { errors } } = useForm<UserPhoto>({
        resolver: yupResolver(validationSchema),
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>, setUrl: React.Dispatch<React.SetStateAction<string>>, setChanged: React.Dispatch<React.SetStateAction<boolean>>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);
            const reader = new FileReader();
            reader.onload = (x) => {
                setUrl(x?.target?.result as string);
            };
            reader.readAsDataURL(file);
            setChanged(true);
        }
    };

    const handlePhotoUpdate = async () => {
        if (!token) {

            toast.error('You must be logged in to update your profile',{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            } );
            return;
        }

        try {
            const response = await UpdatePhotoAPI(
                photoChanged,
                photoFile,
                token
            );
            if (response && response.data) {
                updateUser(response.data);
                setCurrentPhotoSrc(response.data.photoSrc || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg");
                setPhotoChanged(false);

            }
        } catch (error) {
            console.error('Failed to update profile', error);

            toast.error('Failed to update profile. Please try again.',{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            } );
        }
    };

    const handleDeletePhoto = () => {
        setCurrentPhotoSrc('');
        setPhotoFile(null);
        setPhotoChanged(true);
    };



    const [modalShow, setModalShow] = useState(false);

    interface MyVerticallyCenteredModalProps {
        show: boolean;
        onHide: () => void;
    }
    const onSubmit = () => {
        handlePhotoUpdate();
        setModalShow(false);
    };


    const MyVerticallyCenteredModal: React.FC<MyVerticallyCenteredModalProps> = ({ onHide, show }) => {

        return (
            <>
                {show && <div className="modal-backdrop-profile" />}
            <Modal
                show={show}
                onHide={onHide}
                className= "foto-modal"
                // size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={{ maxWidth: "500px", height: "600px", margin: "auto" , position: 'fixed',
                    top: '10%',
                    left: '35%',
                    borderRadius: '16px',
                    zIndex: '1050',
                    backgroundColor: 'black',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backgroundImage: `url(${alcopopup})`,
                    border: "3px solid rgba(79, 40, 233, 0.5)",


            }}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                        background: 'transparent',
                        backgroundImage: 'none',
                        border: 'none',
                        backgroundColor: 'transparent', // Corrected from 'none'

                    }}
                >
                    <Modal.Body style={{marginTop: '-50px'}}>
                        <h3 className="update-profile-text" style={{marginBottom: '50px', fontWeight: 'bold'}}>
                            Update your profile picture
                        </h3>
                        <div className="mb-3 text-center">
                            {/* Add the heading or label above "Profile Photo" */}


                            <label htmlFor="photoFile" className="form-label-profile-photo">
                                Profile Photo
                            </label>
                            <div className="photo-upload-container">
                                {currentPhotoSrc ? (
                                    <img src={currentPhotoSrc} alt="Current Profile"/>
                                ) : (
                                    <div
                                        className="photo-upload-icon"
                                        style={{
                                            width: "110px",
                                            height: "110px",
                                            borderRadius: "50%",
                                            backgroundImage: `url(${Photobg})`,
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: "center",
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {/* Icon inside the circle */}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="photoFile"
                                    className="photo-upload-input"
                                    onChange={(e) =>
                                        handleImageChange(
                                            e,
                                            setPhotoFile,
                                            setCurrentPhotoSrc,
                                            setPhotoChanged
                                        )
                                    }
                                />
                            </div>
                            {errors.photoFile && (
                                <div className="invalid-feedback">{errors.photoFile.message}</div>
                            )}
                            {currentPhotoSrc && (
                                <Button
                                    variant="danger"
                                    className="mt-2"
                                    onClick={handleDeletePhoto}
                                    style={{
                                        width: '150px',
                                        borderRadius: '100px'
                                    }}
                                >
                                    Delete Photo
                                </Button>
                            )}
                        </div>
                    </Modal.Body>

                    {/*<Modal.Footer style={{ display: "flex", justifyContent: "space-between", backgroundColor: 'transparent', marginTop: '230px' , borderTop: 'transparent'}}>*/}
                    {/*    <Button onClick={onSubmit} style={{ backgroundColor: "#000000", color: 'white', marginTop: '15px', width: '150px', borderRadius: '100px' }}>*/}
                    {/*        Save*/}
                    {/*    </Button>*/}
                    {/*    <Button onClick={onHide} variant="secondary" style={{ backgroundColor: "#000000", color: 'white', marginTop: '15px', width: '150px', borderRadius: '100px' }}>*/}
                    {/*        Close*/}
                    {/*    </Button>*/}
                    {/*</Modal.Footer>*/}

                </form>
                <Modal.Footer style={{ display: "flex", justifyContent: "space-between", backgroundColor: 'transparent', marginTop: '150px' , borderTop: 'transparent'}}>
                    <Button onClick={onSubmit} style={{ backgroundColor: "#000000", color: 'white', marginTop: '15px', width: '150px', borderRadius: '100px' }}>
                        Save
                    </Button>
                    <Button onClick={onHide} variant="secondary" style={{ backgroundColor: "#000000", color: 'white', marginTop: '15px', width: '150px', borderRadius: '100px' }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            </>
        );
    };

    return (
        <div className="card" style={profileCardStyle}>

            <div className="card-body d-flex flex-column">
                <div className="p-3 d-flex flex-column justify-content-around align-items-center">
                    <button onClick={() => setModalShow(true)} className="profile-photo-button"
                            style={{
                                backgroundImage: `url(${Photobg})`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                color: "black",
                        backgroundPosition: 'center',
                        border: '3px solid #50C5FF'}}>
                        <img className="profile-photo" src={currentPhotoSrc} />
                    </button>
                    <h5 className="card-title profile-name">
                        <br/>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>{UserName}</span>
                    </h5>
                </div>
                <div className="d-flex flex-grow-1 flex-row align-items-center justify-content-between">
                    {/* Profile Details on the Left */}
                    <ul className="list-unstyled profile-details-list m-0">
                        <li>
                            <span>Name: {name}</span>
                        </li>
                        <li>
                            <span>Surname: {Surname}</span>
                        </li>
                        <li>
                            <span>Phone: {Phone}</span>
                        </li>
                        <li>
            <span>
                Gender: {Gender === 0 ? "Male" : Gender === 1 ? "Female" : Gender === 2 ? "Other" : "Unknown"}
            </span>
                        </li>
                    </ul>

                    {/* Button on the Right */}
                    <div style={{marginTop: '-90px',}}>
                        <Link to="/profile/edit" style={{textDecoration: 'none'}}>
                            <Button
                                className="btn-lg edit-profile-btn"
                                style={{
                                    padding: '0',
                                    background: `url(${editprof}) no-repeat center center`,
                                    backgroundSize: 'contain',
                                    width: '200px',
                                    height: '120px',
                                }}
                            />
                        </Link>
                    </div>
                </div>

            </div>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </div>
    );
};

export default ProfileCard;

