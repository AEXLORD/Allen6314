function reply(commentId,username,element){
    $("#replyComment").remove();
     $(element).parent().parent().parent().append(
        "<div id = \"replyComment\" style = \"margin-top:30px;\">" +
            "<h5>发表回复</h5>" +
            "<div style = \"width:24%;display:inline-block;float:left\">" +
                "<input type = \"text\" id = \"usernameReply\" class = \"commentInputStyle\" placeholder = \"您的联系方式（邮箱）\">" +
            "</div>" +
            "<div style = \"width:1%;display:inline-block;float:left\">:</div>" +
            "<div style = \"width:26%;display:inline-block\">" +
                "<input type = \"password\" id = \"passwordReply\" class = \"commentInputStyle\" placeholder = \"6位密文（您的专属回复帐号）\">" +
            "</div>" +
            "<div style = \"clear:both\"></div>" +
            "<div style = \"width:90%;display:inline-block;float:left\">" +
                "<input type = \"text\" id = \"contentReply\" class = \"commentInputStyle\" placeholder = \"回复内容\">" +
            "</div>" +
            "<div style = \"width:4%;display:inline-block;float:right;margin-top:5px\">" +
                "<a href = \"javascript:void(0)\" onclick = \"doReply('"+commentId+"','"+username+"')\">发表</a>" +
            "</div>" +
            "<div style = \"clear:both\"></div>" +
            "<div id = \"commentWarnReply\"></div>" +
        "</div>"
        );
}

function doReply(commentId,replyTo){
     var articleId = $("#articleId").val();
     var username = $("#usernameReply").val();
     var password = $("#passwordReply").val();
     var content = $("#contentReply").val();

     if(!validReplyComment(username,password,content)){
        if(commentId == null || commentId.length == 0 ||
           articleId == null || articleId.length == 0 ||
           replyTo == null || replyTo.length == 0){

            alert("发布评论失败：请刷新一下该页面");
            return ;
        }
        $("#commentWarnReply").empty();
        $("#commentWarnReply").append("<span style = \"color:red\">发布回复评论失败：非空 && （联系方式 <= 30字符） && （评论内容 <= 70字符） && （密码.length == 6）</span>");
        return;
     }

     sendReplyCommentRequest(commentId,articleId,username,password,content,replyTo);
}

function validReplyComment(username,password,content){
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

function sendReplyCommentRequest(sourceCommentId,articleId,username,password,content,replyTo){
     $.ajax({
        type: 'POST',
        url: 'commentReply',
        data: {
             "sourceCommentId":sourceCommentId,
             "articleId": articleId,
             "username": username,
             "password": password,
             "content": content,
             "replyTo": replyTo
        },
        success: function(data){
            displayNewReplyComment(username,content,replyTo,data);
        },
        error: function(err){
            if(err.status == 1002){
                $("#commentWarnReply").empty();
                $("#commentWarnReply").append("<span style = \"color:red\">发表评论失败：非空 &&（联系方式 <= 30字符） && （评论内容 <= 70字符） && （密码.length == 6）</span>");
                return;
            }
            if(err.status == 2001){
                $("#commentWarnReply").empty();
                $("#commentWarnReply").append("<span style = \"color:red\">发表评论失败：该用户名的6位密码有误</span>");
                return;
            }
            $("#commentWarnReply").empty();
            $("#commentWarnReply").append("<span style = \"color:red\">后端服务报错，暂时无法发表评论</span>");
        }
    })
}

function displayNewReplyComment(username,content,replyTo,data){

    $("#usernameReply").val("");
    $("#passwordReply").val("");
    $("#contentReply").val("");
    $("#commentWarnReply").empty();
    $("#commentWarnReply").append("<span style = \"color:blue\">发表回复评论成功</span>");

    $("#displayComment").append(
            "<div style = \"margin-top:15px;padding:10px;box-shadow: 1px 2px 2px 2px #DDDDDD\">" +
                "<span style = \"color:#259\">"+username+"&nbsp;&nbsp;</span>" +
                "<span style = \"color:#999\">回复&nbsp;&nbsp;</span>" +
                "<span style = \"color:#259\">"+replyTo+" :</span>" +
                "<br/>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"+content+"</span>" +
                "<br/>" +
                "<div>" +
                    "<div style = \"float:left\">" +
                        "<span style = \"color:#999\">刚刚</span>" +
                    "</div>" +
                    "<div style = \"float:right\">" +
                        "<a href = \"javascript:void(0)\" onclick = \"reply('"+data.id+"','"+username+"',this)\">回复</a> &nbsp;&nbsp;" +
                        "<a data-toggle=\"modal\" data-target=\"#myModal\" onclick = \"showConversation('"+username+"','"+replyTo+"')\">查看对话</a>" +
                    "</div>" +
                    "<div style = \"clear:both\"></div>" +
                "</div>" +
            "</div>"
        );
}

