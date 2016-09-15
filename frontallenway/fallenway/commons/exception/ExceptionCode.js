var ExceptionCode = function(){

    var PARAM_IS_INVALID = 1002; //非法参数

	this.getParamIsInvalid = function(){
		return PARAM_IS_INVALID;
	}
}

module.exports = ExceptionCode;
