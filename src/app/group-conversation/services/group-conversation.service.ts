import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { TimerService } from 'src/app/list-page/services/timer.service';

export type TGroupConversationHttpResponse = {
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
export class GroupConversationService {
  constructor(
    private http: HttpClient,
    private timer: TimerService,
  ) {}

  getConversation(id: string, since?: string, withTimer?: boolean) {
    let params = new HttpParams().set('groupID', id);

    if (since) params = params.set('since', since);

    return this.http
      .get<TGroupConversationHttpResponse>('groups/read', {
        params,
      })
      .pipe(
        tap(() => {
          if (withTimer) this.timer.startTimer(`${id}@group`);
        }),
      );
  }

  sendMessage(groupID: string, message: string) {
    return this.http.post('groups/append', { groupID, message });
  }
}
