"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileImage, Download, Settings, Info, Plus, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [margin, setMargin] = useState([10]);
  const [imageQuality, setImageQuality] = useState([80]);
  const [fitToPage, setFitToPage] = useState(true);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setPdfUrl(null);
    setError(null);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFiles(items);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const convertImagesToPdf = async () => {
    if (files.length === 0) {
      setError("Kripya pehle kuch images select karein");
      return;
    }

    setIsConverting(true);
    setError(null);
    setPdfUrl(null);

    try {
      // Load jsPDF library dynamically
      const { jsPDF } = await import("jspdf");
      
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: pageSize,
      });

      const marginValue = margin[0];
      
      // Process each image
      for (let i = 0; i < files.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const file = files[i];
        const imageUrl = URL.createObjectURL(file);
        
        // Create an image element to get dimensions
        const img = new Image();
        img.src = imageUrl;
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            // Calculate dimensions
            const pageWidth = pdf.internal.pageSize.getWidth() - (marginValue * 2);
            const pageHeight = pdf.internal.pageSize.getHeight() - (marginValue * 2);
            
            let imgWidth = img.width;
            let imgHeight = img.height;
            
            if (fitToPage) {
              // Scale image to fit within page while maintaining aspect ratio
              const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
              imgWidth *= ratio;
              imgHeight *= ratio;
            }
            
            // Add image to PDF
            pdf.addImage(
              img,
              "JPEG",
              marginValue,
              marginValue,
              imgWidth,
              imgHeight,
              undefined,
              "MEDIUM",
              imageQuality[0]
            );
            
            resolve();
          };
        });
        
        URL.revokeObjectURL(imageUrl);
      }
      
      // Generate PDF blob and create URL
      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
    } catch (err) {
      console.error("Error converting images to PDF:", err);
      setError("Images ko PDF mein convert karne mein error aaya hai");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      fetch(pdfUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const fileName = "converted_images.pdf";
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
        <h1 className="text-4xl font-bold mb-4">Image to PDF Converter</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Apni images ko high-quality PDF mein convert karein. Multiple images ko ek PDF document mein combine karein.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FileImage className="mr-2 h-6 w-6 text-primary" />
              Images Upload Karein
            </h2>
            
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              acceptedFileTypes={[
                ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp",
                "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"
              ]}
              multiple={true}
              fileTypeDescription="Image (JPG, PNG, etc.)"
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
                  PDF Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="page-size">Page Size</Label>
                    <Select
                      value={pageSize}
                      onValueChange={setPageSize}
                    >
                      <SelectTrigger id="page-size">
                        <SelectValue placeholder="Page size select karein" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="a5">A5</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select
                      value={orientation}
                      onValueChange={setOrientation}
                    >
                      <SelectTrigger id="orientation">
                        <SelectValue placeholder="Orientation select karein" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Margin ({margin}mm)</Label>
                    <Slider
                      value={margin}
                      onValueChange={setMargin}
                      min={0}
                      max={50}
                      step={1}
                    />
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
                
                <div className="flex items-center space-x-2 mb-6">
                  <Switch
                    id="fit-to-page"
                    checked={fitToPage}
                    onCheckedChange={setFitToPage}
                  />
                  <Label htmlFor="fit-to-page">
                    Images ko page ke size ke according fit karein
                  </Label>
                </div>

                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Plus className="mr-2 h-5 w-5 text-primary" />
                  Image Order
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Images ko drag karke reorder kar sakte hain
                </p>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="images">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2 mb-6"
                      >
                        {files.map((file, index) => (
                          <Draggable
                            key={`${file.name}-${index}`}
                            draggableId={`${file.name}-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-muted/50 rounded-lg p-3 flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <div className="relative h-12 w-12 mr-3 rounded-md overflow-hidden bg-background">
                                    <Image
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Page {index + 1}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFile(index)}
                                  aria-label="Remove image"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <div className="mt-6">
                  <Button
                    onClick={convertImagesToPdf}
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
                <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
        <h2 className="text-2xl font-semibold mb-6">Image to PDF Conversion ke baare mein</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Multiple images ko ek PDF mein combine karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Drag-and-drop se images ko reorder karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Page size, orientation, aur margins customize karein</p>
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
                <p>Photo albums ko PDF format mein create karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Scanned documents ko ek PDF mein combine karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Product catalogs ya presentations create karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Digital artwork ko PDF portfolio mein convert karein</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}