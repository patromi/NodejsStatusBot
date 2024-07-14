export class MarketData {
    datetime: string;
    spread: number;
    sessions: string[];
    volume: number;
    average_price: number;
    price_change: number;
    status: string[] | null;
    
    constructor(
      datetime: string,
      spread: number,
      sessions: string[],
      volume: number,
      average_price: number,
      price_change: number
    ) {
      this.datetime = datetime;
      this.spread = spread;
      this.sessions = sessions;
      this.volume = volume;
      this.average_price = average_price;
      this.price_change = price_change;
      this.status = null;
    }
    public printSummary() {
        console.log(`Market Data: ${this.sessions} ${this.datetime} - ${this.spread}`);
      }
  }
  