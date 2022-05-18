import {createContext} from "react";
import Client from "fhirclient/lib/Client";


type clientContext = {
  client: Client | null,
  setClient: (client: Client) => void;
}

const context: clientContext = {
  client: null,
  setClient: (client: Client) => {
    context.client = client
  }
};

export const FhirContext = createContext(context);
