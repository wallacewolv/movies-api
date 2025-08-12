import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AlertServiceInterface } from '@core/contracts/alert/service/alert-service.interface';
import { Route } from '@core/utils/enums/route.enum';
import { AuthGatewayInterface } from '@infra/interfaces/auth/auth-gateway.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private readonly authGateway = inject(AuthGatewayInterface);
  private readonly alertService = inject(AlertServiceInterface);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.minLength(5)]],
      senha: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    const request = this.loginForm.getRawValue();

    this.authGateway.login(request).subscribe({
      next: () => {
        this.router.navigate([Route.MOVIES]);
      },
      error: (error) => {
        this.alertService.show(error);
      },
    });
  }
}
