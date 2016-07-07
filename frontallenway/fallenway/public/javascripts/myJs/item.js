function deleteItem(itemId){
    $.post('/visitor/scrum/delete-item-by-id',{"itemId":itemId},function(data,status){
         if(status == "success"){
            $("#itemDetail").empty();
            var iden = "#" + itemId;
            $(iden).remove();
         } else {
            $("#itemMoveError").empty();
            $("#itemMoveError").append("后端错误，暂时无法删除！");
         }
     })
}

function showItemDetail(itemId,itemName,itemColor,nowPosition){
    $("#itemDetail").empty();
    $("#itemDetail").append("<span style = \"font-weight:bold\">Item Name："+ itemName +"</span> &nbsp;&nbsp;&nbsp;&nbsp;");

    if(nowPosition == "ICE BOX"){
        displayRightMove(itemId,itemName,itemColor,"IN PROGRESS");
    } else if(nowPosition == "IN PROGRESS"){
        displayLeftMove(itemId,itemName,itemColor,"ICE BOX");
        displayRightMove(itemId,itemName,itemColor,"TESTING");
    } else if(nowPosition == "TESTING"){
        displayLeftMove(itemId,itemName,itemColor,"IN PROGRESS");
        displayRightMove(itemId,itemName,itemColor,"COMPLETE");
    } else if(nowPosition == "COMPLETE"){
        displayLeftMove(itemId,itemName,itemColor,"TESTING");
    }

    $("#itemDetail").append("<a href = \"javascript:void(0)\" onclick = \"deleteItem('"+itemId+"')\">删除</a>&nbsp;&nbsp;");
}

function displayLeftMove(itemId,itemName,itemColor,leftPosition){
    $("#itemDetail").append(
        "<a href = \"javascript:void(0)\" onclick = \"doSend('"+itemId+"','"+itemName+"','"+itemColor+"','"+leftPosition+"')\">" +
            "向左移动（"+ leftPosition +"）</a>&nbsp;&nbsp;");
}
function displayRightMove(itemId,itemName,itemColor,rightPosition){
    $("#itemDetail").append(
            "<a href = \"javascript:void(0)\" onclick = \"doSend('"+itemId+"','"+itemName+"','"+itemColor+"','"+rightPosition+"')\">" +
            "向右移动（"+ rightPosition +"）</a>&nbsp;&nbsp;");
}
function doSend(itemId,itemName,itemColor,position){
     $.post('/visitor/scrum/update-item-type',{"itemId":itemId,"type":position},function(data,status){
         if(status == "success"){
            var iden = "#" + itemId;
            $(iden).remove();
            $("#itemDetail").empty();
            showItemDetail(itemId,itemName,itemColor,position);

            var newIden = transfer(position);
            $(newIden).append(
               "<div class = \"itemBoxStyle\" id = \""+itemId+"\" style = \"background-color:"+itemColor+"\">" +
                   "<a href = \"javascript:void(0)\"" +
                       "onclick = \"showItemDetail('"+itemId+"','"+itemName+"','"+itemColor+"','"+position+"')\">"+itemName+"</a>" +
               "</div>" +
               "&nbsp;"
            );
         } else {
            $("#itemMoveError").empty();
            $("#itemMoveError").append("后端错误，暂时无法移动！");
         }
     })
}

function transfer(position){
    if(position == "ICE BOX"){
        return "#icebox";
    } else if(position == "IN PROGRESS"){
        return "#inprogress";
    } else if (position == "TESTING"){
        return "#testing";
    } else if(position == "COMPLETE"){
        return "#complete";
    }
}

function addItem(userid){
    var itemname = $("#item").val();
    var issueId = $("#issueid").val();
        $("#addItemError").empty();

    if(issueId == null){
        $("#addItemError").append("请先添加 Issue");
    } else if(itemname == null || itemname.trim() == '' || itemname.length > 20){
        $("#addItemError").append("item 不能为空 并且不能大于20个字符");
    } else {
        $.post('/visitor/scrum/add-item',{"name":itemname,"userid":userid,"issueId":issueId},function(data,status){
            if(status == "error"){
                $("#addItemError").append("后端出错，暂时无法添加");
            } else {
                        var item = data.item;
                $("#icebox").append(
                    "<div class = \"itemBoxStyle\" id = \""+item.id+"\" style = \"background-color:"+item.color+"\">" +
                        "<a href = \"javascript:void(0)\" " +
                        "onclick = \"showItemDetail('" + item.id + "','"+ item.name +"','"+item.color+"','ICE BOX')\">"+item.name+"</a>" +
                    "</div>" +
                    "&nbsp;&nbsp;"
                );
            }
        });
    }
}

