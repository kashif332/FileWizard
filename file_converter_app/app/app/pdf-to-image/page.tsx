"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileImage, Download, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileDropzone from "@/components/file-dropzone";
import { downloadFile } from "@/lib/utils";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function PdfToImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [imageFormat, setImageFormat] = useState("png");
  const [imageQuality, setImageQuality] = useState([80]);
  const [extractAllPages, setExtractAllPages] = useState(true);
  const [selectedPages, setSelectedPages] = useState<string>("1");
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Load the pdf-img-convert library dynamically when needed
    if (files.length > 0) {
      import("pdf-img-convert")
        .then((pdfToImg) => {
          // Get the total number of pages
          pdfToImg
            .default.convert(files[0])
            .then((pdfInfo: any) => {
              if (pdfInfo && pdfInfo.length) {
                setTotalPages(pdfInfo.length);
              }
            })
            .catch((err: Error) => {
              console.error("Error getting PDF info:", err);
              setError("PDF file ko process karne mein error aaya hai");
            });
        })
        .catch((err) => {
          console.error("Error loading pdf-img-convert:", err);
          setError("PDF conversion library load karne mein error aaya hai");
        });
    }
  }, [files]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setConvertedImages([]);
    setError(null);
  };

  const convertPdfToImage = async () => {
    if (files.length === 0) {
      setError("Kripya pehle ek PDF file select karein");
      return;
    }

    setIsConverting(true);
    setError(null);
    setConvertedImages([]);

    try {
      const pdfToImg = await import("pdf-img-convert");
      
      let pagesToExtract: number[] = [];
      
      if (extractAllPages) {
        // Extract all pages
        pagesToExtract = Array.from({ length: totalPages }, (_, i) => i);
      } else {
        // Parse selected pages (e.g., "1,3,5-7")
        const pageRanges = selectedPages.split(",");
        
        for (const range of pageRanges) {
          if (range.includes("-")) {
            const [start, end] = range.split("-").map(Number);
            for (let i = start; i <= end; i++) {
              if (i > 0 && i <= totalPages) {
                pagesToExtract.push(i - 1); // Convert to 0-based index
              }
            }
          } else {
            const pageNum = parseInt(range);
            if (pageNum > 0 && pageNum <= totalPages) {
              pagesToExtract.push(pageNum - 1); // Convert to 0-based index
            }
          }
        }
      }

      // If no valid pages were selected
      if (pagesToExtract.length === 0) {
        setError("Koi valid page select nahi ki gayi hai");
        setIsConverting(false);
        return;
      }

      const options = {
        scale: imageQuality[0] / 50, // Convert quality (0-100) to scale (0-2)
        pages: pagesToExtract,
        outputFormat: imageFormat,
      };

      const result = await pdfToImg.default.convert(files[0], options);
      
      // Convert the result to data URLs
      const imageUrls = result.map((img: Uint8Array) => {
        const blob = new Blob([img], { type: `image/${imageFormat}` });
        return URL.createObjectURL(blob);
      });
      
      setConvertedImages(imageUrls);
    } catch (err) {
      console.error("Error converting PDF to image:", err);
      setError("PDF ko image mein convert karne mein error aaya hai");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImages = () => {
    convertedImages.forEach((imageUrl, index) => {
      fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const fileName = `${files[0].name.replace(".pdf", "")}_page${index + 1}.${imageFormat}`;
          downloadFile(blob, fileName);
        });
    });
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
        <h1 className="text-4xl font-bold mb-4">PDF to Image Converter</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Apne PDF files ko high-quality images mein convert karein. Multiple pages ko extract karein aur different formats mein save karein.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FileImage className="mr-2 h-6 w-6 text-primary" />
              PDF Upload Karein
            </h2>
            
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              acceptedFileTypes={[".pdf", "application/pdf"]}
              maxFiles={1}
              multiple={false}
              fileTypeDescription="PDF"
            />

            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  Conversion Options
                </h3>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="basic">Basic Options</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="image-format">Image Format</Label>
                        <Select
                          value={imageFormat}
                          onValueChange={setImageFormat}
                        >
                          <SelectTrigger id="image-format">
                            <SelectValue placeholder="Format select karein" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="png">PNG</SelectItem>
                            <SelectItem value="jpg">JPG</SelectItem>
                            <SelectItem value="webp">WebP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Image Quality ({imageQuality}%)</Label>
                        <Slider
                          value={imageQuality}
                          onValueChange={setImageQuality}
                          min={10}
                          max={100}
                          step={1}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="extract-all"
                        checked={extractAllPages}
                        onCheckedChange={setExtractAllPages}
                      />
                      <Label htmlFor="extract-all">
                        Sabhi pages extract karein
                      </Label>
                    </div>
                    
                    {!extractAllPages && (
                      <div className="space-y-2">
                        <Label htmlFor="selected-pages">
                          Pages select karein (e.g., 1,3,5-7)
                        </Label>
                        <input
                          id="selected-pages"
                          type="text"
                          value={selectedPages}
                          onChange={(e) => setSelectedPages(e.target.value)}
                          className="w-full p-2 rounded-md border border-input bg-background"
                          placeholder="1,3,5-7"
                        />
                        <p className="text-xs text-muted-foreground">
                          Total pages: {totalPages}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <Button
                    onClick={convertPdfToImage}
                    disabled={isConverting || files.length === 0}
                    className="w-full"
                  >
                    {isConverting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                        Converting...
                      </>
                    ) : (
                      <>Convert to Image</>
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
              Converted Images
            </h2>

            {convertedImages.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {convertedImages.map((imageUrl, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Converted page ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 text-xs">
                        Page {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={downloadImages}
                  className="w-full mt-4"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download All Images
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {isConverting
                    ? "Converting..."
                    : files.length > 0
                    ? "Convert button par click karein"
                    : "Converted images yahan dikhenge"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 bg-muted/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">PDF to Image Conversion ke baare mein</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>High-quality image conversion with adjustable settings</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Multiple output formats: PNG, JPG, WebP</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Specific pages ya full document convert kar sakte hain</p>
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
                <p>PDF documents ko presentations mein use karne ke liye</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Social media par share karne ke liye PDF pages ko images mein convert karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>PDF documents ko websites par display karne ke liye</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>PDF diagrams ya charts ko image format mein extract karein</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}