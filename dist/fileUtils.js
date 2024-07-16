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
        const writeStream = fs_1.default.createWriteStream(outputPath, { encoding: 'utf8' });
        this.saveToFileStream(writeStream, marketData);
        this.endfile(outputPath);
    }
    saveToFileStream(stream, data) {
        return __awaiter(this, void 0, void 0, function* () {
            stream.write('[');
            for (let i = 0; i < data.length; i++) {
                const jsonString = JSON.stringify(data[i]);
                if (i < data.length - 1) {
                    stream.write(jsonString + ',');
                }
                else {
                    stream.write(jsonString);
                }
            }
            stream.write(']');
            stream.end();
        });
    }
}
exports.FileUtils = FileUtils;
