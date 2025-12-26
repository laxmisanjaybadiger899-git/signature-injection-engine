import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import FieldBox from "./FieldBox";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function App() {
  const PDF_WIDTH = 600;
  const PDF_HEIGHT = 842;

  const [fields, setFields] = useState([]);

  function addField(type) {
    setFields(f => [
      ...f,
      {
        id: crypto.randomUUID(),
        type,
        xPercent: 0.2,
        yPercent: 0.2,
        wPercent: 0.25,
        hPercent: 0.12,
        value: "",
        checked: false,
        image: null,
      },
    ]);
  }

  function updateField(updated) {
    setFields(f => f.map(x => (x.id === updated.id ? updated : x)));
  }

  async function signPdf() {
    await fetch("http://localhost:5000/sign-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    alert("PDF Generated");
  }

  return (
    <div style={{ padding: 20 }}>
      <div>
        <button onClick={() => addField("signature")}>Signature</button>
        <button onClick={() => addField("text")}>Text</button>
        <button onClick={() => addField("date")}>Date</button>
        <button onClick={() => addField("image")}>Image</button>
        <button onClick={() => addField("radio")}>Radio</button>
      </div>

      <div style={{ width: PDF_WIDTH, position: "relative", border: "1px solid black" }}>
        <Document file="/sample.pdf">
          <Page pageNumber={1} width={PDF_WIDTH} renderTextLayer={false} />
        </Document>

        {fields.map(f => (
          <FieldBox
            key={f.id}
            field={f}
            pdfWidth={PDF_WIDTH}
            pdfHeight={PDF_HEIGHT}
            onUpdate={updateField}
          />
        ))}
      </div>

      <button onClick={signPdf}>Sign & Generate PDF</button>
    </div>
  );
}
