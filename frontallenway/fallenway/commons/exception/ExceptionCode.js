var ExceptionCode = function(){

    var USERNAME_PASSWORD_WRONG = 2002; // 用户帐号密码错误
    var USER_HAS_LOGOUT = 2004; // 用户已经登出
    var PARAM_IS_INVALID = 3001; //非法参数

	this.getUserHasLogout = function(){
		return USER_HAS_LOGOUT;
	}
	this.getParamIsInvalid = function(){
		return PARAM_IS_INVALID;
	}
	this.getUserNamePWORD_WRONG = function(){
		return USERNAME_PASSWORD_WRONG;
	}
}

module.exports = ExceptionCode;
