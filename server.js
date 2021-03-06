/**
 * Create the data directory and work-order-mapping.json if it does not exist
 */
var logger = require("./common/logger.js");
var fs = require('fs');
if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
}
if (!fs.existsSync("data/work-order-mapping.json")) {
   fs.writeFileSync("data/work-order-mapping.json", '{"workOrderMapping":[{"userId":"M1032747","workOrderId":1,"createddate":"20170712150230"}]}', 'utf8');
}

/**
 * Set up npm modules
 */
var swaggerUi = require('swaggerize-ui');
var bodyParser = require("body-parser");
var morganLogger = require("morgan");
var express = require("express");

/**
 * Import Files
 */
var workOrderRoute = require("./app/work-order.route.js");
var swagger = require("./swagger/swagger.json");
var corsFilter = require("./common/cors.filter");
//var logger = require("./common/logger.js");

/**
 * Initialize the Express server and its router
 */
var app = express();
var router = express.Router();


/**
 * Initialize logging middleware
 */
app.use(morganLogger('dev'));
// Create the log directory if it does not exist
if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}

/**
 * Setting Limits
 */
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', "extended": false }));

/**
 * Cross-Origin Resource Sharing (CORS) to gives web servers cross-domain access controls, which enable secure cross-domain data transfers.
 */
corsFilter(router);

/**
 * Configure routes for the services
 */
app.use('/api/v1', router);
workOrderRoute.init(router);

/**
 * Endpoint to get Swagger API specification
 */
app.get('/swagger', function(req, res) {
	fs.readFile('./swagger/swagger.json', 'utf8', function(err, data){
		res.end(data);
	});
})

/**
 * Endpoint for Swagger UI
 */
app.use('/api/v1/user-workorders/docs', swaggerUi({
  docs: '/swagger'
}));

/**
 * Error handler if something breaks
 */
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke in the server!');
});

/**
 * This function starts the express server
 */
function start() {
  logger.info("Starting the server using startup function");
  var port = process.env.PORT || 9002;
  app.listen(port, '0.0.0.0', function() {
    logger.info("Listening on : ", port);
  });
  logger.info("Express server listening on port %d ", port);
}

/**
 * Calling the startup function to start the application
 */
start();
