import { FC, useEffect, useState } from "react";
import { oauth2 as SMART } from "fhirclient";

import LoadingSpinner from "../UI/LoadingSpinner";
import ModalWrapper from "../UI/ModalWrapper";
import { ModalState } from "../UI/ModalWrapper";

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
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);

  useEffect(() => {
    setIsLoading(true);

    SMART.authorize({
      iss: FHIR_URL,
      redirectUri: "#/new_report",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    })
      .then()
      .catch((error) => {
        console.log(error);
        setModal({
          message: "Something went wrong connecting to the FHIR authoriser. Please try again later.",
          isError: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay message={"Connecting to FHIR back end..."} />}
      <ModalWrapper isError={modal?.isError} modalMessage={modal?.message} onClear={() => setModal(null)} />

      <p>Connecting to FHIR back end...</p>
    </>
  );
};

export default FhirAuthoriser;
