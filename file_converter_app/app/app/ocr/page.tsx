"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileSearch, Download, Info, Copy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileDropzone from "@/components/file-dropzone";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OcrPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setExtractedText("");
    setError(null);
  };

  const processOcr = async () => {
    if (files.length === 0) {
      setError("Kripya pehle ek image select karein");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setExtractedText("");

    try {
      // For demonstration purposes, we'll show a message about OCR limitations
      // In a real implementation, you would use a server endpoint or a commercial OCR library
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setError("OCR processing ke liye server-side implementation ki zaroorat hai. Abhi ye feature development mein hai.");
      
      // Sample text for demonstration
      setExtractedText("This is a sample extracted text. In a real implementation, the text would be extracted from the uploaded image using OCR technology. The quality of extraction depends on the clarity of the image and the OCR engine used.");
      
    } catch (err) {
      console.error("Error processing OCR:", err);
      setError("Image se text extract karne mein error aaya hai");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted_text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <h1 className="text-4xl font-bold mb-4">OCR (Optical Character Recognition)</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Images se text extract karein using OCR technology. Scanned documents, photos, aur screenshots se text nikaalein.
        </p>
      </motion.div>

      <Alert className="mb-8">
        <FileSearch className="h-4 w-4" />
        <AlertTitle>Development Notice</AlertTitle>
        <AlertDescription>
          OCR feature abhi development mein hai. Jald hi full functionality available hogi.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FileSearch className="mr-2 h-6 w-6 text-primary" />
              Image Upload Karein
            </h2>
            
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              acceptedFileTypes={[
                ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff",
                "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff"
              ]}
              maxFiles={1}
              multiple={false}
              fileTypeDescription="Image (JPG, PNG, etc.)"
            />

            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                  <Image
                    src={URL.createObjectURL(files[0])}
                    alt="Uploaded image"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="mt-6">
                  <Button
                    onClick={processOcr}
                    disabled={isProcessing || files.length === 0}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>Extract Text</>
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
              <FileText className="mr-2 h-6 w-6 text-primary" />
              Extracted Text
            </h2>

            {extractedText ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Tabs defaultValue="preview">
                  <TabsList className="w-full">
                    <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                    <TabsTrigger value="raw" className="flex-1">Raw Text</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="preview" className="mt-4">
                    <div className="bg-muted/50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                      <p className="whitespace-pre-wrap">{extractedText}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="raw" className="mt-4">
                    <div className="bg-muted/50 rounded-lg p-4 max-h-[400px] overflow-y-auto font-mono text-sm">
                      <pre>{extractedText}</pre>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    className="flex-1"
                    variant="outline"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Text
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={downloadText}
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Text
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {isProcessing
                    ? "Processing..."
                    : files.length > 0
                    ? "Extract button par click karein"
                    : "Extracted text yahan dikhega"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 bg-muted/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">OCR ke baare mein</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Images se text extract karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Multiple languages support</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>High accuracy text recognition</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Text ko copy aur download karein</p>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-4">Use Cases</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Scanned documents se text extract karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Business cards aur receipts se information nikaalein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Books aur articles ko digitize karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Screenshots se text copy karein</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}