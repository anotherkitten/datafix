import { Component, inject } from '@angular/core';
import { PopupService } from '../../service/popup/popup.service';
import { PopupMessage } from '../../model/popup-message/popup-message';
import { NgForOf } from "../../../node_modules/@angular/common";

@Component({
  selector: 'app-popup-shelf',
  imports: [NgForOf],
  templateUrl: './popup-shelf.component.html',
  styleUrl: './popup-shelf.component.css'
})
export class PopupShelfComponent {
  popups: PopupService = inject(PopupService);

  getPopups(): PopupMessage[] {
    return this.popups.popups;
  }

  closePopup(popup: PopupMessage) {
    this.popups.close(popup);
  }

  testPopup() {
    this.popups.add(new PopupMessage(Math.random() < .7 ? "info" : "error", "testing!!!! testing!!!!"));
  }
}
