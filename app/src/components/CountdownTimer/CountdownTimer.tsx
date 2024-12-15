import React, { useEffect, useState } from "react";
import timerBackground from "../../assets/timer.svg"; // Импортируем фон таймера
import "./CountdownTimer.css";

type CountdownTimerProps = {
    preparationDate: string; // The preparation date to count down to
    eventDate: string; // The main event date
    onTimerComplete: (state: "DEFAULT" | "PREPARATION" | "EXTRA_DAY" | "FINAL") => void; // Callback on timer reset
    //allowAlcoholUpdate: boolean; // Controls alcohol ranking updates
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
                                                           preparationDate,
                                                           eventDate,
                                                           onTimerComplete,
                                                       }) => {
    const [targetDate, setTargetDate] = useState(new Date(preparationDate));
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [currentState, setCurrentState] = useState<"DEFAULT" | "PREPARATION" | "EXTRA_DAY" | "FINAL">(
        "DEFAULT"
    );

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            console.log("current state", currentState);
            if (difference <= 0) {
                if (currentState === "DEFAULT") {
                    console.log("Switching to PREPARATION state.");
                    setTargetDate(new Date(preparationDate));
                    setCurrentState("PREPARATION");
                    onTimerComplete("PREPARATION");
                } else if (currentState === "PREPARATION") {
                    console.log("Switching to EXTRA_DAY state.");
                    // const nextTarget = new Date(targetDate.getTime() + 1 * 60 * 60 * 1000); 1hour
                    const nextTarget = new Date(targetDate.getTime() + 10*60 * 1000);  // 1minute
                    // const nextTarget = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours

                    setTargetDate(nextTarget);
                    setCurrentState("EXTRA_DAY");
                    onTimerComplete("EXTRA_DAY");
                } else if (currentState === "EXTRA_DAY") {
                    console.log("Switching to FINAL state.");
                    setTargetDate(new Date(eventDate));
                    setCurrentState("FINAL");
                    onTimerComplete("FINAL");
                } else {
                    console.log("Final state reached.");
                    onTimerComplete("FINAL");
                }
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft(
                `${days}:${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            );
        };

        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [targetDate, currentState, onTimerComplete]);

    return (
        <div className="timer-container">
            <img src={timerBackground} alt="Timer Background" className="timer-background"/>
            <div className="timer-content">
                {timeLeft.split(":").map((time, index) => (
                    <div key={index} className="timer-segment">
                        <span className={`timer-number timer-number-${index + 1}`}>{time}</span>

                    </div>
                ))}
            </div>
        </div>

    );
};


export default CountdownTimer;
