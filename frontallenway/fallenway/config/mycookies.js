var MyCookies = function(){

	var cookies = {};
    var AdminAuthorization = "AdminAuthorization";
    var VisitorAuthorization = "VisitorAuthorization";

	this.getMyCookies = function(req){
		req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
			var parts = cookie.split('=');
		 	cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
 		});
		return cookies;
	}
    this.getAdminAuthorization = function(){
        return AdminAuthorization;
    }
    this.getVisitorAuthorization = function(){
        return VisitorAuthorization;
    }
}

module.exports = MyCookies;
