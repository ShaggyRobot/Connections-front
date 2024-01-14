
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiRootModule, TuiThemeNightModule } from '@taiga-ui/core';
import { tuiToggleOptionsProvider } from '@taiga-ui/kit';
import { HeaderComponent } from 'src/app/core/header/header.component';

@Component({
  standalone: true,
  imports: [
    HeaderComponent,
    RouterModule,
    TuiRootModule,
    TuiThemeNightModule
],
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
