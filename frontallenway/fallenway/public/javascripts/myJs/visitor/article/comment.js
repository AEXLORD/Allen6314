function comment(){
    var articleId = $("#articleId").val();
    var username = $("#username").val();
    var password = $("#password").val();
    var content = $("#content").val();

    if(!validComment(username,password,content)){
        if(articleId == null){
            alert("发布评论失败：请刷新一下该页面");
            return ;
        }
        $("#commentWarn").empty();
        $("#commentWarn").append("<span style = \"color:red\">发表评论失败：非空 && （联系方式 <= 30字符） && （评论内容 <= 70字符） && （密码.length == 6）</span>");
        return;
    }

    sendCommentRequest(articleId,username,password,content);
}

function validComment(username,password,content){
    if( (username == null) || (username.trim() == "") || (username.length > 30)){
        return false;
    }
    if( (password == null) || (password.length != 6)){
        return false;
    }
    if( (content == null) || (content.trim() == "") || content.trim() > 70){
        return false;
    }
    return true;
}

function sendCommentRequest(articleId,username,password,content){
     $.ajax({
        type: 'POST',
        url: 'comment',
        data: {
             "articleId": articleId,
             "username": username,
             "password": password,
             "content": content
        },
        success: function(data){
            displayNewComment(username,content,data);
        },
        error: function(err){
            if(err.status == 1002){
                $("#commentWarn").empty();
                $("#commentWarn").append("<span style = \"color:red\">发表评论失败：非空 &&（联系方式 <= 30字符） && （评论内容 <= 70字符） && （密码.length == 6）</span>");
                return;
            }
            if(err.status == 2001){
                $("#commentWarn").empty();
                $("#commentWarn").append("<span style = \"color:red\">发表评论失败：该用户名的6位密码有误</span>");
                return;
            }
            $("#commentWarn").empty();
            $("#commentWarn").append("<span style = \"color:red\">后端服务报错，暂时无法发表评论</span>");
        }
    })
}

function displayNewComment(username,content,data){

    $("#username").val("");
    $("#password").val("");
    $("#content").val("");
    $("#commentWarn").empty();
    $("#commentWarn").append("<span style = \"color:blue\">发表评论成功</span>");

    $("#displayComment").append(
            "<div style = \"margin-top:15px;padding:10px;box-shadow: 1px 2px 2px 2px #DDDDDD\">" +
                "<span style = \"color:#259\">"+ username +" :</span><br/>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"+content+"</span>" +
                "<br/>" +
                "<div>" +
                    "<div style = \"float:left\">" +
                        "<span style = \"color:#999\">刚刚</span>" +
                    "</div>" +
                    "<div style = \"float:right\">" +
                        "<a href = \"javascript:void(0)\" onclick = \"reply('"+data.id+"','"+ username +"',this)\">回复</a>" +
                    "</div>" +
                    "<div style = \"clear:both\"></div>" +
                "</div>" +
            "</div>"
        );
}


