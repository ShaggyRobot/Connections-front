import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { TProfile } from 'src/app/store/state.model';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/store/actions/auth-actions';
import { personalConversationsActions } from 'src/app/store/actions/personal-conversation-actions';
import { groupConversationsActions } from 'src/app/store/actions/group-conversations-actions';
import { Router } from '@angular/router';
import { ListPageService } from 'src/app/list-page/services/list-page.service';
import { PersonalConversationService } from 'src/app/personal-conversation/services/personal-conversation.service';

export type TSignUpFormData = { email: string; name: string; password: string };

type TAuthUpResponse = {
  OK: boolean;
  type?: string;
  message?: string;
  token?: string;
  uid?: string;
};

type TProfileResponseBody = {
  email: {
    S: string;
  };
  name: {
    S: string;
  };
  uid: {
    S: string;
  };
  createdAt: {
    S: string;
  };
};

export type TSignInFormData = Pick<TSignUpFormData, 'email' | 'password'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public uid$ = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private store: Store,
    private router: Router,
    private listPageService: ListPageService,
    private conversationsService: PersonalConversationService,
  ) {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');

    if (uid) {
      this.uid$.next(uid);
    }

    if (token) {
      this.isLoggedInSubject.next(true);
    }
  }

  checkLS() {
    if (
      !['token', 'uid', 'login'].every((entry) => localStorage.getItem(entry))
    ) {
      this.isLoggedInSubject.next(false);
    }
  }

  signUp(formData: TSignUpFormData) {
    return this.http
      .post('registration', formData, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<Partial<TAuthUpResponse>>): TAuthUpResponse => {
          this.isLoggedInSubject.next(true);
          return { OK: true };
        }),
        catchError((err) => throwError(() => err)),
      );
  }

  signIn(formData: TSignInFormData) {
    return this.http.post('login', formData, { observe: 'response' }).pipe(
      tap((res: HttpResponse<Partial<TAuthUpResponse>>) => {
        this.isLoggedInSubject.next(true);

        const profileData = {
          token: res.body?.token,
          uid: res.body?.uid,
          login: formData.email,
        };

        res.body?.uid && this.uid$.next(res.body?.uid);

        Object.entries(profileData).forEach((entry) => {
          localStorage.setItem(entry[0], String(entry[1]));
        });
      }),
      catchError((e) => throwError(() => e)),
    );
  }

  logOut() {
    return this.http.delete('logout').pipe(
      tap(() => {
        this.isLoggedInSubject.next(false);

        this.uid$.next('');

        this.store.dispatch(authActions.profileResetProfileState());
        this.store.dispatch(
          personalConversationsActions.resetPersonalConversation(),
        );
        this.store.dispatch(groupConversationsActions.resetGroupConversation());

        this.conversationsService.resetState();
        this.listPageService.resetState();

        ['token', 'uid', 'login'].forEach((entry) => {
          localStorage.removeItem(entry);
        });
      }),

      catchError((e) => {
        if (e.type === 'InvalidToken') {
          ['token', 'uid', 'login'].forEach((entry) => {
            localStorage.removeItem(entry);
          });
        }

        this.router.navigate(['/auth/signin']);

        return throwError(() => e);
      }),
    );
  }

  getProfile(): Observable<TProfile> {
    return this.http
      .get<TProfileResponseBody>('profile', { observe: 'response' })
      .pipe(
        map((res) => {
          return {
            name: res.body?.name.S,
            email: res.body?.email.S,
            uid: res.body?.uid.S,
            createdAt: res.body?.createdAt.S,
          };
        }),
        tap((data) => {
          data.uid && this.uid$.next(data.uid);
        }),
        catchError((e) => throwError(() => e)),
      );
  }

  updateName(name: string) {
    return this.http.put('profile', { name }).pipe(
      map((res) => {
        return name;
      }),
      catchError((e) => throwError(() => e)),
    );
  }
}
