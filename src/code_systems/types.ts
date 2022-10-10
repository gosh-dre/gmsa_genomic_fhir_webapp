import { Coding } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

/**
 * Subset of FHIR Coding Type, with all fields required.
 */
export type RequiredCoding = Required<Pick<Coding, "system" | "display" | "code">>;

export type BundleResponse = {
  entry: [
    {
      response: {
        status: string | number;
        outcome: {
          issue?: [
            {
              diagnostics: string;
            },
          ];
        };
      };
    },
  ];
};
