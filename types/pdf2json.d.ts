declare module "pdf2json" {
  class PDFParser {
    constructor(context: null, verbosity: boolean);
    on(event: "pdfParser_dataReady", callback: () => void): void;
    on(
      event: "pdfParser_dataError",
      callback: (err: { parserError: string }) => void,
    ): void;
    parseBuffer(buffer: Buffer): void;
    getRawTextContent(): string;
  }

  export default PDFParser;
}
