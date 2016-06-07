package com.allenway.visitor.controller;

import com.allenway.utils.response.ReturnTemplate;
import com.allenway.utils.validparam.ValidUtils;
import com.allenway.visitor.entity.Message;
import com.allenway.visitor.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by wuhuachuan on 16/6/3.
 */

@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @RequestMapping(value = {"/message/save-message"},method = RequestMethod.POST)
    public Object saveMessage(String username,String content){
        if(validMessage(username,content)){
            int floor = messageService.getFloor();
            Message message = new Message.Builder()
                                    .userId(username)
                                    .content(content)
                                    .floor(floor)
                                    .build();
            messageService.save(message);

            return new ReturnTemplate();
        } else {
            throw new IllegalArgumentException("username or content is invalid!!");
        }
    }

    /**
     * 验证留言的合理性
     * 1. username 和 content 都不能为空.
     * 2. username 和 content 都不能大于 100 个字符
     * 3. 不能是带有 ' 或者 " 或者 < 的特殊字符.
     * @param username
     * @param content
     * @return
     */
    private boolean validMessage(String username, String content) {
        if(StringUtils.isEmpty(username) || StringUtils.isEmpty(content)){
            return false;
        } else if (username.length() > 100 || content.length() > 100) {
            return false;
        } else if( username.contains("<") || username.contains(">") || username.contains("'") || username.contains("\"")){
            return false;
        } else if( content.contains("<") || content.contains(">") || content.contains("'") || content.contains("\"")){
            return false;
        } else {
            return true;
        }
    }

    @RequestMapping(value = {"/message/find-messages-by-page","/auth/message/find-messages-by-page"}
            ,method = RequestMethod.GET)
    public Object findMessagesByPage(String page, String size) {

        if(ValidUtils.validPageAndSize(page,size)){
            ReturnTemplate returnTemplate = new ReturnTemplate();

            //计算总页数
            int totleSize = messageService.sumMessages();
            int totalPages = (int) Math.ceil((float)totleSize / Integer.parseInt(size));

            returnTemplate.addData("messages", messageService.findMessagesByPage(page,size));
            returnTemplate.addData("totalPage",totalPages);
            return returnTemplate;
        } else {
            throw new IllegalArgumentException("page or size isn't valid");
        }
    }

    @RequestMapping(value = {"/message/delete-message","/auth/message/delete-message"},method = RequestMethod.POST)
    public Object deleteMessage(@RequestParam("id") String id){
        if(ValidUtils.validIdParam(id)){
            messageService.deleteMessageById(id);
            return new ReturnTemplate();
        } else {
            throw new IllegalArgumentException("messageid isn't valid");
        }
    }
}
