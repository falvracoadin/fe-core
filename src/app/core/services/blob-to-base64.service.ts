import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BlobToBase64Service {
  constructor() {}

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
