"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

interface FileDropzoneProps {
  accept: string;
  label: string;
  maxSizeMB?: number;
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export function FileDropzone({
  accept,
  label,
  maxSizeMB = 5,
  onFileSelected,
  isLoading = false,
}: FileDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      setError(null);

      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!acceptedTypes.includes(fileExt)) {
        setError(`Invalid file type. Accepted: ${accept}`);
        return false;
      }

      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`File too large. Maximum size: ${maxSizeMB}MB`);
        return false;
      }

      return true;
    },
    [accept, maxSizeMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelected(file);
      }
    },
    [validateFile, onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      {!selectedFile ? (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            dragOver
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50"
          } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
        >
          <Upload
            className={`h-8 w-8 mb-3 ${
              dragOver ? "text-indigo-400" : "text-slate-500"
            }`}
          />
          <p className="text-sm text-slate-300 font-medium">{label}</p>
          <p className="text-xs text-slate-500 mt-1">
            or drag and drop here (max {maxSizeMB}MB)
          </p>
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
          <FileText className="h-8 w-8 text-indigo-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500">
              {formatSize(selectedFile.size)}
            </p>
          </div>
          {!isLoading && (
            <button
              type="button"
              onClick={clearFile}
              className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
          {error}
        </p>
      )}
    </div>
  );
}
