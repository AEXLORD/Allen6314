var redis = require('redis');

var host = "127.0.0.1";
var port = 6379;


var redisClient = redis.createClient(port,host);

var RedisConfig = function(){
	this.getRedisClient = function(){
		return redisClient;
	}
}

module.exports = RedisConfig;
