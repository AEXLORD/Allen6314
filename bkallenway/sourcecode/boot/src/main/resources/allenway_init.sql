#ADMIN用户
INSERT INTO tb_admin(id,is_delete,birthday,email,github,nick_name,password,qq,salt,username,wechat) VALUES ('aaac4e63-da8b-4def-a86c-6543d80a8a59','0','1992-07-12 00:00:00','wuhuachuan712@163.com','https://github.com/pzxwhc','Allenway','5219cca02974ed4915c79163e3d77421cc5dd4d1','748227431','a8a62d98-9432-4a03-b446-6c017d607aa1','admin','pw215712');

# 默认 module: learning,推荐,留言板,关于我
INSERT INTO tb_module(id,is_delete,name,weight,link) VALUES ('aaac4e63-1111-4def-a86c-6543d80a8a59','0',"Learning",4,"/visitor/learning/index");
INSERT INTO tb_module(id,is_delete,name,weight,link) VALUES ('7bb74c06-cd35-43eb-8086-c21fc119596f','0',"推荐",3,"/visitor/recommend");
INSERT INTO tb_module(id,is_delete,name,weight,link) VALUES ('d5ff88b6-c8a4-436c-81f8-561a9c35950e','0',"留言板",2,"/visitor/messageboard");
INSERT INTO tb_module(id,is_delete,name,weight,link) VALUES ('93f1452e-e235-4f47-9662-89b408fb5311','0',"关于我",1,"/visitor/aboutme");

