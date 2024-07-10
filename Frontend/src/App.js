import React, { Suspense } from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom";

// import User from "./user/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const User = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const LandingPage = React.lazy(() =>
    import("./shared/components/UIElements/LandingPage")
);

const App = () => {
    const { token, login, logout, userId } = useAuth();

    let routes;

    if (token) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <LandingPage />
                </Route>
                <Route path="/users" exact>
                    <User />
                </Route>
                <Route path="/:userId/places" exact>
                    {" "}
                    {/* userId is just written for useParams*/}
                    <UserPlaces />
                </Route>
                <Route path="/places/new">
                    <NewPlace />
                </Route>
                <Route path="/places/:placeId">
                    <UpdatePlace />
                </Route>
                <Redirect to="/users" />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <LandingPage />
                </Route>
                <Route path="/users" exact>
                    <User />
                </Route>
                <Route path="/:userId/places" exact>
                    {" "}
                    {/* userId is just written for useParams*/}
                    <UserPlaces />
                </Route>
                <Route path="/auth">
                    <Auth />
                </Route>
                <Redirect to="/auth" />
            </Switch>
        );
    }

    return (
        <>
            <AuthContext.Provider
                value={{
                    isLoggedIn: !!token,
                    token: token,
                    userId: userId,
                    login: login, // here you are providing login in auth-hook to authContext
                    logout: logout, // similar
                }}
            >
                <Router>
                    <MainNavigation />
                    <main>
                        <Suspense
                            fallback={
                                <div className="center">
                                    <LoadingSpinner />
                                </div>
                            }
                        >
                            {routes}
                        </Suspense>
                    </main>
                </Router>
            </AuthContext.Provider>
        </>
    );
};

export default App;
