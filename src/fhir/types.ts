import { fhirclient } from "fhirclient/lib/types";
import RequestOptions = fhirclient.RequestOptions;

export type FhirRequest = Required<Pick<RequestOptions, "body" | "headers" | "method" | "url">>;
