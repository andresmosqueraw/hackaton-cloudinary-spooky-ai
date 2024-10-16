"use client"

import { useState } from 'react'
import { CldUploadWidget, getCldImageUrl } from 'next-cloudinary'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"
import { Upload, RefreshCw } from "lucide-react"

interface CloudinaryResult {
  info: {
    secure_url: string
    public_id: string
  }
}

export function UploadImageComponent() {
  const [resource, setResource] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = (results: any) => {
    const { info } = results;
    if (info && info.secure_url) {
      const { secure_url, public_id } = info;
      console.log('Secure URL:', secure_url);
      console.log('Public ID:', public_id);
      // Generate a Halloween-themed URL
      const halloweenUrl = `https://res.cloudinary.com/dceqfzpbx/image/upload/e_blur:500/e_tint:100:orange:purple:black/c_fill,w_600,h_600,g_auto/f_auto/q_auto/v1/${public_id}.jpg`;
      console.log('Generated URL:', halloweenUrl);
      setResource(halloweenUrl);
    }
    setIsUploading(false);
    setError(null);
  }

  const handleError = (error: any) => {
    setError("An error occurred while uploading. Please try again.")
    setIsUploading(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <CldUploadWidget
              uploadPreset="ml_default"
              onSuccess={handleUpload}
              onError={handleError}
              onQueuesStart={() => setIsUploading(true)}
            >
              {({ open }) => (
                <Button 
                  onClick={() => {
                    setResource(null)
                    setError(null)
                    open()
                  }}
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload a Selfie
                    </>
                  )}
                </Button>
              )}
            </CldUploadWidget>
          </CardContent>
        </Card>

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        {(resource || isUploading) && (
          <Card>
            <CardContent className="pt-6">
              <AspectRatio ratio={1 / 1}>
                {isUploading ? (
                  <Skeleton className="w-full h-full" />
                ) : resource ? (
                  <img 
                    src={resource} 
                    alt="Uploaded selfie" 
                    className="rounded-md object-cover w-full h-full"
                  />
                ) : null}
              </AspectRatio>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
