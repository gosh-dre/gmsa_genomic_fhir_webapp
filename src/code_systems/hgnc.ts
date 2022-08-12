export const geneCoding = (code: string, display?: string) => {
  return { code: code, display: display, system: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/" };
};

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
