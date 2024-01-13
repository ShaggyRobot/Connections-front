import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
  TuiButtonModule,
  TuiThemeNightModule,
  TuiTextfieldControllerModule,
  TuiLoaderModule,
} from '@taiga-ui/core';

import { TuiInputModule, TuiToggleModule } from '@taiga-ui/kit';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from 'src/app/core/interceptors/app-interceptor';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from 'src/app/store/reducers/auth.reducer';
import { AuthEffects } from 'src/app/store/effects/auth-effects';
import { TuiSurfaceModule } from '@taiga-ui/experimental';
import { httpLoadingReducer } from 'src/app/store/reducers/httpLoading.reducer';
import { groupConversationsReducer } from 'src/app/store/reducers/groupConversations.reducer';
import { GroupConversationsEffects } from 'src/app/store/effects/group-conversations-effects';
import { personalConversationsReducer } from 'src/app/store/reducers/personalConversations.reducer';
import { PersonalConversationsEffects } from 'src/app/store/effects/personal-conversations.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    ReactiveFormsModule,

    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiButtonModule,
    TuiThemeNightModule,
    TuiToggleModule,
    TuiSurfaceModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiLoaderModule,

    CoreModule,

    StoreModule.forRoot({
      auth: authReducer,
      httpLoading: httpLoadingReducer,
      groupConversations: groupConversationsReducer,
      personalConversations: personalConversationsReducer,
    }),

    EffectsModule.forRoot([
      AuthEffects,
      GroupConversationsEffects,
      PersonalConversationsEffects,
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() , connectInZone: true}),
  ],
  providers: [
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
