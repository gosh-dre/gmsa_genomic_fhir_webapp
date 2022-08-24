import { RequiredCoding } from "./types";

/**
 * Create FHIR Coding object from gene information
 * @param code Gene code
 * @param symbol Gene symbol
 */
export const geneCoding = (code: string, symbol?: string): RequiredCoding => {
  return {
    code: code,
    display: symbol || code,
    system: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/",
  };
};

/**
 * Query REST API for gene names and codes.
 * @param geneQuery query string for gene, requires a match at the start of the gene symbol
 */
export const queryHgnc = async (geneQuery: string) => {
  if (geneQuery.trim() === "") {
    return { hgncs: [], symbols: [] };
  }
  const response = await fetch(
    `https://clinicaltables.nlm.nih.gov/api/genes/v4/search?terms=${geneQuery}&df=symbol&q=symbol:${geneQuery}*`,
  );
  const body = await response.json();
  return { hgncs: body.at(1) as string[], symbols: body.at(3) as string[] };
};
