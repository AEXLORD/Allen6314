function deleteItem(itemId){
    $.post('/visitor/scrum/delete-item-by-id',{"itemId":itemId},function(data,status){
         if(status == "success"){
             window.location.href = "/visitor/scrum/index";
         } else {
            $("#itemMoveError").empty();
            $("#itemMoveError").append("后端错误，暂时无法删除！");
         }
     })
}

function showItemDetail(itemId,itemName,nowPosition){
    $("#itemDetail").empty();
    $("#itemDetail").append("<span style = \"font-weight:bold\">Item Name："+ itemName +"</span> &nbsp;&nbsp;&nbsp;&nbsp;");

    if(nowPosition == "ICE BOX"){
        displayRightMove(itemId,"IN PROGRESS");
    } else if(nowPosition == "IN PROGRESS"){
        displayLeftMove(itemId,"ICE BOX");
        displayRightMove(itemId,"TESTING");
    } else if(nowPosition == "TESTING"){
        displayLeftMove(itemId,"IN PROGRESS");
        displayRightMove(itemId,"COMPLETE");
    } else if(nowPosition == "COMPLETE"){
        displayLeftMove(itemId,"TESTING");
    }

    $("#itemDetail").append("<a href = \"javascript:void(0)\" onclick = \"deleteItem('"+itemId+"')\">删除</a>&nbsp;&nbsp;");
}

function displayLeftMove(itemId,leftPosition){
    $("#itemDetail").append("<a href = \"javascript:void(0)\" onclick = \"doSend('"+itemId+"','"+leftPosition+"')\">向左移动（"+ leftPosition +"）</a>&nbsp;&nbsp;");
}
function displayRightMove(itemId,rightPosition){
    $("#itemDetail").append("<a href = \"javascript:void(0)\" onclick = \"doSend('"+itemId+"','"+rightPosition+"')\">向右移动（"+ rightPosition +"）</a>&nbsp;&nbsp;");
}
function doSend(itemId,position){
     $.post('/visitor/scrum/update-item-type',{"itemId":itemId,"type":position},function(data,status){
         if(status == "success"){
             window.location.href = "/visitor/scrum/index";
         } else {
            $("#itemMoveError").empty();
            $("#itemMoveError").append("后端错误，暂时无法移动！");
         }
     })
}

function addItem(userid){
    var itemname = $("#item").val();
    var issueId = $("#issueid").val();
    if(itemname == null || itemname.trim() == '' || itemname.length > 20){
        $("#addIssueError").append("issue 不能为空 并且不能大于20个字符");
    } else {
        $.post('/visitor/scrum/add-item',{"name":itemname,"userid":userid,"issueId":issueId},function(data,status){
            if(status == "error"){
                $("#addItemError").append("后端出错，暂时无法添加");
            } else {
                window.location.href = "/visitor/scrum/index";
            }
        });
    }
}

