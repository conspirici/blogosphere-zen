
import { useState, useRef } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Image, Check, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  fileType?: 'image' | 'all';
  maxSizeMB?: number;
}

const FileUploader = ({ 
  onUploadComplete, 
  fileType = 'image',
  maxSizeMB = 5
}: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedFileTypes = fileType === 'image' 
    ? 'image/png, image/jpeg, image/gif, image/webp'
    : '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploaded(false);
    
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validate file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }
    
    // Validate file type for images
    if (fileType === 'image' && !selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // Create a unique file path
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      const storageRef = ref(storage, `blog-uploads/${fileName}`);
      
      // Start upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          setError('Upload failed: ' + error.message);
          setUploading(false);
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive",
          });
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploaded(true);
          setUploading(false);
          onUploadComplete(downloadURL);
          toast({
            title: "Upload complete",
            description: "File has been uploaded successfully",
          });
          
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      );
    } catch (err) {
      console.error('Upload error:', err);
      setUploading(false);
      setError('Failed to upload file');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ref={fileInputRef}
          disabled={uploading}
        />
        
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <>Uploading...</>
          ) : uploaded ? (
            <>
              <Check className="h-4 w-4" /> Done
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" /> Upload
            </>
          )}
        </Button>
      </div>
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">
            Uploading: {Math.round(progress)}%
          </p>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      
      {file && !error && !uploading && !uploaded && (
        <p className="text-sm text-muted-foreground">
          {fileType === 'image' ? (
            <span className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
            </span>
          ) : (
            <span>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)</span>
          )}
        </p>
      )}
    </div>
  );
};

export default FileUploader;
