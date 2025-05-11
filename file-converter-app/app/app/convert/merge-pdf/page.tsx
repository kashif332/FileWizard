"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FilePlus, Upload, Download, Trash2, Settings, Info, Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";

export default function MergePdfPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mergedPdf, setMergedPdf] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [settings, setSettings] = useState({
    outline: true,
    compression: "medium"
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
      const pdfFiles = droppedFiles.filter(file => 
        file.type === "application/pdf"
      );
      
      if (pdfFiles.length > 0) {
        setFiles(prev => [...prev, ...pdfFiles]);
      } else {
        alert("Please upload PDF files");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const pdfFiles = selectedFiles.filter(file => 
        file.type === "application/pdf"
      );
      
      if (pdfFiles.length > 0) {
        setFiles(prev => [...prev, ...pdfFiles]);
      } else {
        alert("Please upload PDF files");
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge");
      return;
    }
    
    setIsMerging(true);
    
    // Simulate merging process
    setTimeout(() => {
      // Mock merged PDF
      setMergedPdf("https://media.idownloadblog.com/wp-content/uploads/2016/07/Preview-PDF-Page-Sharking.png");
      setIsMerging(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (!mergedPdf) return;
    
    const link = document.createElement("a");
    link.href = mergedPdf;
    link.download = "merged-document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFiles([]);
    setMergedPdf(null);
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
            <span className="gradient-text">PDF Merger</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Multiple PDF files ko ek single PDF document mein combine karein, pages ko rearrange karein.
          </p>
        </div>

        {!mergedPdf ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          >
            <div
              className={`file-drop-area ${isDragging ? "active" : ""} ${
                files.length > 0 ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {files.length === 0 ? (
                <>
                  <FilePlus className="h-16 w-16 text-orange-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Drag & Drop your PDF files here
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    या फिर नीचे दिए गए बटन से फाइल चुनें
                  </p>
                  <label className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-300">
                    <span>Choose PDFs</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <div className="w-full">
                  <div className="mb-4">
                    <h3 className="font-medium text-lg mb-3">Selected PDFs ({files.length})</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Drag and drop to rearrange files. The order below will be the order in the merged PDF.
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      {files.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg group"
                        >
                          <div className="flex-shrink-0 mr-3 text-orange-500">
                            <FilePlus className="h-6 w-6" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleMoveDown(index)}
                              disabled={index === files.length - 1}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <label className="inline-flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-300">
                      <Plus className="h-5 w-5 mr-2" />
                      <span>Add More PDFs</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <h4 className="font-medium flex items-center mb-3">
                      <Settings className="h-4 w-4 mr-2" />
                      Merge Settings
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Outline/Bookmarks</label>
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id="outline"
                            checked={settings.outline}
                            onChange={(e) => setSettings({...settings, outline: e.target.checked})}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <label htmlFor="outline" className="ml-2 text-sm">
                            Create outline from filenames
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Compression</label>
                        <select 
                          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                          value={settings.compression}
                          onChange={(e) => setSettings({...settings, compression: e.target.value})}
                        >
                          <option value="none">No Compression</option>
                          <option value="low">Low Compression</option>
                          <option value="medium">Medium Compression</option>
                          <option value="high">High Compression</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleMerge}
                      disabled={isMerging || files.length < 2}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-colors duration-300 disabled:opacity-50"
                    >
                      {isMerging ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Merging...
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 mr-2" />
                          Merge PDFs
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
              <h3 className="text-xl font-semibold">Your Merged PDF is Ready!</h3>
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
                  src={mergedPdf}
                  alt="PDF Preview"
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {files.length} PDF files successfully merged
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Outline: {settings.outline ? "Created" : "Not created"} • Compression: {settings.compression}
                </p>
              </div>
              
              <button
                onClick={handleDownload}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-lg flex items-center transition-colors duration-300"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Merged PDF
              </button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-start">
            <Info className="h-6 w-6 text-orange-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">PDF Merging Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>You can merge up to 20 PDF files at once</li>
                <li>Rearrange files by using the up and down arrows</li>
                <li>Creating an outline helps navigate through the merged document</li>
                <li>Use compression to reduce the final file size</li>
                <li>Password-protected PDFs cannot be merged</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}