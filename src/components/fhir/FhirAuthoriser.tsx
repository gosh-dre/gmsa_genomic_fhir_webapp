import { FC, useEffect } from "react";
import { oauth2 as SMART } from "fhirclient";

const FHIR_URL = process.env.REACT_APP_FHIR_URL;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

/**
 * Connects fhir back end for use in the rest of the application.
 *
 * In a real application this would be used after user login.
 * @constructor
 */
const FhirAuthoriser: FC = () => {

  useEffect(() => {
    SMART.authorize({
      iss: FHIR_URL,
      // temporarily using as this is what the synthetic FHIR server has been setup with
      redirectUri: "./recv_redirect",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }).then();
  }, []);

  return <p>Connecting to FHIR back end...</p>;

};

export default FhirAuthoriser;
