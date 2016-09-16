function reply(messageId,username,element){
    $("#replyMessage").remove();
     $(element).parent().parent().parent().append(
        "<div id = \"replyMessage\" style = \"margin-top:30px;\">" +
            "<h5>发表回复</h5>" +
            "<div style = \"width:24%;display:inline-block;float:left\">" +
                "<input type = \"text\" id = \"usernameReply\" class = \"messageInputStyle\" placeholder = \"您的联系方式（邮箱）\">" +
            "</div>" +
            "<div style = \"width:1%;display:inline-block;float:left\">:</div>" +
            "<div style = \"width:26%;display:inline-block\">" +
                "<input type = \"password\" id = \"passwordReply\" class = \"messageInputStyle\" placeholder = \"6位密文\">" +
            "</div>" +
            "<div style = \"clear:both\"></div>" +
            "<div style = \"width:90%;display:inline-block;float:left\">" +
                "<input type = \"text\" id = \"contentReply\" class = \"messageInputStyle\" placeholder = \"回复内容\">" +
            "</div>" +
            "<div style = \"width:4%;display:inline-block;float:right;margin-top:5px\">" +
                "<a href = \"javascript:void(0)\" onclick = \"doReply('"+messageId+"','"+username+"')\">发表</a>" +
            "</div>" +
            "<div style = \"clear:both\"></div>" +
            "<div id = \"messageWarnReply\"></div>" +
        "</div>"
        );
}

function doReply(messageId,replyTo){
     var username = $("#usernameReply").val();
     var password = $("#passwordReply").val();
     var content = $("#contentReply").val();

     if(!validReplyMessage(username,password,content)){
        if(messageId == null || messageId.length == 0 ||
           replyTo == null || replyTo.length == 0){

            alert("发布回复失败：请刷新一下该页面");
            return ;
        }
        $("#messageWarnReply").empty();
        $("#messageWarnReply").append("<span style = \"color:red\">发布回复留言失败：非空 && （联系方式 <= 30字符） && （评论内容 <= 70字符） && （密码.length == 6）</span>");
        return;
     }

     sendReplyMessageRequest(messageId,username,password,content,replyTo);
}

function validReplyMessage(username,password,content){
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

function sendReplyMessageRequest(sourceMessageId,username,password,content,replyTo){
     $.ajax({
        type: 'POST',
        url: '/visitor/message/messageReply',
        data: {
             "sourceMessageId":sourceMessageId,
             "username": username,
             "password": password,
             "content": content,
             "replyTo": replyTo
        },
        success: function(data){
            displayNewReplyMessage(username,content,replyTo,data);
        },
        error: function(err){
            if(err.status == 1002){
                $("#messageWarnReply").empty();
                $("#messageWarnReply").append("<span style = \"color:red\">发表留言失败：非空 &&（联系方式 <= 30字符） && （评论内容 <= 70字符） && （密码.length == 6）</span>");
                return;
            }
            if(err.status == 2001){
                $("#messageWarnReply").empty();
                $("#messageWarnReply").append("<span style = \"color:red\">发表留言失败：该用户名的6位密码有误</span>");
                return;
            }
            $("#messageWarnReply").empty();
            $("#messageWarnReply").append("<span style = \"color:red\">后端服务报错，暂时无法发表评论</span>");
        }
    })
}

function displayNewReplyMessage(username,content,replyTo,data){

    $("#usernameReply").val("");
    $("#passwordReply").val("");
    $("#contentReply").val("");
    $("#messageWarnReply").empty();
    $("#messageWarnReply").append("<span style = \"color:blue\">发表回复留言成功</span>");

    $("#displayMessage").append(
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

