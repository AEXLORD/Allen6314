var ExceptionCode = function(){

    var USER_HAS_LOGOUT = 2004;
    var PARAM_IS_INVALID = 3001;

	this.getUSER_HAS_LOGOUT_Code = function(){
		return USER_HAS_LOGOUT;
	}
	this.getPARAM_IS_INVALID_Code = function(){
		return PARAM_IS_INVALID;
	}
}

module.exports = ExceptionCode;
