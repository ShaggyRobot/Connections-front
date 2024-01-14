import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,

    TuiButtonModule
  ],
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  constructor(public auth: AuthService) {}
}
