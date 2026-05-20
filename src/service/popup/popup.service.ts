import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { PopupMessage } from '../../model/popup-message/popup-message';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService implements OnDestroy {
  $refresh_interval: Subscription | null = null;
  popups: PopupMessage[] = [];

  constructor() {
    this.popups = [];
    this.$refresh_interval = interval(50).subscribe(() => this.refresh());
  }

  ngOnDestroy() {
    this.$refresh_interval!.unsubscribe();
  }

  add(popup: PopupMessage) {
    this.popups.push(popup);
  }

  close(popup: PopupMessage) {
    this.popups = this.popups.filter(p => p !== popup);
  }

  refresh() {
    this.popups.filter(p => p.timeLeft() <= 0).forEach(p => this.close(p));
    this.popups.forEach(p => p.setOpacity());
  }
}
