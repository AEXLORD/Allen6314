var ExceptionCode = function(){
    var userHasLogoutCode = 2004;
	this.getUserHasLogoutCode = function(){
		return userHasLogoutCode;
	}
}

module.exports = ExceptionCode;
