function addIssue(userid){
    $("#addIssueError").empty();
    var issue = $("#issue").val();
    var color = $("#color").val();

    if(issue == null || issue.trim() == '' || issue.length > 20){
        $("#addIssueError").append("issue 不能为空 并且不能大于20个字符");
    } else {
        $.post('/visitor/scrum/add-issue',{"issue":issue,"userid":userid,"color":color},function(data,status){
            if(status == "error"){
                $("#addIssueError").append("后端出错，暂时无法添加");
            } else {
                var issue = data.issue;
                $("#issueid").append("<option class = \""+issue.id+"\" value = \""+issue.id+"\">"+issue.name+"</option>");
                $("#issueShow").append(
                    "<div class = \""+issue.id+"\" style = \"min-height:45px;min-width:120px;border:solid 1px #ddd;padding:5px;display:inline-block\">" +
                        "<div id = \"issue1\" style = \"display\">" +
                            "<a href = \"javascript:void(0)\" " +
                                "onclick = \"showIssueDetail('"+issue.id+"','"+issue.name+"','"+issue.color+"')\">" +
                                issue.name +
                            "</a>" +
                        "</div>" +
                        "<div class= \"text-right\" style = \"width:100%\">" +
                            "<div style = \"height:12px;width:40px;background-color:"+issue.color+";display:inline-block\">" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                    "&nbsp;&nbsp;"
                );
            }
        });
    }
}

function deleteIssue(issueId){
    $.post('/visitor/scrum/delete-issue-by-id',{"issueId":issueId},function(data,status){
        $("#issueDetailError").empty();
        if(status == "error"){
            $("#itemMoveError").append("后端错误，暂时无法删除！");
        } else {
            if(data.error == null){
                $("#issueDetail").empty();
                var iden = "." + issueId;
                $(iden).remove();
            } else {
                $("#issueDetailError").append(data.error);
            }
        }
    })
}

function showIssueDetail(issueId,issueName,issueColor){
    $("#issueDetail").empty();
    $("#issueDetail").append("<span style = \"font-weight:bold\">Issue Name："+ issueName +"</span> &nbsp;&nbsp;&nbsp;&nbsp;");
    $("#issueDetail").append("<a href = \"javascript:void(0)\" onclick = \"deleteIssue('"+issueId+"')\">删除</a>&nbsp;&nbsp;");
}


