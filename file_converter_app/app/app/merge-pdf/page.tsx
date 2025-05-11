"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileMerge, Download, Settings, Info, FileText, ArrowDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileDropzone from "@/components/file-dropzone";
import { downloadFile, formatFileSize } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [includeBookmarks, setIncludeBookmarks] = useState(true);
  const [optimizePdf, setOptimizePdf] = useState(true);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setMergedPdfUrl(null);
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

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Kam se kam 2 PDF files select karein");
      return;
    }

    setIsMerging(true);
    setError(null);
    setMergedPdfUrl(null);

    try {
      // Load PDF-LIB dynamically
      const { PDFDocument } = await import("pdf-lib");
      
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      
      // Process each PDF file
      for (const file of files) {
        try {
          // Read the file as ArrayBuffer
          const fileArrayBuffer = await file.arrayBuffer();
          
          // Load the PDF document
          const pdfDoc = await PDFDocument.load(fileArrayBuffer);
          
          // Copy all pages from the source PDF to the merged PDF
          const copiedPages = await mergedPdf.copyPages(
            pdfDoc,
            pdfDoc.getPageIndices()
          );
          
          // Add each copied page to the merged PDF
          copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
          });
        } catch (err) {
          console.error(`Error processing file ${file.name}:`, err);
          setError(`File "${file.name}" ko process karne mein error aaya hai`);
          setIsMerging(false);
          return;
        }
      }
      
      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      
      // Create a Blob from the PDF bytes
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      
    } catch (err) {
      console.error("Error merging PDFs:", err);
      setError("PDF files ko merge karne mein error aaya hai");
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMergedPdf = () => {
    if (mergedPdfUrl) {
      fetch(mergedPdfUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const fileName = "merged_document.pdf";
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
        <h1 className="text-4xl font-bold mb-4">PDF Merger</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Multiple PDF files ko ek single document mein combine karein. Files ko reorder karein aur customize karein.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FileMerge className="mr-2 h-6 w-6 text-primary" />
              PDF Files Upload Karein
            </h2>
            
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              acceptedFileTypes={[".pdf", "application/pdf"]}
              multiple={true}
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
                  Merge Options
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-bookmarks"
                      checked={includeBookmarks}
                      onCheckedChange={setIncludeBookmarks}
                    />
                    <Label htmlFor="include-bookmarks">
                      Bookmarks ko include karein
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="optimize-pdf"
                      checked={optimizePdf}
                      onCheckedChange={setOptimizePdf}
                    />
                    <Label htmlFor="optimize-pdf">
                      PDF file size ko optimize karein
                    </Label>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <ArrowDown className="mr-2 h-5 w-5 text-primary" />
                  PDF Order
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Files ko drag karke reorder kar sakte hain
                </p>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="pdfs">
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
                                  <FileText className="h-8 w-8 mr-3 text-primary" />
                                  <div>
                                    <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatFileSize(file.size)}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFile(index)}
                                  aria-label="Remove file"
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
                    onClick={mergePdfs}
                    disabled={isMerging || files.length < 2}
                    className="w-full"
                  >
                    {isMerging ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                        Merging...
                      </>
                    ) : (
                      <>Merge PDFs</>
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
              Merged PDF
            </h2>

            {mergedPdfUrl ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative">
                  <iframe
                    src={mergedPdfUrl}
                    className="w-full h-full"
                    title="Merged PDF"
                  />
                </div>

                <Button
                  onClick={downloadMergedPdf}
                  className="w-full mt-4"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Merged PDF
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileMerge className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {isMerging
                    ? "Merging..."
                    : files.length > 0
                    ? "Merge button par click karein"
                    : "Merged PDF yahan dikhega"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 bg-muted/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">PDF Merging ke baare mein</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Multiple PDF files ko ek document mein combine karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Drag-and-drop se files ko reorder karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Bookmarks aur metadata ko preserve karein</p>
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
                <p>Multiple reports ko ek comprehensive document mein combine karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Scanned documents ko ek file mein organize karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Chapters ya sections ko ek book mein combine karein</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                <p>Invoices aur receipts ko ek document mein merge karein</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}