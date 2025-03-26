
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  defaultImageUrl?: string;
}

const ImageUploader = ({ onImageSelected, defaultImageUrl = '' }: ImageUploaderProps) => {
  const [imageUrl, setImageUrl] = useState(defaultImageUrl);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInputMode, setUrlInputMode] = useState(!!defaultImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onImageSelected(url);
  };
  
  const toggleInputMode = () => {
    setUrlInputMode(!urlInputMode);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    // Upload file to Firebase Storage
    uploadImage(file);
  };
  
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setFileUploadProgress(0);
    
    try {
      // Create a unique filename
      const fileExtension = file.name.split('.').pop() || '';
      const fileName = `blog-images/${uuidv4()}.${fileExtension}`;
      
      // Create a storage reference
      const storageRef = ref(storage, fileName);
      
      // Start the upload task
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Listen for upload progress
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress);
        },
        (error) => {
          // Handle errors
          console.error('Error uploading image:', error);
          toast.error('Failed to upload image. Please try again.');
          setIsUploading(false);
        },
        async () => {
          // Upload completed successfully, get download URL
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadUrl);
          onImageSelected(downloadUrl);
          setIsUploading(false);
          toast.success('Image uploaded successfully');
        }
      );
    } catch (error) {
      console.error('Error starting upload:', error);
      toast.error('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Featured Image</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={toggleInputMode}
          disabled={isUploading}
        >
          {urlInputMode ? <Upload className="h-4 w-4 mr-2" /> : <LinkIcon className="h-4 w-4 mr-2" />}
          {urlInputMode ? 'Upload Image' : 'Add URL'}
        </Button>
      </div>
      
      {urlInputMode ? (
        <div className="space-y-2">
          <Input
            type="url"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="Enter image URL"
            className="w-full"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div 
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors ${isUploading ? 'pointer-events-none' : ''}`}
          >
            {isUploading ? (
              <div className="space-y-2">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p>Uploading... {fileUploadProgress.toFixed(0)}%</p>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${fileUploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p>Click to upload an image or drag and drop</p>
                <p className="text-sm text-muted-foreground mt-1">PNG, JPG or GIF (max. 5MB)</p>
              </>
            )}
          </div>
        </div>
      )}
      
      {imageUrl && !isUploading && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <div className="relative rounded-md overflow-hidden aspect-video bg-secondary">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
