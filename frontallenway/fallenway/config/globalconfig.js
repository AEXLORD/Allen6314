var Config = function(){

    //var backendUrlPrefix = "http://localhost:8080/";
    var nodePort = 7000;
    var articleListPageSize = 10;
    var messageListPageSize = 4;
    var backendUrlPrefix = "http://fallenway-kong:8000/";

	this.getBackendUrlPrefix = function(){
		return backendUrlPrefix;
	}
    this.getArticleListPageSize = function(){
        return articleListPageSize;
    }
    this.getMessageListPageSize = function(){
        return messageListPageSize;
    }
    this.getNodePort = function(){
        return nodePort;
    }
}

module.exports = Config;
