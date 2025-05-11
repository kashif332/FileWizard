"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Search, Upload, Download, Trash2, Settings, Info, Copy, Check } from "lucide-react";
import Image from "next/image";

export default function OcrPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    language: "english",
    enhanceImage: true,
    detectOrientation: true
  });
  const [copied, setCopied] = useState(false);

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
      if (droppedFile.type === "application/pdf" || droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF or image file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf" || selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
      } else {
        alert("Please upload a PDF or image file");
      }
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    // Simulate OCR process
    setTimeout(() => {
      // Mock extracted text
      const mockText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.`;
      
      setExtractedText(mockText);
      setIsProcessing(false);
    }, 2000);
  };

  const handleCopyText = () => {
    if (!extractedText) return;
    
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadText = () => {
    if (!extractedText) return;
    
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "extracted-text.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setExtractedText(null);
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
            <span className="gradient-text">OCR Text Recognition</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Scanned documents aur images se text extract karein using Optical Character Recognition.
          </p>
        </div>

        {!extractedText ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          >
            <div
              className={`file-drop-area ${isDragging ? "active" : ""} ${
                file ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <Search className="h-16 w-16 text-teal-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Drag & Drop your file here
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    PDF या image file से text extract करने के लिए यहां drop करें
                  </p>
                  <label className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-300">
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
                    <Search className="h-10 w-10 text-teal-500 mr-3" />
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
                      OCR Settings
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Language</label>
                        <select 
                          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                          value={settings.language}
                          onChange={(e) => setSettings({...settings, language: e.target.value})}
                        >
                          <option value="english">English</option>
                          <option value="hindi">Hindi</option>
                          <option value="multi">Multi-language</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Image Enhancement</label>
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id="enhanceImage"
                            checked={settings.enhanceImage}
                            onChange={(e) => setSettings({...settings, enhanceImage: e.target.checked})}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                          <label htmlFor="enhanceImage" className="ml-2 text-sm">
                            Enhance image before OCR
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Auto-Orientation</label>
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id="detectOrientation"
                            checked={settings.detectOrientation}
                            onChange={(e) => setSettings({...settings, detectOrientation: e.target.checked})}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                          <label htmlFor="detectOrientation" className="ml-2 text-sm">
                            Auto-detect orientation
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleExtract}
                      disabled={isProcessing}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-colors duration-300 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5 mr-2" />
                          Extract Text
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
              <h3 className="text-xl font-semibold">Extracted Text</h3>
              <button
                onClick={handleReset}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Start Over
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200">
                  {extractedText}
                </pre>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyText}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300"
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copy Text
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDownloadText}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download as TXT
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="font-medium mb-3">Original File</h4>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative mr-4">
                  {file && (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Original file"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium">{file?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {file && (file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800"
        >
          <div className="flex items-start">
            <Info className="h-6 w-6 text-teal-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">OCR Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>For best results, use clear, high-resolution images</li>
                <li>Enable image enhancement for scanned documents with low contrast</li>
                <li>Select the correct language for more accurate text recognition</li>
                <li>Auto-orientation helps with rotated or skewed documents</li>
                <li>OCR works best on typed text; handwritten text recognition may be less accurate</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}