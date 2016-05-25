package com.allenway.infrustructure.controller;

import com.allenway.utils.response.ReturnTemplate;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by wuhuachuan on 16/5/25.
 */

@Data
@Slf4j
@RestController
@RequestMapping(value = "/auth/test")
public class TestController {

    @RequestMapping(value = "",method = RequestMethod.GET)
    public Object findRecords(){
        return new ReturnTemplate();
    }
}
