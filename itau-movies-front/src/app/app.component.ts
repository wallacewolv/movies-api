import { Component, effect, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';

import { AlertService } from './core/alert/alert.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private snackBar = inject(MatSnackBar);
  private alertService = inject(AlertService);

  alertEffect = effect(() => {
    const payload = this.alertService.alertMessage();
    if (payload) {
      this.snackBar.open(payload.message, 'X', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      this.alertService.clear();
    }
  });
}
