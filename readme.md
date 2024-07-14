# Solution
- Author: [Patryk Migaj]
- The solution is located in the `src` directory, and the main file is main.ts
- The solution is written in TypeScript 

# How to run

- All paramaters are configurable can be shown in --help command
- The solution can be run by the following command
```bash
npm install
npm start (on default config file)
node dist/main.js (if you want to run with parameters -mco)

```

## Example Config file
```json
{
    "items": [
        {
            "activities": [
                {
                    "active_us": [
                        {
                            "spread": 0.2,
                            "condition_spread": "<=",
                            "sessions": [
                                "New York",
                                "London"
                            ]
                        },
                        {
                            "spread": 0.1,
                            "condition_spread": "<=",
                            "sessions": [
                                "Sydney"
                            ]
                        }
                    ],
                    "active_jp": [
                        {
                            "spread": 0.3,
                            "condition_spread": "<=",
                            "sessions": [
                                "Tokyo"
                            ]
                        }
                    ]
                }
            ],

            "activities_connections":{
            "active_us_jp": {
                "active_status": [
                    "active_us",
                    "active_jp"
                ]
            }},
            "standby": {
                "deafultStatus": "true"
            },
            "paused_global": {
                "paused_days": [
                    "Sunday",
                    "Saturday"
                ]
            }
        }
    ],
    "marketdata_path": "./market_data_sample.json",
    "output_path": "./output.json"
}
```
- `marketdata_path.json` is the input market data file path.
- `output_path` is the output file path. In other words, you have to specify the output file path.
- `items` is the list of the activities that you want to implement. Inside `items` there are `activities` and `activities_connections`.

  - `activities` is the list of the activities that you want to implement (with single or multiple conditions). For example, `active_us` has two conditions:
    - `spread <= 0.2` and `session` is New York or London
    - `spread <= 0.1` and `session` is Sydney

  - `activities_connections` is the list of the activities that you want to combine with each other. For example, `active_us_jp` is the combination of `active_us` and `active_jp` (both `active_us` and `active_jp` can be specified in the `active_status`).

- `standby` is the default status (but if you want to change the default status you can add `defaultStatus` with a `true` value somewhere).

- `paused_global` is the status that should override all other statuses (for example, if it's weekend (Saturday and Sunday), the status should be `paused_global`).


### Example of the input file
```json 
[{
  "datetime": "2024-07-30T22:00:00Z",
  "spread": 0.22,
  "sessions": [
    "New York"
  ],
  "volume": 32687,
  "average_price": 21261.57,
  "price_change": 0.35
},
{
  "datetime": "2024-09-25T09:00:00Z",
  "spread": 0.15,
  "sessions": [
    "New York",
    "Sydney"
  ],
  "volume": 47020,
  "average_price": 995.42,
  "price_change": 0.54
},
{
  "datetime": "2024-09-25T09:00:00Z",
  "spread": 0.25,
  "sessions": [
    "New York",
    "Tokyo"
  ],
  "volume": 47020,
  "average_price": 995.42,
  "price_change": 0.54
}]
```
# Interview tasks

This is an example of the day-to-day tasks our team receives. The task is intentionally written in an informal manner to mimic how our clients might request assistance. The description may be missing some crucial details necessary for the task's proper execution. 
Candidates should analyze the task and obtain any missing information from the recruiter.

## 1. Configurable file processing
Use Node.js/TypeScript or PHP.

You have been employed as a developer for a company that creates its own proprietary trading software. Your task is to simulate the trading bot activity status based on market data.

Market data is provided in a file named `market_data.json` (this file can store a large amount of data, so please use streams). Your solution should process this data according to specific criteria and produce a new JSON file called `bot_status.json`.

Each object in the output should contain data from the input file along with the generated bot status. 
The use of Bash and CMD shells is prohibited; your solution should only be written in PHP or Node.js/TypeScript.

Below outlined current list of statuses and their triggers:
| bot status    | market data trigger                          |
|---------------|----------------------------------------------|
| active_us     | spread <= 0.2, session is New York or London |
| active_jp     | spread <= 0.3, session is Tokyo              |
| active_us_jp  | both active_us and active_jp                 |
| standby       | none of the other (default)                  |
| paused_global | it's weekend(Saturday Sunday)                |
| active_us     | spread <= 0.1 and session is Sydney          |


The analytics team predicts that constraints may change after the bot goes live. Your solution should allow for editing statuses and their triggers without the need to modify PHP/TypeScript files.

### Notes
- paused_global should override all other statuses


