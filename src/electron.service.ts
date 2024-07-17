import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private electron: any;

  constructor() {
    this.electron = (window as any).electronAPI;
  }

  openImage(): Promise<any> {
    if (this.electron) {
      return this.electron.openImage((result:any) => {
        console.log(result)
      });
    }
    return Promise.reject('Electron API not available');
  }

  updateWithImageUrl(imageUrl: any) {
    if (this.electron) {
        console.log(imageUrl)
        this.electron.updateImageWithUrl(imageUrl, () => {
            alert("Wallpaper is changed.")
        });
    }
  }

  updateWithBase64(base64: any) {
    if (this.electron) {
        this.electron.updateWithBase64(base64, (result: any) => {
            /* alert("Wallpaper is changed.") */
            console.log(result)
        });
    }
  }
}