"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileUp, Upload, Download, Trash2, Settings, Info } from "lucide-react";
import Image from "next/image";

export default function WordToPdfPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [convertedPdf, setConvertedPdf] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [settings, setSettings] = useState({
    quality: "high",
    preserveLinks: true,
    preserveFormats: true
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
      if (droppedFile.name.endsWith('.docx') || droppedFile.name.endsWith('.doc')) {
        setFile(droppedFile);
      } else {
        alert("Please upload a Word document (.docx or .doc)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.docx') || selectedFile.name.endsWith('.doc')) {
        setFile(selectedFile);
      } else {
        alert("Please upload a Word document (.docx or .doc)");
      }
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setIsConverting(true);
    
    // Simulate conversion process
    setTimeout(() => {
      // Mock converted PDF
      setConvertedPdf("https://sp-uploads.s3.amazonaws.com/uploads/services/4122896/20220811032336_62f476384d03f_microsoft_word_documents_converted_to_pdfpage0.jpg");
      setIsConverting(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (!convertedPdf) return;
    
    const link = document.createElement("a");
    link.href = convertedPdf;
    link.download = file ? file.name.replace(/\.(docx|doc)$/, '.pdf') : "converted-document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
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
            <span className="gradient-text">Word to PDF Converter</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Microsoft Word documents (DOCX) ko PDF format mein convert karein, formatting aur layout preserve karke.
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
                file ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <FileUp className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Drag & Drop your Word document here
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    या फिर नीचे दिए गए बटन से फाइल चुनें
                  </p>
                  <label className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-300">
                    <span>Choose Document</span>
                    <input
                      type="file"
                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-center mb-4">
                    <FileUp className="h-10 w-10 text-green-500 mr-3" />
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
                        <label className="block text-sm font-medium mb-1">Quality</label>
                        <select 
                          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                          value={settings.quality}
                          onChange={(e) => setSettings({...settings, quality: e.target.value})}
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low (Smaller File)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Hyperlinks</label>
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id="preserveLinks"
                            checked={settings.preserveLinks}
                            onChange={(e) => setSettings({...settings, preserveLinks: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="preserveLinks" className="ml-2 text-sm">
                            Preserve hyperlinks
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Formatting</label>
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id="preserveFormats"
                            checked={settings.preserveFormats}
                            onChange={(e) => setSettings({...settings, preserveFormats: e.target.checked})}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="preserveFormats" className="ml-2 text-sm">
                            Preserve formatting
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleConvert}
                      disabled={isConverting}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-colors duration-300 disabled:opacity-50"
                    >
                      {isConverting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Converting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 mr-2" />
                          Convert to PDF
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
                  Word document successfully converted to PDF
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Quality: {settings.quality} • Hyperlinks: {settings.preserveLinks ? "Preserved" : "Not preserved"} • Formatting: {settings.preserveFormats ? "Preserved" : "Not preserved"}
                </p>
              </div>
              
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg flex items-center transition-colors duration-300"
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
          className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-start">
            <Info className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Word to PDF Conversion Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>All fonts and formatting will be preserved in the converted PDF</li>
                <li>Images, tables, and charts will be maintained with high fidelity</li>
                <li>For documents with complex formatting, choose high quality setting</li>
                <li>Password-protected Word documents cannot be converted</li>
                <li>Maximum file size: 50MB</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}