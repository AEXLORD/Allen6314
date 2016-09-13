var ServerConstant = function(){

    //var BACKEND_URL_PREFIX = "http://fallenway-kong:8000";
    var BACKEND_URL_PREFIX = "http://localhost:8080";
    var NODE_PORT = 7000;

	this.getBackendUrlPrefix = function(){
		return BACKEND_URL_PREFIX;
	}
    this.getNodePort = function(){
        return NODE_PORT;
    }
}

module.exports = ServerConstant;
