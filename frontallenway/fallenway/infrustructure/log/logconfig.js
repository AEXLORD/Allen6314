var winston = require('winston');

var logger = new winston.Logger({
    level: 'debug',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename:'allenway.log'})
    ]
});

var LogConfig = function(){
	this.getLogger = function(){
		return logger;
	}
}

module.exports = LogConfig;
