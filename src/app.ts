import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { ChartRouter } from './routers/chart-router';

const dotendResult = dotenv.config({path: '.env.dev'});
if (dotendResult.error) {
    console.log(dotendResult.error);
}

export class App {
    public express: express.Express;
    

    constructor() {
        this.express = express();
        this.configureMiddleware();
        this.configureRoutes();
        this.configureSettings();
        this.configureErrorHandling();
    }

    private configureMiddleware() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded());
    }

    private configureRoutes() {
        this.express.use('/rest/chart', ChartRouter.routes());
    }

    private configureSettings() {
        this.express.set('port', 8080);
    }

    private configureErrorHandling() {
        process.on('uncaughtException', (err) => {
            console.log(err);
        });
    }
}