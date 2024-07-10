import React, { useContext } from "react";
import Card from "./Card";

import "./LandingPage.css";
import Button from "../FormElements/Button";
import { AuthContext } from "../../context/auth-context";

const LandingPage = () => {
    const auth = useContext(AuthContext);
    return (
        <Card className="landingPageContainer">
            <div className="header1">
                <h1>Discover the World with Us</h1>
                <h1>Your Adventure Begins Here</h1>
            </div>
            <div className="header3">
                <h3>Join a community of explorers and storytellers</h3>
                <h3>Share your journeys, uncover hidden gems, and</h3>
                <h3>inspire others.</h3>
            </div>
            <div className="header5">
                <h5>"The world is a book,</h5>
                <h5>and those who do not travel read only one page."</h5>
            </div>
            <div className="landingPage-btns">
                <Button to={auth.isLoggedIn ? "/users" : "/auth"}>
                    Explore
                </Button>
            </div>
        </Card>
    );
};

export default LandingPage;
