import { Injectable } from '@angular/core';
import { map, takeWhile, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  public timers: Record<string, number> = {};

  public max = 60;

  startTimer(id: string) {
    if (!this.timers[id]) {
      timer(0, 1000)
        .pipe(
          map((val) => this.max - val),
          takeWhile((val) => val >= 0),
        )
        .subscribe({
          next: (v) => {
            this.timers[id] = v;
          },
          complete: () => {
            delete this.timers[id];
          },
        });
    }
  }

  // startTimer(id: string) {
  //   const startTime = Date.now();

  //   if (!this.timers[id]) {
  //     const interval = setInterval(() => {
  //       const currentTime = Date.now();
  //       const elapsedTime = (currentTime - startTime) / 1000;
  //       const remainingTime = this.max - elapsedTime;

  //       if (remainingTime <= 0) {
  //         delete this.timers[id];
  //         clearInterval(interval);
  //       } else {
  //         this.timers[id] = Math.ceil(remainingTime);
  //       }
  //     }, 1000);
  //   }
  // }
}
