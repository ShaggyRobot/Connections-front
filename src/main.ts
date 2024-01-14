import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { importProvidersFrom } from '@angular/core';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { authReducer } from 'src/app/store/reducers/auth.reducer';
import { httpLoadingReducer } from 'src/app/store/reducers/httpLoading.reducer';
import { groupConversationsReducer } from 'src/app/store/reducers/groupConversations.reducer';
import { personalConversationsReducer } from 'src/app/store/reducers/personalConversations.reducer';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from 'src/app/store/effects/auth-effects';
import { GroupConversationsEffects } from 'src/app/store/effects/group-conversations-effects';
import { PersonalConversationsEffects } from 'src/app/store/effects/personal-conversations.effects';
import { TUI_SANITIZER, TuiRootModule } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appInterceptorFn } from 'src/app/core/interceptors/appInterceptorFn';
import { APP_ROUTES } from 'src/app/app.routes';

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(TuiRootModule),
    provideHttpClient(withInterceptors([appInterceptorFn])),
    provideAnimations(),
    provideStore({
      auth: authReducer,
      httpLoading: httpLoadingReducer,
      groupConversations: groupConversationsReducer,
      personalConversations: personalConversationsReducer,
    }),
    provideStoreDevtools(),
    provideEffects([
      AuthEffects,
      GroupConversationsEffects,
      PersonalConversationsEffects,
    ]),
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    // { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    provideRouter(APP_ROUTES),
  ],
}).catch((e) => console.error(e));
