import { useState } from "react";

function FieldBox({ field, pdfWidth, pdfHeight, onUpdate }) {
  const [isResizing, setIsResizing] = useState(false);

  function handleMouseDown(e) {
    // ❗ DO NOT drag when clicking inputs
    if (e.target.tagName === "INPUT") return;

    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;

    const startXPx = field.xPercent * pdfWidth;
    const startYPx = field.yPercent * pdfHeight;
    const startWPx = field.wPercent * pdfWidth;
    const startHPx = field.hPercent * pdfHeight;

    function onMouseMove(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let updated;

      if (isResizing) {
        updated = {
          ...field,
          wPercent: Math.min(
            Math.max((startWPx + dx) / pdfWidth, 0.05),
            1 - field.xPercent
          ),
          hPercent: Math.min(
            Math.max((startHPx + dy) / pdfHeight, 0.05),
            1 - field.yPercent
          ),
        };
      } else {
        updated = {
          ...field,
          xPercent: Math.min(
            Math.max((startXPx + dx) / pdfWidth, 0),
            1 - field.wPercent
          ),
          yPercent: Math.min(
            Math.max((startYPx + dy) / pdfHeight, 0),
            1 - field.hPercent
          ),
        };
      }

      onUpdate(updated);
    }

    function onMouseUp() {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function renderField() {
    // SIGNATURE & IMAGE
    if (field.type === "signature" || field.type === "image") {
      return field.image ? (
        <img
          src={field.image}
          alt="uploaded"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const reader = new FileReader();
            reader.onload = () =>
              onUpdate({ ...field, image: reader.result });
            reader.readAsDataURL(e.target.files[0]);
          }}
        />
      );
    }

    // TEXT
    if (field.type === "text") {
      return (
        <input
          type="text"
          value={field.value}
          placeholder="Enter text"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) =>
            onUpdate({ ...field, value: e.target.value })
          }
          style={{ width: "100%" }}
        />
      );
    }

    // DATE
    if (field.type === "date") {
      return (
        <input
          type="date"
          value={field.value}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) =>
            onUpdate({ ...field, value: e.target.value })
          }
          style={{ width: "100%" }}
        />
      );
    }

    // RADIO
    if (field.type === "radio") {
      return (
        <input
          type="radio"
          checked={field.checked}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) =>
            onUpdate({ ...field, checked: e.target.checked })
          }
        />
      );
    }

    return null;
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: field.xPercent * pdfWidth,
        top: field.yPercent * pdfHeight,
        width: field.wPercent * pdfWidth,
        height: field.hPercent * pdfHeight,
        border: "2px dashed blue",
        background: "rgba(0,0,255,0.05)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        fontSize: 12,
      }}
    >
      {renderField()}

      {/* Resize Handle */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsResizing(true);
        }}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 10,
          height: 10,
          background: "blue",
          cursor: "nwse-resize",
        }}
      />
    </div>
  );
}

export default FieldBox;
