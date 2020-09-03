生成的报告在 `reports` 文件夹中，每个周期以 `CR_周期号` 命名

每个文件以币种进行划分，文件名命名规则为：`周期_本期发行总量_Token地址.json`

每个文件中是本币种获得奖励的地址和具体金额





curl  -X POST --url  http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "disburse",
	"epoch": 3,
    "step":0
}'

curl  -X POST --url  http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "disburse",
	"epoch": 2,
    "step":1
}'


curl  -X POST --url http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "get_reward_list",
	"address": "0xb0b0d02d246dadb22f40133c2fb0fcf738b3337c"
}'

curl  -X POST --url http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "get_reward_list",
	"address": "0xf7076D986996d0DBD97D6799C2Ec2adC2975CefB"
}'


curl  -X POST --url  http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "claim_all_rewards",
	"address": "0xb0b0d02d246dadb22f40133c2fb0fcf738b3337c"
}'
