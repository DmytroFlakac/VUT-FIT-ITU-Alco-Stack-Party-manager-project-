import React from 'react';
import Disco from '../../assets/disco.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import backgroundImage from '../../assets/backgroundFinal.svg';
import homeIcon from '../../assets/Home.svg';
// import CustomVideoPlayer from '../../components/CustomVideoPlayer/CustomVideoPlayer.tsx';
import './WelcomePage.css';
const WelcomePage: React.FC = () => {
    const isMobile = window.innerWidth <= 768;

    return (
        <div className="container-fluid-welcome d-flex p-0 full-height-welcome"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
                 backgroundSize: 'cover',

             }}>
            <div className="video-left flex-grow-1"></div>

            <div
                className="container-fluid p-0 d-flex flex-column align-items-center custom-background square-container-welcome flex-grow-7">
                <div>
                    <img
                        src={Disco}
                        alt="Party Icon"
                        className="party-icon-welcome"
                    />

                    <Link
                        to="/home"
                        className="home-link-welcome"
                        aria-label="Go to Homepage"
                    >
                        <img
                            src={homeIcon}
                            alt="Home Icon"
                            className="home-icon-welcome"
                        />
                        <span className="home-text-welcome">Home</span>
                    </Link>
                </div>

                {/* Positioning the heading absolutely */}
                <h2 className="text-2xl md:text-4xl lg:text-5xl m-1 mt-0 mb-2 text-center-welcome"
                    style={{
                        position: 'absolute', // Use absolute positioning
                        top: '-110px', // Adjust this value to position it higher
                        left: '50%', // Center horizontally
                        transform: 'translateX(-50%)', // Correct horizontal alignment
                        zIndex: 10,
                        whiteSpace: 'nowrap' // Prevent text from wrapping
                    }}>
                    WELCOME TO ALKO STACK!!!
                </h2>

                <p className="text-sm md:text-xl lg:text-2xl m-5 mt-3 welcome-to-party">
                    Hey there, party animal! 🎉 Ready for a night of unforgettable memories and maybe a few questionable
                    decisions? Alko Stack turns planning a party into a personal fiesta!
                    <br/><br/>
                    Your Party, Your Rules Ever wish you could magically create a party? We’ve got the next best thing:
                    a personalized party form that makes you the star! Whether you're a Margarita maestro or a Beer pong
                    legend, fill out your details, and let Alko Stack craft the perfect bash just for you. It’s like
                    having a party planner in your pocket!
                    <br/><br/>
                    Create and Invite: The More, The Merrier! Creating a party on Alko Stack is as easy as popping a
                    bottle of bubbly. Just a few taps, and voilà – you’ve got a shindig! Invite your friends, frenemies,
                    and that cool neighbor who never complains. Your guests can RSVP with a single tap, so you’ll know
                    who’s joining the fun.
                    <br/><br/>
                    So, what are you waiting for? Dive into Alko Stack and let’s get this party started! The best nights
                    are the ones you can't remember, with the people you won’t forget. Cheers! 🍻
                </p>
            </div>
        </div>
    );
};

export default WelcomePage;
