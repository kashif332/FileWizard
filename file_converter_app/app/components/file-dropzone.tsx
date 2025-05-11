"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize, isValidFileType } from "@/lib/utils";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes: string[];
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  multiple?: boolean;
  className?: string;
  fileTypeDescription: string;
}

const FileDropzone = ({
  onFilesSelected,
  acceptedFileTypes,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  multiple = true,
  className = "",
  fileTypeDescription,
}: FileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFiles = useCallback(
    (fileList: FileList) => {
      setError(null);
      const validFiles: File[] = [];
      const newFiles = Array.from(fileList);

      if (!multiple && newFiles.length > 1) {
        setError("Sirf ek file select karein");
        return [];
      }

      if (files.length + newFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files upload kar sakte hain`);
        return [];
      }

      for (const file of newFiles) {
        if (file.size > maxFileSize) {
          setError(`File size ${formatFileSize(maxFileSize)} se kam honi chahiye`);
          continue;
        }

        if (!isValidFileType(file, acceptedFileTypes)) {
          setError(`Sirf ${fileTypeDescription} files supported hain`);
          continue;
        }

        validFiles.push(file);
      }

      return validFiles;
    },
    [acceptedFileTypes, fileTypeDescription, files.length, maxFileSize, maxFiles, multiple]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        const newFiles = [...files, ...validFiles];
        setFiles(newFiles);
        onFilesSelected(newFiles);
      }
    },
    [files, onFilesSelected, validateFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const validFiles = validateFiles(e.target.files);
        if (validFiles.length > 0) {
          const newFiles = [...files, ...validFiles];
          setFiles(newFiles);
          onFilesSelected(newFiles);
        }
      }
    },
    [files, onFilesSelected, validateFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      onFilesSelected(newFiles);
    },
    [files, onFilesSelected]
  );

  return (
    <div className={className}>
      <motion.div
        className={`dropzone rounded-lg p-8 text-center ${
          isDragging ? "active" : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="file"
          id="file-input"
          className="sr-only"
          onChange={handleFileInputChange}
          accept={acceptedFileTypes.join(",")}
          multiple={multiple}
        />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">
          Files ko drag and drop karein ya select karein
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {fileTypeDescription} files supported hain
        </p>
        <Button asChild>
          <label htmlFor="file-input">Files Select Karein</label>
        </Button>
      </motion.div>

      {error && (
        <motion.div
          className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {files.length > 0 && (
        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-medium">Selected Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                className="file-preview bg-muted/50 rounded-lg p-3 flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center">
                  <File className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
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
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FileDropzone;