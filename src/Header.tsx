import { useState, useEffect } from "react";

import Button from "./atoms/Button";
import { File, Upload, X, Trash2 } from 'lucide-react';

interface UploadedFile {
  id: number;
  name: string;
  size: number;
  file: File;
}

interface HeaderProps {
  documents: UploadedFile[];
  setDocuments: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  setMessages: React.Dispatch<React.SetStateAction<{ id: number; type: string; content: string; timestamp: Date }[]>>;
}
const Header = ({documents, setDocuments, setMessages}: HeaderProps) => {

    const [systemStatus, setSystemStatus] = useState({ hasDocuments: false, documentCount: 0 });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const files = Array.from(e.target.files as FileList);
        if (files.length === 0) return;

        const file = files[0]; 

        const newFile: UploadedFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        file: file,
        };
        setDocuments((prev) => [...prev, newFile]);

        const formData = new FormData();
        formData.append('pdf', file);

        try {
        const res = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();
        alert(`File uploaded successfully: ${result.message}`);
        } catch (err) {
        console.error('Upload failed:', err);
        } finally{
            systemStatusUpdate();
        }
    };

    const handleFileDeletion = async () =>{
        if (!confirm('Are you sure you want to delete all files? This action cannot be undone.')) {
            return;
        }
        try{
            const response = await fetch('http://localhost:3000/reset', {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete files');
            }   
            setDocuments([]);
            setMessages([{
                id: Date.now(),
                type: 'assistant',
                content: "All documents have been cleared. Upload new documents to get started.",
                timestamp: new Date()
            }]);
            alert('All files deleted successfully');
            setSystemStatus({ hasDocuments: false, documentCount: 0 });
        } catch (error) {
            console.error('Error deleting files:', error);
            alert('Error encountered while deleting files');
        }
    }

    const systemStatusUpdate = async () => {
        try{
            const response = await fetch('http://localhost:3000/document/status',{
                method: 'GET',
            })
            if (!response.ok) {
                throw new Error('Failed to fetch system status');
            }
            const data = await response.json();
            console.log('System Status:', data);
            setSystemStatus({
                hasDocuments: data.namespaces?.lecture?.vectorCount > 0,
                documentCount: data.namespaces?.lecture?.vectorCount
            });
        } catch (error) {
            console.error('Error updating system status:', error);
        }
    }

    useEffect(() => {
        systemStatusUpdate();
    }, [documents]);

    const formatFileSize = (bytes:number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const removeFile = (fileId: UploadedFile["id"]) => {
        setDocuments(prev => prev.filter(file => file.id !== fileId));
    };


    return (
        <>
        <div className="bg-secondary flex flex-col gap-2 justify-center">
        <div className="container mx-auto py-2 px-4 text-text-inverse font-mono flex flex-row items-center justify-between">
          <div className="bg-secondary text-text-inverse font-mono">
          <h1 className="text-2xl font-bold">Document Assistant</h1>
          <p className="text-sm">Ask questions about your uploaded documents</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${systemStatus.hasDocuments ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span>{systemStatus.hasDocuments ? `${systemStatus.documentCount} docs loaded` : 'No documents'}</span>
            </div>
          <div className="text-text-primary font-semibold">
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="flex flex-row gap-2 items-center">
            <div className="text-text-primary hover:text-text-inverse">
            <Button
              roundedBorder='half'
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="inline mr-2 mb-1" />
              Upload Document
            </Button>
            </div>
            <div className="text-text-inverse ">
            {systemStatus.hasDocuments && 
            <Button
              roundedBorder='half'
              bgColor="accent"
              hoverColor="error"
              onClick={handleFileDeletion}
              >
                <Trash2 className="inline mr-2 mb-1" />
                Delete
            </Button>
              }
            </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {documents.length > 0 && (
          <div className="flex flex-row gap-1 mb-2 mx-2 items-center">
            <div className="flex flex-wrap gap-2">
              {documents.map(file => (
                <div key={file.id} className="flex items-center gap-2 bg-bg-tertiary text-text-primary px-3 py-1 rounded-full text-sm">
                  <File size={14} />
                  <span className="truncate max-w-32">{file.name}</span>
                  <span className="text-text-primary">({formatFileSize(file.size)})</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="hover:bg-secondary hover:text-text-inverse  rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
        </>
    )
}

export default Header;