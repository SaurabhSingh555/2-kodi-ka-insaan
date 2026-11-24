/// <reference types="vite/client" />

declare module "*/config.js" {
  export const CONFIG: {
    brandName: string;
    websiteUrl: string;
    upiId: string;
    receiverName: string;
    amount: number;
    qrImage: string;
  };
}
