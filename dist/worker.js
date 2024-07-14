"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const fs_1 = require("fs");
const stream_json_1 = require("stream-json");
const StreamArray_1 = require("stream-json/streamers/StreamArray");
const events_1 = require("events");
const marketData_1 = require("./marketData");
class Worker extends events_1.EventEmitter {
    processMarketJSON(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsonStream = (0, fs_1.createReadStream)(file, { encoding: 'utf8' })
                .pipe((0, stream_json_1.parser)())
                .pipe((0, StreamArray_1.streamArray)());
            jsonStream.on('data', ({ value }) => {
                const { datetime, spread, sessions, volume, average_price, price_change } = value;
                const marketData = new marketData_1.MarketData(datetime, spread, sessions, volume, average_price, price_change);
                this.emit('marketData', marketData);
            });
            jsonStream.on('end', () => {
                this.emit('end');
            });
            jsonStream.on('error', (error) => {
                this.emit('error', error);
            });
        });
    }
}
exports.Worker = Worker;
