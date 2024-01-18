import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
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
import {
  TUI_SANITIZER,
  TuiAlertModule,
  TuiDialogModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { appInterceptorFn } from 'src/app/core/interceptors/appInterceptorFn';
import { APP_ROUTES } from 'src/app/app.routes';
import { GroupsListEffects } from 'src/app/store/effects/groups-list-effects';
import { groupsListReducer } from 'src/app/store/reducers/groupsList.reducer';
import { usersListReducer } from 'src/app/store/reducers/users.reducer';
import { conversationsListReducer } from 'src/app/store/reducers/conversationsList.reducer';
import { UsersListEffects } from 'src/app/store/effects/users-list-effects';
import { ConversationsListEffects } from 'src/app/store/effects/conversations-list-effects';
// eslint-disable-next-line import/no-extraneous-dependencies
import { provideStoreDevtools } from '@ngrx/store-devtools';

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(TuiRootModule, TuiDialogModule, TuiAlertModule),
    provideHttpClient(withInterceptors([appInterceptorFn])),
    provideAnimations(),
    provideStore({
      auth: authReducer,
      httpLoading: httpLoadingReducer,
      groupConversations: groupConversationsReducer,
      personalConversations: personalConversationsReducer,
      groupsList: groupsListReducer,
      usersList: usersListReducer,
      conversationsList: conversationsListReducer,
    }),
    provideStoreDevtools(),
    provideEffects([
      AuthEffects,
      GroupConversationsEffects,
      PersonalConversationsEffects,
      GroupsListEffects,
      UsersListEffects,
      ConversationsListEffects,
    ]),
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    // { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    provideRouter(APP_ROUTES),
  ],
  // eslint-disable-next-line no-console
}).catch((e) => console.error(e));
