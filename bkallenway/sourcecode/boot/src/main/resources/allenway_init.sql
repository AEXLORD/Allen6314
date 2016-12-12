#ADMIN用户
INSERT INTO tb_admin(id,is_delete,password,salt,username) VALUES ('aaac4e63-da8b-4def-a86c-6543d80a8a59',false,'5219cca02974ed4915c79163e3d77421cc5dd4d1','a8a62d98-9432-4a03-b446-6c017d607aa1','admin');

# 初始化模块
INSERT INTO tb_module(id,is_delete,name) VALUES ('d5ff88b6-c8a4-436c-81f8-561a9c35950e',false,"read");
INSERT INTO tb_module(id,is_delete,name) VALUES ('93f1452e-e235-4f47-9662-89b408fb5311',false,"about me");
INSERT INTO tb_module(id,is_delete,name) VALUES ('93f1452e-e235-4f47-9662-89b408fb5312',false,"work");
INSERT INTO tb_module(id,is_delete,name) VALUES ('93f1452e-e235-4f47-9662-89b408fb5313',false,"learn");

# oauth
INSERT INTO `oauth_client_details` VALUES ('whcid','','whcsecret','whcallenway','password','http://localhost:8080/redirect','',90000,NULL,'{}','admin');
