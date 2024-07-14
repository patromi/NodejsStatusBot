"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketData = void 0;
class MarketData {
    constructor(datetime, spread, sessions, volume, average_price, price_change) {
        this.datetime = datetime;
        this.spread = spread;
        this.sessions = sessions;
        this.volume = volume;
        this.average_price = average_price;
        this.price_change = price_change;
        this.status = null;
    }
    printSummary() {
        console.log(`Market Data: ${this.sessions} ${this.datetime} - ${this.spread}`);
    }
}
exports.MarketData = MarketData;
