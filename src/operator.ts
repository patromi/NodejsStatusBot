import { MarketData } from './marketData';
import { ActivitiesName, DefaultActivity, JsonObject } from './static/interfaces';
import ActivitiesStatus from './static/enums';


export class Operator {
    items!: JsonObject;
    config!: JsonObject;
    activitiesName!: ActivitiesName;
    defaultActivity!: DefaultActivity;

    public getActivityStatus(market: MarketData): Array<string> {
        if (this.isGlobalDay(this.items.pausedGlobal.pausedDays, market.datetime)) {
            return [ActivitiesStatus.pausedGlobal];
        }

        let activityArray= []; 
        const operationDict = this.evaluateActivities(market);

        const triggeredActivities = this.getTriggeredActivities(operationDict);

        if (triggeredActivities.length === 1) {
            return triggeredActivities;
        } else if (triggeredActivities.length === 0) {
            return [this.defaultActivity.key];
        }
        activityArray.push(...triggeredActivities);

        const connectedActivities = this.findConnectedActivities(triggeredActivities); 
        if (connectedActivities) {
            activityArray.push(connectedActivities);
        }
        return activityArray;
    }

    private isGlobalDay(days: string[], marketDatetime: string): boolean {
        return days.includes(new Date(marketDatetime).toLocaleString('en-us', { weekday: 'long' }));
    }

    private evaluateCondition(value: number, condition: string, marketValue: number): boolean {
        const conditionMap: { [key: string]: (a: number, b: number) => boolean } = {
            '>': (a, b) => a > b,
            '<': (a, b) => a < b,
            '>=': (a, b) => a >= b,
            '<=': (a, b) => a <= b,
            '==': (a, b) => a === b,
            '!=': (a, b) => a !== b
        };

        const evaluate = conditionMap[condition];
        if (evaluate) {
            return evaluate(marketValue,value);
        } else {
            throw new Error(`Invalid condition: ${condition}`);
        }
    }

    private evaluateActivities(market: MarketData): ActivitiesName {
        let operationDict: ActivitiesName = { ...this.activitiesName };

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

    private convertOperationDictToArray(obj: ActivitiesName): ActivitiesName {
        const toSnakeCase = (str: string) => str.replace(/([A-Z])/g, '_$1').toLowerCase();

        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value === true) {
                acc[toSnakeCase(key)] = value;
            }
            return acc;
        }, {} as ActivitiesName);
    }

    private getTriggeredActivities(operationDict: ActivitiesName): string[] {
        return Object.keys(operationDict).filter(key => operationDict[key]);
    }

    private findConnectedActivities(triggeredActivities: string[]): string | null {
        for (const activity in this.items.activitiesConnections) {
            const activitiesConnections = this.items.activitiesConnections[activity].activeStatus;

            if (activitiesConnections.length !== triggeredActivities.length) {
                continue;
            }

            if (activitiesConnections.every((activity: string) => triggeredActivities.includes(activity))) {
                return this.convertToSnakeCase(activity);
            }
        }
        return null

    }

    private convertToSnakeCase(str: string): string {
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
}
