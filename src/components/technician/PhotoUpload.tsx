
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface PhotoUploadProps {
  uploadedPhotos: File[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<File[]>>;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ uploadedPhotos, setUploadedPhotos }) => {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      setUploadedPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label>Attach Photos (Optional)</Label>
      <div className="border-dashed border-2 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
        <Input
          id="photo-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoUpload}
        />
        <Label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
          <p>Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
        </Label>
      </div>
      
      {uploadedPhotos.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium mb-2">Uploaded Photos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden border">
                  <img 
                    src={URL.createObjectURL(photo)} 
                    alt={`Uploaded ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
