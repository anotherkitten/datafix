type MessageType = "info" | "error";

export class PopupMessage {
  type: MessageType;
  text: String;
  created: number;

  opacity: number = 1;
  lifetime: number = 5;

  constructor(type: MessageType, text: String) {
    this.type = type;
    this.text = text;
    this.created = Date.now();
  }

  setOpacity() {
    this.opacity = Math.max(Math.min(this.timeLeft(), 1), 0);
  }

  timeLeft(): number {
	  return this.lifetime - ((Date.now() - this.created) / 1e3);
  }
}