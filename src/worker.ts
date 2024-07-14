import fs from 'fs';
import { createReadStream } from 'fs';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { EventEmitter } from 'events';
import { MarketData } from './marketData';

export class Worker extends EventEmitter {
  async processMarketJSON(file: string) {
    const jsonStream = createReadStream(file, { encoding: 'utf8' })
      .pipe(parser())
      .pipe(streamArray());

    jsonStream.on('data', ({ value }) => {
      const { datetime, spread, sessions, volume, average_price, price_change } = value;
      const marketData = new MarketData(datetime, spread, sessions, volume, average_price, price_change);
      this.emit('marketData', marketData);
    });

    jsonStream.on('end', () => {
      this.emit('end');
    });

    jsonStream.on('error', (error) => {
      this.emit('error', error);
    });
  }

}
