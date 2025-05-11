"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileText, Download, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileDropzone from "@/components/file-dropzone";
import { downloadFile } from "@/lib/utils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export default function WordToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setPdfUrl(null);
    setError(null);
  };

  const convertWordToPdf = async () => {
    if (files.length === 0) {
      setError("Kripya pehle ek Word document select karein");
      return;
    }

    setIsConverting(true);
    setError(null);
    setPdfUrl(null);

    try {
      // For demonstration purposes, we'll show a message about server-side conversion
      // In a real implementation, you would use a server endpoint or a commercial library
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setError("Word to PDF conversion ke liye server-side processing ki zaroorat hai. Abhi ye feature development mein hai.");
      
    } catch (err) {
      console.error("Error converting Word to PDF:", err);
      setError("Word document ko PDF mein convert karne mein error aaya hai");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      fetch(pdfUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const fileName = files[0].name.replace(/\.(docx|doc)$/i, ".pdf");
          downloadFile(blob, fileName);
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Word to PDF Converter</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Apne Word documents (DOCX, DOC) ko high-quality PDF files mein convert karein.
        </p>
      </motion.div>

      <Alert className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          Word to PDF conversion ke liye advanced processing ki zaroorat hoti hai. Is feature par hum abhi kaam kar rahe hain.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FileText className="mr-2 h-6 w-6 text-primary" />
              Word Document Upload Karein
            </h2>
            
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              acceptedFileTypes={[
                ".docx", ".doc",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/msword"
              ]}
              maxFiles={1}
              multiple={false}
              fileTypeDescription="Word Document (DOCX, DOC)"
            />

            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div className="mt-6">
                  <Button
                    onClick={convertWordToPdf}
                    disabled={isConverting || files.length === 0}
                    className="w-full"
                  >
                    {isConverting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                        Converting...
                      </>
                    ) : (
                      <>Convert to PDF</>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center"
              >
                <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-card rounded-xl shadow-sm p-6 sticky top-20">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Download className="mr-2 h-6 w-6 text-primary" />
              Converted PDF
            </h2>

            {pdfUrl ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                    title="Converted PDF"
                  />
                </div>

                <Button
                  onClick={downloadPdf}
                  className="w-full mt-4"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {isConverting
                    ? "Converting..."
                    : files.length > 0
                    ? "Convert button par click karein"
                    : "Converted PDF yahan dikhega"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 bg-muted/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Word to PDF Conversion ke baare mein</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>High-fidelity conversion with formatting preservation</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Support for DOCX and DOC formats</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Tables, images, aur formatting ko maintain karta hai</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Fast and efficient conversion process</p>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-4">Use Cases</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Business documents ko PDF format mein share karne ke liye</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Resumes aur cover letters ko professional PDF mein convert karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Reports aur proposals ko universal format mein convert karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Academic papers aur research documents ko PDF mein preserve karein</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}