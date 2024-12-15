import { useEffect, useState } from 'react';
import { RemoveUserFromPartyAPI } from "../../Services/PartyService";
import UserDeleteCard from "../UserDeleteCard/UserDeleteCard";
import { UserProfile } from "../../Models/User";
import { GetUsersByPartyIdAPI } from '../../Services/UserService';
import './UserDeleteList.css';
import {Bounce, toast} from "react-toastify";

interface UserDeleteListProps {
    partyId: string | undefined;
    token: string | null;
}

export function UserDeleteList({ partyId, token }: UserDeleteListProps) {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        console.log("users", users, partyId, token);
        if (!partyId || !token) {
            setUsers([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const fetchedUsers = await GetUsersByPartyIdAPI(partyId, token);


            setUsers(fetchedUsers);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [partyId, token]); // Added dependencies to refetch when partyId or token changes

    const handleDeleteUser = async (userName: string) => {
        try {
            await RemoveUserFromPartyAPI(partyId!, userName, token);
            await fetchUsers();
            console.log(`User ${userName} deleted successfully`);
        } catch (err) {
            console.error('Failed to remove user from party:', err);
            // alert(`Failed to remove ${userName} from party. Please try again.`);
            toast.error(`Failed to remove ${userName} from party. Please try again.`,{
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

    if (isLoading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="user-list-container">
            {users.length === 0 ? (
                <p>No users available.</p>
            ) : (
                <div className="user-list">
                    {users.map((user) => (
                        <UserDeleteCard
                            key={user.userName}
                            userName={user.userName}
                            photoSrc={"http://localhost:5131/Uploads/" + user.photoName}
                            onDelete={() => handleDeleteUser(user.userName)}
                        />
                    ))}
                </div>
            )}
        </div>
    );

}