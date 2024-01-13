import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import {
  TConversation,
  TConversationsListHttpResponse,
} from 'src/app/list-page/models/list-page.model';
import { TimerService } from 'src/app/list-page/services/timer.service';

export type TPersonalConversationHttpResponse = {
  Count: number;
  Items: {
    authorID: {
      S: string;
    };
    message: {
      S: string;
    };
    createdAt: {
      S: string;
    };
  }[];
};

@Injectable({
  providedIn: 'root',
})
export class PersonalConversationService {
  public conversationsList: TConversation[] | null = null;
  private conversations = new BehaviorSubject<TConversation[]>([]);
  public conversations$ = this.conversations.asObservable();

  constructor(
    private http: HttpClient,
    private timer: TimerService,
  ) {}

  getConversation(id: string, since?: string, withTimer?: boolean) {
    let params = new HttpParams().set('conversationID', id);

    if (since) params = params.set('since', since);

    return this.http
      .get<TPersonalConversationHttpResponse>('conversations/read', { params })
      .pipe(
        tap(() => {
          if (withTimer) this.timer.startTimer(id);
        }),
      );
  }

  getConversations(): Observable<TConversation[]> {
    return this.http
      .get<TConversationsListHttpResponse>('conversations/list')
      .pipe(
        map((response) =>
          response.Items.map(
            ({ id, companionID }): TConversation => ({
              id: id.S,
              companionId: companionID.S,
            }),
          ),
        ),
        tap((conversations) => {
          this.conversations.next(conversations);
          this.conversationsList = conversations;
        }),
        catchError((e) => throwError(() => e)),
      );
  }

  sendMessage(conversationID: string, message: string) {
    return this.http.post('conversations/append', { conversationID, message });
  }

  createConversation(companion: string) {
    return this.http
      .post<{ conversationID: string }>('conversations/create', {
        companion,
      })
      .pipe(
        tap((response) => {
          this.conversations.next([
            ...this.conversations.getValue(),
            { id: response.conversationID, companionId: companion },
          ]);
        }),
      );
  }

  deleteConversation(conversationId: string) {
    const params = new HttpParams().set('conversationID', conversationId);
    return this.http.delete('conversations/delete', { params }).pipe(
      tap(() => {
        this.conversations.next(
          this.conversations
            .getValue()
            .filter((value) => value.id !== conversationId),
        );
      }),
    );
  }

  resetState() {
    this.conversationsList = null;
  }
}
