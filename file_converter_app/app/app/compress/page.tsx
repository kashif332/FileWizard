"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileDown, Download, Settings, Info, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileDropzone from "@/components/file-dropzone";
import { downloadFile, formatFileSize } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedFileUrl, setCompressedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compressionLevel, setCompressionLevel] = useState([50]);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [activeTab, setActiveTab] = useState("image");

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setCompressedFileUrl(null);
    setError(null);
    setOriginalSize(selectedFiles.length > 0 ? selectedFiles[0].size : 0);
    setCompressedSize(0);
  };

  const compressImage = async () => {
    if (files.length === 0) {
      setError("Kripya pehle ek file select karein");
      return;
    }

    setIsCompressing(true);
    setError(null);
    setCompressedFileUrl(null);

    try {
      const file = files[0];
      
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        setError("Sirf image files compress kar sakte hain");
        setIsCompressing(false);
        return;
      }
      
      // Create an image element
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          // Create a canvas element
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          // Calculate new dimensions (maintain aspect ratio)
          const maxWidth = 1920;
          const maxHeight = 1080;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
          }
          
          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert canvas to blob with quality setting
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create URL for the compressed image
                const url = URL.createObjectURL(blob);
                setCompressedFileUrl(url);
                setCompressedSize(blob.size);
              } else {
                setError("Image compression mein error aaya hai");
              }
              resolve();
            },
            file.type,
            compressionLevel[0] / 100
          );
        };
        
        img.onerror = () => {
          setError("Image load karne mein error aaya hai");
          resolve();
        };
      });
      
    } catch (err) {
      console.error("Error compressing file:", err);
      setError("File ko compress karne mein error aaya hai");
    } finally {
      setIsCompressing(false);
    }
  };

  const compressPdf = async () => {
    setError("PDF compression ke liye server-side processing ki zaroorat hai. Abhi ye feature development mein hai.");
    setIsCompressing(false);
  };

  const handleCompress = () => {
    if (activeTab === "image") {
      compressImage();
    } else {
      compressPdf();
    }
  };

  const downloadCompressedFile = () => {
    if (compressedFileUrl) {
      fetch(compressedFileUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const fileName = `compressed_${files[0].name}`;
          downloadFile(blob, fileName);
        });
    }
  };

  const calculateSavings = () => {
    if (originalSize > 0 && compressedSize > 0) {
      const savedBytes = originalSize - compressedSize;
      const savingsPercentage = Math.round((savedBytes / originalSize) * 100);
      return {
        savedBytes: formatFileSize(savedBytes),
        savingsPercentage,
      };
    }
    return { savedBytes: "0 B", savingsPercentage: 0 };
  };

  const { savedBytes, savingsPercentage } = calculateSavings();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">File Compression</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Images aur PDF files ka size reduce karein without significant quality loss. Compressed files ko easily share karein.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FileDown className="mr-2 h-6 w-6 text-primary" />
              File Compression
            </h2>
            
            <Tabs 
              defaultValue="image" 
              className="mb-6"
              onValueChange={(value) => {
                setActiveTab(value);
                setFiles([]);
                setCompressedFileUrl(null);
                setError(null);
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="image" className="flex-1">
                  <Image className="h-4 w-4 mr-2" />
                  Image Compression
                </TabsTrigger>
                <TabsTrigger value="pdf" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Compression
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="image" className="mt-4">
                <FileDropzone
                  onFilesSelected={handleFilesSelected}
                  acceptedFileTypes={[
                    ".jpg", ".jpeg", ".png", ".webp",
                    "image/jpeg", "image/png", "image/webp"
                  ]}
                  maxFiles={1}
                  multiple={false}
                  fileTypeDescription="Image (JPG, PNG, WebP)"
                />
              </TabsContent>
              
              <TabsContent value="pdf" className="mt-4">
                <Alert className="mb-4">
                  <FileDown className="h-4 w-4" />
                  <AlertTitle>Development Notice</AlertTitle>
                  <AlertDescription>
                    PDF compression feature abhi development mein hai. Jald hi available hogi.
                  </AlertDescription>
                </Alert>
                
                <FileDropzone
                  onFilesSelected={handleFilesSelected}
                  acceptedFileTypes={[".pdf", "application/pdf"]}
                  maxFiles={1}
                  multiple={false}
                  fileTypeDescription="PDF"
                />
              </TabsContent>
            </Tabs>

            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  Compression Options
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label>Compression Level ({compressionLevel}%)</Label>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">Low Quality</span>
                      <Slider
                        value={compressionLevel}
                        onValueChange={setCompressionLevel}
                        min={1}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm">High Quality</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher quality = larger file size
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleCompress}
                    disabled={isCompressing || files.length === 0}
                    className="w-full"
                  >
                    {isCompressing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                        Compressing...
                      </>
                    ) : (
                      <>Compress File</>
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
              Compressed File
            </h2>

            {compressedFileUrl ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {activeTab === "image" && (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={compressedFileUrl}
                      alt="Compressed image"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {activeTab === "pdf" && (
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative">
                    <iframe
                      src={compressedFileUrl}
                      className="w-full h-full"
                      title="Compressed PDF"
                    />
                  </div>
                )}

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Compression Results</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Original Size:</div>
                    <div className="font-medium">{formatFileSize(originalSize)}</div>
                    
                    <div>Compressed Size:</div>
                    <div className="font-medium">{formatFileSize(compressedSize)}</div>
                    
                    <div>Space Saved:</div>
                    <div className="font-medium text-primary">{savedBytes} ({savingsPercentage}%)</div>
                  </div>
                </div>

                <Button
                  onClick={downloadCompressedFile}
                  className="w-full mt-4"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Compressed File
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {isCompressing
                    ? "Compressing..."
                    : files.length > 0
                    ? "Compress button par click karein"
                    : "Compressed file yahan dikhega"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 bg-muted/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">File Compression ke baare mein</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Images aur PDF files ka size reduce karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Adjustable compression levels</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Quality aur file size balance karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>100% client-side processing for privacy and security</p>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-4">Use Cases</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Email attachments ke liye files compress karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Website performance improve karne ke liye images optimize karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Storage space save karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Slow internet connections par sharing ke liye file size reduce karein</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}