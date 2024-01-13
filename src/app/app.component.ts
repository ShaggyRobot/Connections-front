import { Component } from '@angular/core';
import { tuiToggleOptionsProvider } from '@taiga-ui/kit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    tuiToggleOptionsProvider({
      icons: {
        toggleOff: 'tuiIconMoon',
        toggleOn: 'tuiIconSun',
      },
      showIcons: true,
      singleColor: true,
    }),
  ],
})
export class AppComponent {
  title = 'connections';
  public theme = false;

  handleTheme(val: boolean) {
    this.theme = val;
    val ? localStorage.setItem('night', '') : localStorage.removeItem('night');
  }
}
