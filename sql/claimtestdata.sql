-- INSERT INTO cycle_reward (cycle,addr,token,amount)values(1,'0xf7076D986996d0DBD97D6799C2Ec2adC2975CefB','0x71805940991e64222f75cc8a907353f2a60f892e',1000.0);
-- INSERT INTO cycle_reward (cycle,addr,token,amount)values(1,'0xf7076D986996d0DBD97D6799C2Ec2adC2975CefB','0x1df382c017c2aae21050d61a5ca8bc918772f419',2000.0);
-- INSERT INTO cycle_reward (cycle,addr,token,amount)values(1,'0xf7076D986996d0DBD97D6799C2Ec2adC2975CefB','0x4cf4d866dcc3a615d258d6a84254aca795020a2b',3000.0);
-- INSERT INTO cycle_reward (cycle,addr,token,amount)values(1,'0xf7076D986996d0DBD97D6799C2Ec2adC2975CefB','0x6c50d50fafb9b42471e1fcabe9bf485224c6a199',4000.0);

-- CREATE USER 'swapxminer'@'%' IDENTIFIED BY 'p@ssw0rd';
-- GRANT ALL PRIVILEGES ON *.* TO 'swapxminer'@'%' WITH GRANT OPTION;

-- INSERT INTO cycle_reward (cycle,addr,token,amount)values(1,'0xb0b0d02d246dadb22f40133c2fb0fcf738b3337c','0x017ae1ce9cb8e7ab8e120ba081cc4b060e7ade8f',1700000000000000000000);
-- delete from cycle_reward where  amount <5; 
-- update cycle_reward set cycle=2;-- where  amount <>000; 
-- select * from cycle_reward;
use eth_data_ropsten;
-- update  cycle_reward set amount = 16999999999999998300000 where cycle=1 and addr = '0x929378dbc9a1fdc0d05529e48097ff65c6902231' and token='0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5';
-- update  cycle_reward set amount = 3000000000000001700000 where cycle=1 and addr = '0xa4a4005a9497548427a141d53ad8869829fb9ec7' and token='0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5';

-- select * from cycle_reward where cycle=1  and addr='0x929378dbc9a1fdc0d05529e48097ff65c6902231' and token='0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5';
-- select * from cycle_reward where cycle=1 and addr='0x929378dbc9a1fdc0d05529e48097ff65c6902231' and token='0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5';
-- select * from cycle_reward where cycle=1 and addr='0x929378dbc9a1fdc0d05529e48097ff65c6902231' and token='0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5';

-- update cycle_reward set amount = amount-111000000000000000000 where  cycle=3 and  addr='0xa4a4005a9497548427a141d53ad8869829fb9ec7' and  token='0xe59eb769a705443936a043b07ec1892b448ca24d';
--  update cycle_reward set amount = amount-1000000000000000000 where cycle = 3 and addr='0xa4a4005a9497548427a141d53ad8869829fb9ec7' and  token='0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5';
-- SELECT sum(amount) FROM eth_data_ropsten.cycle_reward where addr='0x1084d79a66ef86bfc9c945d4a21159a024dee14e' and token='0xe59eb769a705443936a043b07ec1892b448ca24d';
-- update  cycle_reward set  amount=1000000000000000000 where cycle=3 and amount=20000000000000000000000 and token = '0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5' and addr = '0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568'
-- update  cycle_reward set  token = '0xe59eb769a705443936a043b07ec1892b448ca24d' where cycle=3 and amount=1000000000000000000 and token = '0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5' and addr != '0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568'
-- delete from cycle_reward where cycle=6;
-- INSERT INTO cycle_reward (cycle,addr,token,amount,type) select 6,lower(addr),token,amount,0 from cycle_reward where cycle=4;
-- update  cycle_reward set  flag = 1  where cycle=4 
-- select 6,tolower(addr),token,amount,0 from cycle_reward where cycle=4;
