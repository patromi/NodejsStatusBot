import fs from 'fs';
import { JsonObject } from './static/interfaces';

export class Config {
    config: JsonObject;
    items: JsonObject;
    activitiesName: { [key: string]: boolean };
    outputPath: string;
    marketdataPath: string;
    defaultActivity: { [key: string]: string };

    constructor(configPath: string, marketdataPath: string, outputPath: string) {

        this.config = {};
        this.readConfig(this.checkFileExists(configPath));
        this.items = this.config.items[0];

        this.activitiesName = Object.keys(this.items.activities[0]).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {} as { [key: string]: boolean });

        this.outputPath = outputPath
        this.marketdataPath = this.checkFileExists(marketdataPath);
        this.defaultActivity = this.findDefaultStatusTrue()[0];
    }

    private checkFileExists(configPath: string):string {
        if (!fs.existsSync(configPath)) {
            throw new Error('All files cant be found.');
        }
        return configPath;
    }

    private readConfig(ConfigPath: string): void {
        const openFile = fs.readFileSync(ConfigPath, { encoding: 'utf8' });
        this.config = this.convertKeysToCamelCase(JSON.parse(openFile));
    }

    private snakeToCamel(key: string): string {
        return key.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
    }

    private convertKeysToCamelCase(obj: JsonObject): JsonObject {
        if (Array.isArray(obj)) {
            return obj.map(item => (typeof item === 'object' ? this.convertKeysToCamelCase(item) : item));
        } else if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((acc: any, key: string) => {
                const camelCaseKey = this.snakeToCamel(key);
                acc[camelCaseKey] = this.convertKeysToCamelCase(obj[key]);
                return acc;
            }, {});
        }
        return obj;
    }

    public findDefaultStatusTrue(): JsonObject[] {
        const results: JsonObject[] = [];
        this.searchDefaultStatus(this.items, results,null);
        return results;
    }

    private searchDefaultStatus(obj: JsonObject, results: JsonObject[], previousKey: string | null): void {
        if (obj && typeof obj === 'object') {
            if ('deafultStatus' in obj && obj['deafultStatus'] === "true") {
                results.push({ object: obj, key: previousKey });
            }

            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    this.searchDefaultStatus(obj[key], results, key);
                }
            }
        }
    }
}



