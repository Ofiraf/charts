"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chart_service_1 = require("../services/chart-service");
class ChartRouter {
    static routes() {
        const router = express_1.Router();
        router
            .post('/obChart/:symbol', (request, response, next) => {
            var orderBook = request.body;
            chart_service_1.ChartService.GenerateOBChart(request.params.symbol, orderBook)
                .then(res => {
                var data = res;
                response.send(data);
            });
        });
        router
            .post('/McapChart', (request, response, next) => {
            var orderBook = request.body;
            chart_service_1.ChartService.GenerateCapitalChart(orderBook)
                .then(res => {
                var data = res;
                response.send(data);
            });
        });
        router
            .post('/pieChart/:name', (request, response, next) => {
            var holdings = request.body;
            chart_service_1.ChartService.GeneratePieChartPost(request.params.name, holdings)
                .then(res => {
                var data = res;
                response.send(data);
            });
        });
        router
            .post('/pieChartAll/:name', (request, response, next) => {
            var holdings = request.body;
            chart_service_1.ChartService.GeneratePieChartStatusPost(request.params.name, holdings)
                .then(res => {
                var data = res;
                response.send(data);
            });
        });
        router
            .post('/statsChart/:name', (request, response, next) => {
            var holdings = request.body;
            chart_service_1.ChartService.GenerateStatusBarsChartPost(request.params.name, holdings)
                .then(res => {
                var data = res;
                response.send(data);
            });
        });
        router.post('/candleChart/:symbol/:time/:exchange', (request, response, next) => {
            var candels = request.body;
            chart_service_1.ChartService.GenerateCandleChartPost(request.params.symbol, request.params.time, candels, request.params.exchange)
                .then(res => {
                var data = res;
                response.send(data);
            });
        });
        return router;
    }
}
exports.ChartRouter = ChartRouter;
//# sourceMappingURL=chart-router.js.map