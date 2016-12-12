var ServerConstant = function(){

    //var BACKEND_URL_PREFIX = "http://fallenway-kong:8000";
    var BACKEND_URL_PREFIX = "http://localhost:8080";
    var NODE_PORT = 7000;

    var clientId = "whcid";
    var clientSecret = "whcsecret";
    var grantType = "password";

	this.getBackendUrlPrefix = function(){
		return BACKEND_URL_PREFIX;
	}
    this.getNodePort = function(){
        return NODE_PORT;
    }
    this.getClientId = function(){
        return clientId;
    }
    this.getClientSecret = function(){
        return clientSecret;
    }
    this.getGrantType = function(){
        return grantType;
    }
}

module.exports = ServerConstant;
