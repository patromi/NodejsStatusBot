"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const fs_1 = __importDefault(require("fs"));
class Config {
    constructor(configPath, marketdataPath, outputPath) {
        this.config = {};
        this.readConfig(this.checkFileExists(configPath));
        this.items = this.config.items[0];
        this.activitiesName = Object.keys(this.items.activities[0]).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});
        this.outputPath = outputPath;
        this.marketdataPath = this.checkFileExists(marketdataPath);
        this.defaultActivity = this.findDefaultStatusTrue()[0];
    }
    checkFileExists(configPath) {
        if (!fs_1.default.existsSync(configPath)) {
            throw new Error('All files cant be found.');
        }
        return configPath;
    }
    readConfig(ConfigPath) {
        const openFile = fs_1.default.readFileSync(ConfigPath, { encoding: 'utf8' });
        this.config = this.convertKeysToCamelCase(JSON.parse(openFile));
    }
    snakeToCamel(key) {
        return key.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
    }
    convertKeysToCamelCase(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => (typeof item === 'object' ? this.convertKeysToCamelCase(item) : item));
        }
        else if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((acc, key) => {
                const camelCaseKey = this.snakeToCamel(key);
                acc[camelCaseKey] = this.convertKeysToCamelCase(obj[key]);
                return acc;
            }, {});
        }
        return obj;
    }
    findDefaultStatusTrue() {
        const results = [];
        this.searchDefaultStatus(this.items, results, null);
        return results;
    }
    searchDefaultStatus(obj, results, previousKey) {
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
exports.Config = Config;
