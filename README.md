
# Signature Injection Engine 

A full-stack prototype that allows users to place signature, text, date, image, and radio fields on a PDF document in a responsive web editor and permanently burn those fields into the final signed PDF with an audit trail.

This project is built as part of a Full Stack Developer (MERN) internship assignment.



## 🚀 Tech Stack

Frontend: React.js, react-pdf  
Backend: Node.js, Express.js  
PDF Processing: pdf-lib  
Database: MongoDB Atlas  
Security: SHA-256 Hashing  


## 🧠 Problem Solved

Browsers and PDFs use different coordinate systems.

Browser:
- CSS pixels
- Top-left origin
- Responsive

PDF:
- Points (72 DPI)
- Bottom-left origin
- Static

This project solves the problem by storing **all field positions as percentages relative to the PDF size**, making placement responsive and device-independent.



## 🛠 Features

### Frontend
- Render A4 PDF using react-pdf
- Drag & drop fields:
  - Signature
  - Text
  - Date
  - Image
  - Radio
- Resize fields
- Responsive placement (desktop → mobile safe)
- Live preview before signing

### Backend
- POST `/sign-pdf`
- Burns all fields permanently into the PDF
- Accurate coordinate conversion
- Signature/image aspect ratio preserved
- Generates signed PDF

### Security (Audit Trail)
- SHA-256 hash before signing
- SHA-256 hash after signing
- Hashes stored in MongoDB



## 📐 Coordinate Mapping Logic

Frontend stores:
xPercent = x / pdfWidth
yPercent = y / pdfHeight
wPercent = width / pdfWidth
hPercent = height / pdfHeight



Backend converts:
x = xPercent * pageWidth
y = pageHeight - (yPercent + hPercent) * pageHeight


This ensures accurate placement across all screen sizes.



## 🖊 Aspect Ratio Handling

Signature and image fields are scaled using:
scale = min(boxWidth / imageWidth, boxHeight / imageHeight)


This prevents stretching and keeps the image centered.



## 📂 Project Structure

signature-injection-engine


1.backend
- server.js
- sample.pdf
- signed.pdf
- package.json
  
2.frontend
- src
- App.js
- FieldBox.js


## 📜 Assumptions

- Single-page A4 PDF for prototype
- Signature uploaded as image
- Focus on correctness over UI polish



## 🎥 Walkthrough

The walkthrough demonstrates:
- Responsive drag & drop behavior
- Coordinate conversion logic
- PDF burn-in process
- SHA-256 audit trail generation

