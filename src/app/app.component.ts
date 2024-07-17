import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElectronService } from '../electron.service';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  title = 'electron-app';
  imageUrl:string = "";
  constructor(private electronService: ElectronService, private imageService: ImageService) {}


  ngOnInit(){

  }

  async changeit(){
    try {
      const result = await this.electronService.openImage();
      console.log('Result:', result);
    } catch (error) {
      console.error('Error calling preload function:', error);
    }
  }

  changewithurl() {
    if(!this.imageUrl.trim()) return;
    try {
      this.imageService.getBase64ImageFromURL(this.imageUrl).subscribe(
        base64Promise => {
          base64Promise.then(str => {
            console.log(str);
            this.electronService.updateWithBase64(str.replace(/^data:image\/(png|jpg|jpeg|bmp);base64,/, ""));
          })
        },
        error => {
          console.error('Error fetching image:', error);
        }
      );
      // this.electronService.updateWithImageUrl(this.imageUrl);
    } catch (error) {
      console.log(error)
    }
  }
}
