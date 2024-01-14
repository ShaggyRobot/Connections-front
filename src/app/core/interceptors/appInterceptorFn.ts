import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { environment } from 'src/environments/environment.development';

import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { setHttpLoading } from 'src/app/store/actions/http-loading-actions';
import { catchError, finalize, throwError } from 'rxjs';

export const appInterceptorFn: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const store = inject(Store);

  const {
    params: interceptedParams,
    url: interceptedUrl,
    headers: interceptedHeaders,
  } = request;

  const token = localStorage.getItem('token');
  const uid = localStorage.getItem('uid');
  const email = localStorage.getItem('login');
  let headers = interceptedHeaders;

  if (token) {
    headers = interceptedHeaders
      .append('Authorization', `Bearer ${token}`)
      .append('rs-uid', uid || '')
      .append('rs-email', email || '');
  }

  const params = interceptedParams;
  const url = environment.baseUrl + interceptedUrl;

  const transformedRequest = request.clone({ url, params, headers });

  store.dispatch(setHttpLoading({ loading: true }));

  return next(transformedRequest).pipe(
    catchError((e: HttpErrorResponse) => {
      if (e.status === 400) {
        return throwError(() => e.error);
      }

      if (e.status === 401) {
        const message = e.error?.message || 'Http Error';
        return throwError(() => ({ type: 'InvalidToken', message }));
      }

      const message = e.error?.message || 'Http Error';
      return throwError(() => ({ type: 'Unknown', message }));
    }),
    finalize(() => {
      store.dispatch(setHttpLoading({ loading: false }));
    }),
  );
};
