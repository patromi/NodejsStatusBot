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
        const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });
        this.saveToFileStream(writeStream, marketData);
        
        this.endfile(outputPath);
    }
    async saveToFileStream(stream: { write: (arg0: string) => void; end: () => void; }, data: string | any[]) {
        stream.write('[');
        for (let i = 0; i < data.length; i++) {
            const jsonString = JSON.stringify(data[i]);
            if (i < data.length - 1) {
                stream.write(jsonString + ',');
            } else {
                stream.write(jsonString);
            }
        }
        stream.write(']');
        stream.end();
    }
}