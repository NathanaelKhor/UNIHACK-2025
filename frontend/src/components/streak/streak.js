import React, {useState} from "react";
import "./streak.css";
import {Card, CardContent} from "../ui/card/card";
import {useUser} from "../../context/UserContext";
import streak from "../assets/streak.png";

const Streak = () => {
    const {user, setUser} = useUser()

    return (
        <div className="container">
            <Card>
            <CardContent className="card-content">
            <h2 className="title">Your streak is {user?.streak || 0}!</h2>
            <div className="streak">
                    <a href="/">
                        <img src={streak} alt="Streak" />
                    </a>
            </div>
            {
                user?.streak > 5 ? 
                <p>Keep spreading goodness!</p>
                :
                <p>Time to spread some more goodness!</p>
            }
            </CardContent>
            </Card>
        </div>
    )
}

export default Streak
