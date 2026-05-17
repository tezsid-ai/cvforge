import PDFParser from "pdf2json";

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);

    pdfParser.on("pdfParser_dataError", (err: { parserError: string }) => {
      reject(new Error(err.parserError));
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const text = (pdfParser as any).getRawTextContent();
      if (!text || text.trim().length < 20) {
        reject(
          new Error("PDF appears to be empty or image-based (scanned PDF)"),
        );
      } else {
        resolve(text.trim());
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}
