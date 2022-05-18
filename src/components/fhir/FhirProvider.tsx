import {oauth2 as SMART} from "fhirclient";
import {FC, useState} from "react";
import {FhirContext} from "./FhirContext";
import Client from "fhirclient/lib/Client";

const FhirProvider: FC<any> = ({children}) => {
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const setClientOrError = (client: Client | null) => {
    if (!client) {
      SMART.ready()
        .then((client) => setClient(client))
        .catch((error) => setError(error))
        .finally(() => console.debug("FHIR client ready"))
    }
  };

  if (error) {
    console.error(error.stack);
    return <pre>{error.message}</pre>;
  }

  return (
    <FhirContext.Provider value={{client: client, setClient: setClient}}>
      <FhirContext.Consumer>
        {({client}) => {
          setClientOrError(client)
          return children;
        }}
      </FhirContext.Consumer>
    </FhirContext.Provider>
  );
}


export default FhirProvider;
