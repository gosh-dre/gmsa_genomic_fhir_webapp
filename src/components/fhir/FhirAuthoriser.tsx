import { FC, useEffect, useState } from "react";
import { oauth2 as SMART } from "fhirclient";

import ModalWrapper from "../UI/ModalWrapper"

const FHIR_URL = process.env.REACT_APP_FHIR_URL;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

/**
 * Connects fhir back end for use in the rest of the application.
 *
 * In production, will redirect to organisation sign-in and then back to application
 * @constructor
 */
const FhirAuthoriser: FC = () => {
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  useEffect(() => {
    SMART.authorize({
      iss: FHIR_URL,
      redirectUri: "#/new_report",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    })
    .then()
    .catch((error)=> {
      console.log(error);
      setModalMessage('Something went wrong connecting to the FHIR authoriser. Please try again later.');
    })
  }, []);

  return (
    <>
      <ModalWrapper isError={true} modalMessage={modalMessage} onClear={() => setModalMessage(null)} />
      <p>Connecting to FHIR back end...</p>
    </>
  )
};

export default FhirAuthoriser;
