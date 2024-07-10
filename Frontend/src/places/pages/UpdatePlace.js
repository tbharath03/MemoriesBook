import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Card from "../../shared/components/UIElements/Card";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";

import "./PlaceForm.css";

const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [identifiedPlace, setIdentifiedPlace] = useState();
    const placeId = useParams().placeId;

    // const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
            address: {
                value: "",
                isValid: false,
            },
            coordinate_lat: {
                value: "",
                isValid: false,
            },
            coordinate_lng: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responeData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
                );
                setIdentifiedPlace(responeData.place);
                setFormData(
                    {
                        title: {
                            value: responeData.place.title,
                            isValid: true,
                        },
                        description: {
                            value: responeData.place.description,
                            isValid: true,
                        },
                        address: {
                            value: responeData.place.address,
                            isValid: true,
                        },
                        coordinate_lat: {
                            value: responeData.place.location.lat,
                            isValid: true,
                        },
                        coordinate_lng: {
                            value: responeData.place.location.lng,
                            isValid: true,
                        },
                    },
                    true
                );
            } catch (err) {}
        };
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);

    const history = useHistory();
    const placeUpdateSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                "PATCH",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    address: formState.inputs.address.value,
                    coordinate_lat: formState.inputs.coordinate_lat.value,
                    coordinate_lng: formState.inputs.coordinate_lng.value,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push("/" + auth.userId + "/places");
        } catch (err) {}
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!identifiedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && identifiedPlace && (
                <form
                    className="place-form"
                    onSubmit={placeUpdateSubmitHandler}
                >
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title!"
                        onInput={inputHandler}
                        initialValue={identifiedPlace.title}
                        initialValid={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description(atleat 5 characters)!"
                        onInput={inputHandler}
                        initialValue={identifiedPlace.description}
                        initialValid={true}
                    />
                    <Input
                        id="address"
                        element="input"
                        type="text"
                        label="Address"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid address!"
                        onInput={inputHandler}
                        initialValue={identifiedPlace.address}
                        initialValid={true}
                    />
                    <Input
                        id="coordinate_lat"
                        element="input"
                        type="text"
                        label="latitude"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid latitude!"
                        onInput={inputHandler}
                        initialValue={identifiedPlace.location.lat}
                        initialValid={true}
                    />
                    <Input
                        id="coordinate_lng"
                        element="input"
                        type="text"
                        label="longitude"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid longitude!"
                        onInput={inputHandler}
                        initialValue={identifiedPlace.location.lng}
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
                    </Button>
                </form>
            )}
        </>
    );
};
export default UpdatePlace;
