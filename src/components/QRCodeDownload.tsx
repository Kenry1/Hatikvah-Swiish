
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeDownloadProps {
  appUrl: string;
  size?: number;
}

const QRCodeDownload: React.FC<QRCodeDownloadProps> = ({ appUrl, size = 150 }) => {
  return (
    <Card className="max-w-md mx-auto mt-6">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Mobile Testing</CardTitle>
        <CardDescription className="text-center">
          Scan this QR code to open the app on your mobile device
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <div className="border-4 border-background p-2 rounded-md shadow-md">
          <QRCodeSVG
            value={appUrl}
            size={size}
            bgColor="#ffffff"
            fgColor="#000000"
            level="L"
            includeMargin={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDownload;
