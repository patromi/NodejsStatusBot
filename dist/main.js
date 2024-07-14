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
const worker_1 = require("./worker");
const config_1 = require("./config");
const operator_1 = require("./operator");
const fileUtils_1 = require("./fileUtils");
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .option('-c, --config <path>', 'Path to the configuration file', './conf.json')
    .option('-m, --marketdata <path>', 'Path to the market data file', './specific_test.json')
    .option('-o, --output <path>', 'Path to the output file', './bot_status.json')
    .parse(process.argv);
const options = program.opts();
class Main extends operator_1.Operator {
    constructor() {
        super();
        this.config = new config_1.Config(options.config, options.marketdata, options.output);
        this.file = new fileUtils_1.FileUtils();
        this.marketArray = [];
        this.resultArray = [];
        this.items = {};
        this.outputPath = '';
        this.marketdataPath = '';
        this.initializeConfigItems();
        this.initializeWorker();
        this.iterateMarketData();
    }
    initializeConfigItems() {
        ({ items: this.items, activitiesName: this.activitiesName, outputPath: this.outputPath, marketdataPath: this.marketdataPath, defaultActivity: this.defaultActivity } = this.config);
    }
    initializeWorker() {
        const worker = new worker_1.Worker();
        worker.on('marketData', (marketData) => {
            this.marketArray.push(marketData);
        });
        worker.on('end', () => {
            console.log('Processing completed.');
        });
        worker.on('error', (error) => {
            console.error('Error processing market data:', error);
        });
        worker.processMarketJSON(this.marketdataPath);
    }
    iterateMarketData() {
        return __awaiter(this, void 0, void 0, function* () {
            let processedCount = 0;
            while (true) {
                if (this.marketArray.length > 0) {
                    const marketData = this.marketArray.shift();
                    if (marketData) {
                        marketData.status = this.getActivityStatus(marketData);
                        this.resultArray.push(marketData);
                        processedCount++;
                    }
                }
                else if (processedCount === 0) {
                    yield this.delay(100);
                }
                else {
                    yield this.delay(5000);
                    this.file.writeToFile(this.outputPath, this.resultArray);
                    if (this.marketArray.length === 0 && processedCount > 0) {
                        break;
                    }
                }
            }
            console.log('Writing to file completed.');
        });
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
const main = new Main();
