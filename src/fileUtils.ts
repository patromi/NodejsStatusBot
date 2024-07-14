import fs from 'fs';
import { MarketData } from './marketData';

export class FileUtils {
        
    private openFile(outputPath: string) {
            fs.writeFileSync(outputPath, '[');
    }


    private endfile(outputPath: string) {
        fs.appendFileSync(outputPath, `{"generated_at":"${new Date().toISOString()}"}]`);
    }

    
    public writeToFile(outputPath: string, marketData: MarketData[]) {
        console.log("writing to file");
        this.openFile(outputPath);
        marketData.forEach((marketData) => {
            fs.appendFileSync(outputPath, JSON.stringify(marketData) + ',');
        });
        this.endfile(outputPath);
    }
}