"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileImage, Upload, Download, Trash2, Settings, Info } from "lucide-react";
import Image from "next/image";

export default function PdfToImagePage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [settings, setSettings] = useState({
    format: "png",
    quality: "high",
    pages: "all"
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
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setIsConverting(true);
    
    // Simulate conversion process
    setTimeout(() => {
      // Mock converted images
      const mockImages = [
        "https://www.esofttools.com/imagesnew/feature-img/pdf-to-image-feature.webp",
        "https://www.esofttools.com/screen/pdftoimage/convert-pdf-page-to-image.png",
        "https://www.esofttools.com/imagesnew/feature-img/pdf-to-image-feature.webp"
      ];
      
      setConvertedImages(mockImages);
      setIsConverting(false);
    }, 2000);
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `converted-page-${index + 1}.${settings.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setConvertedImages([]);
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
            <span className="gradient-text">PDF to Image Converter</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Apne PDF files ko high-quality images mein convert karein. Multiple pages ko alag-alag images mein convert kar sakte hain.
          </p>
        </div>

        {!convertedImages.length ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          >
            <div
              className={`file-drop-area ${isDragging ? "active" : ""} ${
                file ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <FileImage className="h-16 w-16 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Drag & Drop your PDF file here
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    या फिर नीचे दिए गए बटन से फाइल चुनें
                  </p>
                  <label className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-300">
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-center mb-4">
                    <FileImage className="h-10 w-10 text-green-500 mr-3" />
                    <div className="text-left">
                      <h3 className="font-medium">{file.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <h4 className="font-medium flex items-center mb-3">
                      <Settings className="h-4 w-4 mr-2" />
                      Conversion Settings
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Image Format</label>
                        <select 
                          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                          value={settings.format}
                          onChange={(e) => setSettings({...settings, format: e.target.value})}
                        >
                          <option value="png">PNG</option>
                          <option value="jpg">JPG</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Quality</label>
                        <select 
                          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                          value={settings.quality}
                          onChange={(e) => setSettings({...settings, quality: e.target.value})}
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Pages</label>
                        <select 
                          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                          value={settings.pages}
                          onChange={(e) => setSettings({...settings, pages: e.target.value})}
                        >
                          <option value="all">All Pages</option>
                          <option value="first">First Page Only</option>
                          <option value="custom">Custom Range</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleConvert}
                      disabled={isConverting}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-colors duration-300 disabled:opacity-50"
                    >
                      {isConverting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Converting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 mr-2" />
                          Convert to {settings.format.toUpperCase()}
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
              <h3 className="text-xl font-semibold">Converted Images</h3>
              <button
                onClick={handleReset}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Start Over
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {convertedImages.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
                >
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={imageUrl}
                      alt={`Converted page ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium mb-3">
                      Page {index + 1}.{settings.format}
                    </p>
                    <button
                      onClick={() => handleDownload(imageUrl, index)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start">
            <Info className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">PDF to Image Conversion Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>High quality setting provides better image clarity but larger file sizes</li>
                <li>PNG format is best for documents with text and graphics</li>
                <li>JPG format is better for photographs and images with many colors</li>
                <li>For multi-page PDFs, you can select specific pages to convert</li>
                <li>Maximum file size: 50MB</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}