import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {TodoService} from "../../services/todo.service";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  LoadingController,
  ToastController
} from "@ionic/angular/standalone";
import {Todo} from "../../services/constants";
import {HttpClient} from "@angular/common/http";
import {Camera, CameraResultType} from "@capacitor/camera";
import {decode} from 'base64-arraybuffer';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonButtons, IonBackButton, IonTitle, IonContent, IonToolbar, IonCard, IonButton, IonImg, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonSkeletonText]
})
export class DetailsPage implements OnInit {
  todo?: Todo;
  todoImage?: string;

  private httpClient = inject(HttpClient)

  constructor(
      private route: ActivatedRoute,
      private todoService: TodoService,
      private loadingController: LoadingController,
      private toastController: ToastController,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.todoService.getTodoById(id).subscribe((res) => {
        console.log(res);
        this.todo = res;
        this.loadImage();
      });
    }
  }

  loadImage() {
    if (this.todo && this.todo.img) {
      this.httpClient.get(this.todo.img, { responseType: 'blob' }).subscribe({
        next: (res) => {
          this.todoImage = URL.createObjectURL(res);
        },
      });
    }
  }

  async update() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.todoService.updateTodo(this.todo).subscribe(async (res) => {
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: 'Task updated!',
        duration: 3000,
      });
      toast.present();
    });
  }


  async selectImage() {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });

    if (photo && photo.base64String) {
      const blob = new Blob([new Uint8Array(decode(photo.base64String))], {
        type: `image/${photo.format}`,
      });

      const loading = await this.loadingController.create();
      await loading.present();

      this.todoService.uploadImage(this.todo!._id, blob).subscribe((res) => {
        this.todo = res;
        loading.dismiss();
        this.loadImage();
      });
    }
  }

}
