import React from 'react';
import ReactDOM from 'react-dom';
import './UserDeleteCard.css';
import back from '../../assets/signUp_card.svg';
import {Bounce, toast} from "react-toastify";
// Define the props for UserDeleteCard
interface UserDeleteCardProps {
    userName: string;
    photoSrc?: string;
    onDelete: () => Promise<void>;
}

// Modal Component using React Portal
const Modal: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => {
    // Create a div to hold the modal
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        const tempRoot = document.createElement('div');
        tempRoot.id = 'modal-root';
        document.body.appendChild(tempRoot);
        return ReactDOM.createPortal(
            <div style={modalStyles.overlay} onClick={onClose}>
                <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>,
            tempRoot
        );
    }

    return ReactDOM.createPortal(
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        modalRoot
    );
};

// Styles for the modal
const modalStyles = {
    overlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(30px)',
        zIndex: 1000,
    },
    content: {
        backgroundImage: `url(${back})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        padding: '20px',
        border: '3px solid rgba(79, 40, 233, 0.5)',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '16px',
        maxWidth: '400px',
        width: '500px',

        textAlign: 'center' as const,
    },
    header: {
        fontFamily: 'Karla-Bold, sans-serif',
        marginBottom: '16px',
        fontSize: '18px',
        fontWeight: 600,
        color: '#333',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
    },
    confirmButton: {
        padding: '8px 16px',
        backgroundColor: '#ff4d4f',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        fontSize: '14px',
        minWidth: '100px',
    },
    cancelButton: {
        padding: '8px 16px',
        backgroundColor: '#ccc',
        color: '#333',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        fontSize: '14px',
        minWidth: '100px',
    },
};

// UserDeleteCard Component
const UserDeleteCard: React.FC<UserDeleteCardProps> = ({ userName, photoSrc, onDelete }) => {
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isHovering, setIsHovering] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete();

            toast.success(`${userName} has been deleted successfully.`,{
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
        } catch (error) {
            console.error('Failed to delete user:', error);

            toast.error(`Failed to delete ${userName}. Please try again.`,{
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
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
        }
    };

    const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (!isDeleting) {
            setIsModalOpen(false);
        }
    };

    // Inline styles
    const styles = {
        card: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '30px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            margin: '8px 0',
            backgroundColor: '#fff' as const,
            position: 'relative' as const,
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover' as const,
            marginRight: '12px',
            backgroundColor: '#f0f0f0',
        },
        userName: {
            fontFamily: 'Karla-Bold, sans-serif',
            fontSize: '16px',
            fontWeight: 500,
            color: 'black',
        },
        deleteButton: {
            padding: '8px 12px',
            backgroundColor: isHovering ? '#ff7875' : '#ff4d4f',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '80px',
            opacity: isDeleting ? 0.6 : 1,
        },
    };

    return (
        <>
            <div style={styles.card}>
                <div style={styles.userInfo}>
                    <img
                        src={photoSrc || 'https://via.placeholder.com/40'}
                        alt={`${userName}'s avatar`}
                        style={styles.avatar}
                    />
                    <span style={styles.userName}>{userName}</span>
                </div>
                <button
                    className="delete-user"
                    onClick={openModal}
                    disabled={isDeleting}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>

            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <div style={modalStyles.header}>
                        Are you sure you want to delete <strong>{userName}</strong>?
                    </div>
                    <div style={modalStyles.buttons}>
                        <button
                            className="delete-user"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                            className="cancel-user"
                            onClick={closeModal}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default UserDeleteCard;