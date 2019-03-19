"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chart_service_1 = require("../services/chart-service");
class ExampleRouter {
    static routes() {
        const router = express_1.Router();
        /*    router
            .post('/:symbol', (request: Request, response: Response, next: NextFunction) => {
                var orderBook = request.body;
                ChartService.GenerateOBChart(request.params.symbol,orderBook)
                .then(res => {
                    var data = res as string;
                    var symbol =request.params.symbol;
                    data = data.replace(/^data:image\/png;base64,/, '');

                    fs.writeFile(path.resolve(__dirname, '../tmp/'+symbol+'.png'), data, 'base64', function(err) {
                    });


                var pathCHart=path.resolve(__dirname, '../tmp/'+symbol+'.png');

                    response.send(pathCHart);
                });
            });*/
        router
            .post('/pieChart/:name', (request, response, next) => {
            var holdings = request.body;
            chart_service_1.ChartService.GeneratePieChartPost(request.params.name, holdings)
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
exports.ExampleRouter = ExampleRouter;
//# sourceMappingURL=example-router.js.map