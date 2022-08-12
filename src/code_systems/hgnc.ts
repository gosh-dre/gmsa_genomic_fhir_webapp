const geneCoding = (code: string, display?: string) => {
  return { code: code, display: display, system: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/" };
};

export default geneCoding;
