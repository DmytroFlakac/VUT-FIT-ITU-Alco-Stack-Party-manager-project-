// UserListPopUp.tsx
import React from 'react';
import {UserList} from "../UserList/UserList.tsx";
import './UserListPopUp.css'; // Ensure this path is correct based on your project structure

interface UserListPopUpProps {
    partyId: string | undefined;
    token: string | null;
    show: boolean;
    onClose: () => void;
}

const UserListPopUp: React.FC<UserListPopUpProps> = ({
                                                         partyId,
                                                         token,
                                                         show,
                                                         onClose,
                                                     }) => {
    if (!show) return null;

    return (
        <div className="userlist-backdrop-blur" onClick={onClose}>
            <div
                className="userlist-settings-container"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
            >
                <div className="userlist-header">
                    Users
                </div>
                <div className="userlist-body">
                    <UserList partyId={partyId} token={token} />
                </div>
                <button
                    onClick={onClose}
                    className="userlist-footer"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default UserListPopUp;
