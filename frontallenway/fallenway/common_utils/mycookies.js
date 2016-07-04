var MyCookies = function(){

	var cookies = {};
    var AdminAuthorization = "AdminAuthorization";
    var VisitorAuthorization = "VisitorAuthorization";

    this.getAdminAuthorization = function(){
        return AdminAuthorization;
    }
    this.getVisitorAuthorization = function(){
        return VisitorAuthorization;
    }

    this.getVisitorAuthorizationCookie = function(req){
        var cookies = {};
        req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
             cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
         });
        return cookies[VisitorAuthorization];
    }
    this.getAdminAuthorizationCookie = function(req){
        var cookies = {};
        req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
             cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
         });
        return cookies[AdminAuthorization];
    }
}

module.exports = MyCookies;
