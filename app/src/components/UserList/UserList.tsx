import { useEffect, useState } from 'react';
import UserCard from "../UserCard/UserCard";
import { UserProfile } from "../../Models/User";
import { GetUsersByPartyIdAPI } from '../../Services/UserService';

interface UserDeleteListProps {
    partyId: string | undefined;
    token: string | null;
}

export function UserList({ partyId, token }: UserDeleteListProps) {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
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


    if (isLoading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="space-y-4">
            {users.length === 0 ? (
                <div className="no-users-container" style={{

                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // height: 100vh; /* Adjust to your container height */
                    textAlign: 'center'




                }}>
                    <p style={{fontSize : '16px'}}>No users available.</p>
                </div>

            ) : (
                users.map((user) => (
                    <UserCard
                        key={user.userName}
                        user={user}
                    />
                ))
            )}
        </div>
    );
}
