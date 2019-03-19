"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const chart_router_1 = require("./routers/chart-router");
const dotendResult = dotenv.config({ path: '.env.dev' });
if (dotendResult.error) {
    console.log(dotendResult.error);
}
class App {
    constructor() {
        this.express = express();
        this.configureMiddleware();
        this.configureRoutes();
        this.configureSettings();
        this.configureErrorHandling();
    }
    configureMiddleware() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded());
    }
    configureRoutes() {
        this.express.use('/rest/chart', chart_router_1.ChartRouter.routes());
    }
    configureSettings() {
        this.express.set('port', 8080);
    }
    configureErrorHandling() {
        process.on('uncaughtException', (err) => {
            console.log(err);
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map