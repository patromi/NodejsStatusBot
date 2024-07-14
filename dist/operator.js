"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = void 0;
const enums_1 = __importDefault(require("./static/enums"));
class Operator {
    getActivityStatus(market) {
        if (this.isGlobalDay(this.items.pausedGlobal.pausedDays, market.datetime)) {
            return [enums_1.default.pausedGlobal];
        }
        let activityArray = [];
        const operationDict = this.evaluateActivities(market);
        const triggeredActivities = this.getTriggeredActivities(operationDict);
        if (triggeredActivities.length === 1) {
            return triggeredActivities;
        }
        else if (triggeredActivities.length === 0) {
            return [this.defaultActivity.key];
        }
        activityArray.push(...triggeredActivities);
        const connectedActivities = this.findConnectedActivities(triggeredActivities);
        if (connectedActivities) {
            activityArray.push(connectedActivities);
        }
        return activityArray;
    }
    isGlobalDay(days, marketDatetime) {
        return days.includes(new Date(marketDatetime).toLocaleString('en-us', { weekday: 'long' }));
    }
    evaluateCondition(value, condition, marketValue) {
        const conditionMap = {
            '>': (a, b) => a > b,
            '<': (a, b) => a < b,
            '>=': (a, b) => a >= b,
            '<=': (a, b) => a <= b,
            '==': (a, b) => a === b,
            '!=': (a, b) => a !== b
        };
        const evaluate = conditionMap[condition];
        if (evaluate) {
            return evaluate(marketValue, value);
        }
        else {
            throw new Error(`Invalid condition: ${condition}`);
        }
    }
    evaluateActivities(market) {
        let operationDict = Object.assign({}, this.activitiesName);
        for (const key in this.items.activities[0]) {
            if (this.items.activities[0].hasOwnProperty(key)) {
                const activityOptions = this.items.activities[0][key];
                if (Array.isArray(activityOptions)) {
                    for (const option of activityOptions) {
                        if (market.sessions.some(city => option.sessions.includes(city)) && this.evaluateCondition(option.spread, option.conditionSpread, market.spread)) {
                            operationDict[key] = true;
                        }
                    }
                }
            }
        }
        return this.convertOperationDictToArray(operationDict);
    }
    convertOperationDictToArray(obj) {
        const toSnakeCase = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value === true) {
                acc[toSnakeCase(key)] = value;
            }
            return acc;
        }, {});
    }
    getTriggeredActivities(operationDict) {
        return Object.keys(operationDict).filter(key => operationDict[key]);
    }
    findConnectedActivities(triggeredActivities) {
        for (const activity in this.items.activitiesConnections) {
            const activitiesConnections = this.items.activitiesConnections[activity].activeStatus;
            if (activitiesConnections.length !== triggeredActivities.length) {
                continue;
            }
            if (activitiesConnections.every((activity) => triggeredActivities.includes(activity))) {
                return this.convertToSnakeCase(activity);
            }
        }
        return null;
    }
    convertToSnakeCase(str) {
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
}
exports.Operator = Operator;
