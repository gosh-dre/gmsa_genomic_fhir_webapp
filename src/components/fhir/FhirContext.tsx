import { FC, useState, useEffect } from "react";
import { createContext } from "react";
import { oauth2 as SMART } from "fhirclient";
import Client from "fhirclient/lib/Client";

type clientContext = {
  client: Client | null;
  setClient: (client: Client) => void;
};

const context: clientContext = {
  client: null,
  setClient: (client: Client) => {
    context.client = client;
  },
};

interface Props {
  children: React.ReactNode;
}

export const FhirProvider: FC<Props> = (props) => {
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!client) {
      SMART.ready()
        .then((client) => {
          setClient(client);
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        })
        .finally(() => {
          console.debug("FHIR client ready");
          setError(null);
        });
    }
  }, []);

  if (error) {
    console.error(error.stack);
    return <pre>{error.message}</pre>;
  }

  return <FhirContext.Provider value={{ client: client, setClient: setClient }}>{props.children}</FhirContext.Provider>;
};

export const FhirContext = createContext(context);
