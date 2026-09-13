import json

with open('web_prompts_100.json', 'r', encoding='utf-8') as f:
    web_prompts = json.load(f)

for p in web_prompts:
    p['mode'] = 'web'

with open('ai_money_prompts_100.json', 'r', encoding='utf-8') as f:
    money_prompts = json.load(f)

for p in money_prompts:
    p['mode'] = 'money'

all_prompts = web_prompts + money_prompts
print(f"Total merged prompts: {len(all_prompts)} (Web: {len(web_prompts)}, Money: {len(money_prompts)})")

with open('web_prompts_100.json', 'w', encoding='utf-8') as f:
    json.dump(all_prompts, f, ensure_ascii=False, indent=2)

print("Saved combined 200 prompts to web_prompts_100.json")
