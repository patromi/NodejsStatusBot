export interface MarketData {
    datetime: string;
    spread: number;
    sessions: string[];
    volume: number;
    average_price: number;
    price_change: number;
    status: string | null;
}

export interface JsonObject {
    [key: string]: any;
}

export interface ActivitiesName {
    [key: string]: boolean;
}

export interface DefaultActivity {
    [key: string]: string;
}
export interface ConfigType {
    activitiesName: ActivitiesName;
    items: JsonObject;
    outputPath: string;
    marketdataPath: string;
    defaultActivity: DefaultActivity;

}