import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController } from '@ionic/angular';
import { ApisService } from '../core/services/apis.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  photoUrl: string = 'assets/photo.png'; // Variable para almacenar la URL de la imagen
  isModalOpen = false;
  data = ''

  constructor(private apiService: ApisService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  takePicture = async () => {
    console.log('TAKE PICTURE...')
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    await this.uploadPhoto(image.base64String);

    // image.base64String contiene la imagen en formato base64
    console.log(image.base64String);
  }

  selectFromGallery = async () => {
    console.log('SELECT GALLERY')
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Usa 'photos' directamente
    });

    await this.uploadPhoto(image.base64String);
  }

  uploadPhoto = async (base64Image: any) => {
    const formData = new FormData();
    const blob = this.base64ToBlob(base64Image);

    formData.append('file', blob, 'image.jpg'); // 'file' is the field name expected by the server

    this.showLoading()
    await this.apiService.processDocument(formData).then(data => {
      console.log(data)
      this.data = data.data
      this.isModalOpen = true
    }).catch(err => {
      console.log("Error....")
      console.log(err)
    })

  }

  private base64ToBlob(base64Data: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' }); // Adjust the MIME type accordingly
  }

  setOpen(status: boolean) {
    this.isModalOpen = status
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Consultando...',
      duration: 4000,
    });

    loading.present();
  }

}
