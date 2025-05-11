"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileText, Upload, Download, Trash2, Settings, Info, Plus, X } from "lucide-react";
import Image from "next/image";

export default function ImageToPdfPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [convertedPdf, setConvertedPdf] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [settings, setSettings] = useState({
    pageSize: "a4",
    orientation: "portrait",
    margin: "normal"
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const imageFiles = droppedFiles.filter(file => 
        file.type.startsWith("image/")
      );
      
      if (imageFiles.length > 0) {
        setFiles(prev => [...prev, ...imageFiles]);
      } else {
        alert("Please upload image files (JPG, PNG, etc.)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const imageFiles = selectedFiles.filter(file => 
        file.type.startsWith("image/")
      );
      
      if (imageFiles.length > 0) {
        setFiles(prev => [...prev, ...imageFiles]);
      } else {
        alert("Please upload image files (JPG, PNG, etc.)");
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    
    // Simulate conversion process
    setTimeout(() => {
      // Mock converted PDF
      setConvertedPdf("https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/analytics/media/pdf-document-preview.png");
      setIsConverting(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (!convertedPdf) return;
    
    const link = document.createElement("a");
    link.href = convertedPdf;
    link.download = "converted-images.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFiles([]);
    setConvertedPdf(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Image to PDF Converter</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Multiple images ko ek PDF file mein combine karein. JPG, PNG aur other formats support karta hai.
          </p>
        </div>

        {!convertedPdf ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          >
            <div
              className={`file-drop-area ${isDragging ? "active" : ""} ${
                files.length > 0 ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {files.length === 0 ? (
                <>
                  <FileText className="h-16 w-16 text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Drag & Drop your images here
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    या फिर नीचे दिए गए बटन से फाइल चुनें
                  </p>
                  <label className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-300">
                    <span>Choose Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <div className="w-full">
                  <div className="mb-4">
                    <h3 className="font-medium text-lg mb-3">Selected Images ({files.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              fill
                              className="object-cover"
                            />
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xs mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                      <label className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
                        <Plus className="h-8 w-8 text-gray-400" />
                        <span className="text-xs mt-1 text-gray-500">Add More</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <h4 className="font-medium flex items-center mb-3">
                      <Settings className="h-4 w-4 mr-2" />
                      PDF Settings
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Page Size</label>
                        <select 
                          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                          value={settings.pageSize}
                          onChange={(e) => setSettings({...settings, pageSize: e.target.value})}
                        >
                          <option value="a4">A4</option>
                          <option value="letter">Letter</option>
                          <option value="legal">Legal</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Orientation</label>
                        <select 
                          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                          value={settings.orientation}
                          onChange={(e) => setSettings({...settings, orientation: e.target.value})}
                        >
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Margin</label>
                        <select 
                          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                          value={settings.margin}
                          onChange={(e) => setSettings({...settings, margin: e.target.value})}
                        >
                          <option value="none">No Margin</option>
                          <option value="small">Small</option>
                          <option value="normal">Normal</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleConvert}
                      disabled={isConverting || files.length === 0}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-colors duration-300 disabled:opacity-50"
                    >
                      {isConverting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Converting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 mr-2" />
                          Create PDF
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-6 rounded-lg flex items-center transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Your PDF is Ready!</h3>
              <button
                onClick={handleReset}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Start Over
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md aspect-[3/4] relative mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={convertedPdf}
                  alt="PDF Preview"
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {files.length} images successfully converted to PDF
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {settings.pageSize.toUpperCase()} • {settings.orientation} • {settings.margin} margin
                </p>
              </div>
              
              <button
                onClick={handleDownload}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg flex items-center transition-colors duration-300"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-start">
            <Info className="h-6 w-6 text-purple-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Image to PDF Conversion Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>For best results, use high-resolution images</li>
                <li>You can rearrange images by dragging them before conversion</li>
                <li>Portrait orientation works best for vertical images</li>
                <li>Landscape orientation works best for horizontal images</li>
                <li>Maximum 20 images at once, each up to 10MB</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}