import {FC} from "react";
import {oauth2 as SMART} from "fhirclient";

const FHIR_URL = process.env.REACT_APP_FHIR_URL;

/**
 * Connects fhir back end for use in the rest of the application.
 *
 * In a real application this would be used after user login.
 * @constructor
 */
const FhirAuthoriser: FC = () => {

  const connect = async () => {
    await SMART.authorize({
      // fhirServiceUrl bypasses authentication so can use this for an open api
      fhirServiceUrl: FHIR_URL,
      redirectUri: "./add_report"
    })
  }

  connect().then();

  return <p>Connecting to FHIR back end...</p>;

}

export default FhirAuthoriser;
