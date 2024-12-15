import React from 'react';
import ReactDOM from 'react-dom';
import { UserProfile } from "../../Models/User.tsx";
import './UserCard.css';

// Modal Component using React Portal
const Modal: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => {
    let modalRoot = document.getElementById('modal-root');

    // If modal-root does not exist, create it
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', 'modal-root');
        document.body.appendChild(modalRoot);
    }

    return ReactDOM.createPortal(
        <div className="user-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        modalRoot
    );
};

interface UserCardProps {
    user: UserProfile;
}

// UserDeleteCard Component
const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = React.useState(false);

    const openDescriptionModal = () => {
        setIsDescriptionModalOpen(true);
    };

    const closeDescriptionModal = () => {
        setIsDescriptionModalOpen(false);
    };

    return (
        <>
            <div className="user-card">
                <div className="user-info" onClick={openDescriptionModal}>
                    <img
                        src={`http://localhost:5131/Uploads/${user.photoName || 'https://via.placeholder.com/50'}`}
                        alt={`${user.userName}'s avatar`}
                        className="avatar"
                    />
                    <span className="user-name">{user.userName}</span>
                </div>
            </div>

            {/* User Description Modal */}
            {isDescriptionModalOpen && (
                <Modal onClose={closeDescriptionModal}>
                    <div className="user-modal-header">
                        <strong>{user.firstName || ''} {user.lastName || ''}</strong>
                    </div>
                    <div style={{ textAlign: 'left', marginBottom: '16px' }}>
                        <p><strong>Username:</strong> {user.userName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                        {user.dateOfBirth && <p><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>}
                        {user.phoneNumber && <p><strong>Phone:</strong> {user.phoneNumber}</p>}
                    </div>
                    <div className="user-modal-buttons">
                        <button
                            className="user-cancel-button"
                            onClick={closeDescriptionModal}
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default UserCard;
