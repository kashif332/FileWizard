# FileWizard - Online File Conversion Tool

FileWizard is a comprehensive online file conversion tool built with Next.js and React. It provides multiple file conversion utilities in a user-friendly interface.

## Features

- **PDF to Image Conversion**: Convert PDF files to high-quality images in various formats
- **Image to PDF Conversion**: Combine multiple images into a single PDF document
- **Word to PDF Conversion**: Convert Word documents to PDF format
- **PDF Merging**: Combine multiple PDF files into a single document
- **OCR (Optical Character Recognition)**: Extract text from images
- **File Compression**: Reduce file sizes while maintaining quality

## Technologies Used

- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion for animations
- PDF processing libraries (pdf-lib, jsPDF, pdf-img-convert)
- Client-side file processing

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/filewizard.git
   cd filewizard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Navigate to the desired conversion tool from the homepage
2. Upload your file(s) using the file dropzone
3. Configure conversion options if available
4. Click the conversion button
5. Download the converted file

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable React components
- `/lib`: Utility functions and helpers
- `/public`: Static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.