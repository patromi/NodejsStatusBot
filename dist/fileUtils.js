"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = void 0;
const fs_1 = __importDefault(require("fs"));
class FileUtils {
    openFile(outputPath) {
        fs_1.default.writeFileSync(outputPath, '[');
    }
    endfile(outputPath) {
        fs_1.default.appendFileSync(outputPath, `{"generated_at":"${new Date().toISOString()}"}]`);
    }
    writeToFile(outputPath, marketData) {
        console.log("writing to file");
        this.openFile(outputPath);
        marketData.forEach((marketData) => {
            fs_1.default.appendFileSync(outputPath, JSON.stringify(marketData) + ',');
        });
        this.endfile(outputPath);
    }
}
exports.FileUtils = FileUtils;
