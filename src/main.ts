import { MarketData } from './marketData';
import { Worker } from './worker';
import { Config } from './config';
import { Operator } from './operator';
import { FileUtils } from './fileUtils';
import { ConfigType, JsonObject } from './static/interfaces';
import { Command } from 'commander';


const program = new Command();

program
  .option('-c, --config <path>', 'Path to the configuration file', './conf.json')
  .option('-m, --marketdata <path>', 'Path to the market data file', './specific_test.json')
  .option('-o, --output <path>', 'Path to the output file', './bot_status.json')
  .parse(process.argv);

const options = program.opts();



class Main extends Operator {
  config: ConfigType;
  marketArray: MarketData[];
  resultArray: MarketData[];
  items: JsonObject;
  outputPath: string;
  file: FileUtils;
  marketdataPath: string;

  constructor() {
    super();
    this.config = new Config(options.config, options.marketdata,options.output);
    this.file = new FileUtils();
    
    
    this.marketArray = [];
    this.resultArray = [];
    this.items = {};
    this.outputPath = '';
    this.marketdataPath = '';


    this.initializeConfigItems();
    this.initializeWorker();
    this.iterateMarketData();
  }

  private initializeConfigItems() {
    ({ items: this.items, activitiesName: this.activitiesName, outputPath: this.outputPath, marketdataPath: this.marketdataPath,defaultActivity :this.defaultActivity } = this.config);
  }

  private initializeWorker() {
    const worker = new Worker();

    worker.on('marketData', (marketData: MarketData) => {
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

  private async iterateMarketData() {
    let processedCount = 0;

    while (true) {
      if (this.marketArray.length > 0) {
        const marketData = this.marketArray.shift();
        if (marketData) {
          marketData.status = this.getActivityStatus(marketData);
          this.resultArray.push(marketData);
          processedCount++;
        }
      } else if (processedCount === 0) {
        await this.delay(100);
      } else {
        await this.delay(5000);
        this.file.writeToFile(this.outputPath, this.resultArray);
        if (this.marketArray.length === 0 && processedCount > 0) {
          break;
        }
      }
    }

    console.log('Writing to file completed.');
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const main = new Main();
