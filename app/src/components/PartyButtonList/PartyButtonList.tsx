import React from 'react';
import PartyButton from '../PartyButton/PartyButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PartyButtonList.css';
import party_button from "../../assets/your party.svg";

interface PartyButtonListProps {
    parties: {
        partyId: string;
        name: string;
        description: string;
        date: string;
        createdByMe: boolean;
    }[];
}

const PartyButtonList: React.FC<PartyButtonListProps> = ({ parties }) => {
    return (
        <div className="w-
        100"   style={{
            width: '600px'
        }}>
            {/* Заголовок поза скрол-контейнером */}
            <div className="party-header"
            style={{backgroundImage: `url(${party_button})`,backgroundSize: "cover",
                width: '600px', height: '60px'
            }}></div>

            {/* Скрол-контейнер для списку партій */}
            <div className="scroll-container ">
                <div className="list-group ">
                    {parties.map((party, index) => (
                        <PartyButton
                            key={index}
                            partyId={party.partyId}
                            name={party.name}
                            description={party.description}
                            date={party.date}
                            createdByMe={party.createdByMe}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PartyButtonList;
