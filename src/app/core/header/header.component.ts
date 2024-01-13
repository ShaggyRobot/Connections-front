import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { tuiToggleOptionsProvider } from '@taiga-ui/kit';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [
    tuiToggleOptionsProvider({
      icons: {
        toggleOff: 'tuiIconSun',
        toggleOn: 'tuiIconMoon',
      },
      showIcons: true,
      singleColor: true,
    }),
  ],
  animations: [
    trigger('fadeIn', [
      transition('*=>logged', [
        style({ opacity: 0, transform: 'rotateY(0deg)', scale: 0.5 }),
        animate(
          '1s ease-in',
          style({ opacity: 1, transform: 'rotateY(540deg)', scale: 1 }),
        ),
      ]),
      transition('logged=>*', [animate('1s ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HeaderComponent {
  logged: Observable<boolean>;
  @Output() theme: BehaviorSubject<boolean> = new BehaviorSubject(
    !(localStorage.getItem('night') === null),
  );

  form = this.fb.group({
    night: this.theme.value,
  });

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
  ) {
    this.form.get('night')?.valueChanges.subscribe((val) => {
      if (val !== null) {
        this.theme.next(val);
      }
    });

    this.logged = this.auth.isLoggedIn$;
  }
}
