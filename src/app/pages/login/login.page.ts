import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {AlertController, LoadingController} from "@ionic/angular/standalone";
import {Router, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class LoginPage implements OnInit {

  private formBuilder = inject(FormBuilder);
  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })

  constructor(
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
    ) { }

  ngOnInit() {
  }

  async onSubmit() {
    const { email, password } = this.loginForm.getRawValue();

    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });
    await loading.present();

    this.authService.login(email, password).subscribe({
      next: (res) => {
        loading.dismiss();
        this.router.navigateByUrl('/app', { replaceUrl: true });
      },
      error: async (err) => {
        console.log(err);

        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Registration failed: ' + err.error.msg,
          buttons: ['OK'],
        });

        await alert.present();
      },
    });
  }
}
