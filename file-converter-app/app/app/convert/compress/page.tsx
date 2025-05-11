"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Zap, Upload, Download, Trash2, Settings, Info } from "lucide-react";
import Image from "next/image";

export default function CompressPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressedFile, setCompressedFile] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [fileType, setFileType] = useState<"pdf" | "image" | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    reduction: number;
  } | null>(null);

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
        setFileType("pdf");
      } else if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
        setFileType("image");
      } else {
        alert("Please upload a PDF or image file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setFileType("pdf");
      } else if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setFileType("image");
      } else {
        alert("Please upload a PDF or image file");
      }
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    
    setIsCompressing(true);
    
    // Simulate compression process
    setTimeout(() => {
      // Mock compressed file
      setCompressedFile("https://pdf.easeus.com/images/pdf-editor/en/resource/export-pdf-in-preview-mac.png");
      
      // Mock compression stats
      const originalSize = file.size;
      let compressedSize = 0;
      
      // Calculate mock compressed size based on compression level
      if (compressionLevel === "low") {
        compressedSize = originalSize * 0.8;
      } else if (compressionLevel === "medium") {
        compressedSize = originalSize * 0.6;
      } else if (compressionLevel === "high") {
        compressedSize = originalSize * 0.4;
      } else if (compressionLevel === "extreme") {
        compressedSize = originalSize * 0.25;
      }
      
      const reduction = ((originalSize - compressedSize) / originalSize) * 100;
      
      setCompressionStats({
        originalSize,
        compressedSize,
        reduction
      });
      
      setIsCompressing(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (!compressedFile) return;
    
    const link = document.createElement("a");
    link.href = compressedFile;
    link.download = file ? `compressed-${file.name}` : "compressed-file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setFileType(null);
    setCompressedFile(null);
    setCompressionStats(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
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
            <span className="gradient-text">File Compressor</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            PDF aur image files ko compress karein without quality loss, file size ko kam karein.
          </p>
        </div>

        {!compressedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          >
            <div
              className={`file-drop-area ${isDragging ? "active" : ""} ${
                file ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <Zap className="h-16 w-16 text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Drag & Drop your file here
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    PDF या image file को compress करने के लिए यहां drop करें
                  </p>
                  <label className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-300">
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf,image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-center mb-4">
                    <Zap className="h-10 w-10 text-red-500 mr-3" />
                    <div className="text-left">
                      <h3 className="font-medium">{file.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {fileType === "pdf" ? "PDF File" : "Image File"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <h4 className="font-medium flex items-center mb-3">
                      <Settings className="h-4 w-4 mr-2" />
                      Compression Level
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="low"
                          name="compressionLevel"
                          value="low"
                          checked={compressionLevel === "low"}
                          onChange={() => setCompressionLevel("low")}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label htmlFor="low" className="ml-2 flex-grow">
                          <span className="font-medium">Low Compression</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Best quality, minimal size reduction (20%)</p>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="medium"
                          name="compressionLevel"
                          value="medium"
                          checked={compressionLevel === "medium"}
                          onChange={() => setCompressionLevel("medium")}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label htmlFor="medium" className="ml-2 flex-grow">
                          <span className="font-medium">Medium Compression</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Good quality, moderate size reduction (40%)</p>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="high"
                          name="compressionLevel"
                          value="high"
                          checked={compressionLevel === "high"}
                          onChange={() => setCompressionLevel("high")}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label htmlFor="high" className="ml-2 flex-grow">
                          <span className="font-medium">High Compression</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Reduced quality, significant size reduction (60%)</p>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="extreme"
                          name="compressionLevel"
                          value="extreme"
                          checked={compressionLevel === "extreme"}
                          onChange={() => setCompressionLevel("extreme")}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label htmlFor="extreme" className="ml-2 flex-grow">
                          <span className="font-medium">Extreme Compression</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Lower quality, maximum size reduction (75%)</p>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleCompress}
                      disabled={isCompressing}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-colors duration-300 disabled:opacity-50"
                    >
                      {isCompressing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Compressing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 mr-2" />
                          Compress File
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
              <h3 className="text-xl font-semibold">Compression Complete!</h3>
              <button
                onClick={handleReset}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Start Over
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 aspect-square relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={compressedFile}
                  alt="Compressed File Preview"
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-4">Compression Results</h4>
                  
                  {compressionStats && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Original Size</p>
                        <p className="text-xl font-bold">{formatFileSize(compressionStats.originalSize)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Compressed Size</p>
                        <p className="text-xl font-bold">{formatFileSize(compressionStats.compressedSize)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reduction</p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          {compressionStats.reduction.toFixed(1)}%
                        </p>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${100 - compressionStats.reduction}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleDownload}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Compressed File
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800"
        >
          <div className="flex items-start">
            <Info className="h-6 w-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Compression Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>For documents and text-based PDFs, high compression usually works well</li>
                <li>For photos and images with many colors, medium compression is recommended</li>
                <li>Extreme compression is best for sharing files online or via email</li>
                <li>The preview shows an approximation of the compressed file quality</li>
                <li>Maximum file size: 100MB</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}