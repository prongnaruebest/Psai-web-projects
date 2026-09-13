# -*- coding: utf-8 -*-
import json

with open('web_prompts_100.json', 'r', encoding='utf-8') as f:
    prompts = json.load(f)

# Metadata mapping by category for AI Money (11-20)
money_meta_map = {
    11: {"income": "10,000 - 50,000 บ./ด.", "timeframe": "24-48 ชม.", "difficulty": "Beginner", "tools": ["ChatGPT", "Canva", "Notion"]},
    12: {"income": "20,000 - 80,000 บ./ด.", "timeframe": "3-7 วัน", "difficulty": "Beginner", "tools": ["Claude", "ChatGPT"]},
    13: {"income": "15,000 - 100,000+ บ./ด.", "timeframe": "1-2 สัปดาห์", "difficulty": "Intermediate", "tools": ["CapCut", "ElevenLabs", "Midjourney"]},
    14: {"income": "10,000 - 150,000+ บ./ด.", "timeframe": "2-4 สัปดาห์", "difficulty": "Intermediate", "tools": ["SEO", "ChatGPT", "WordPress"]},
    15: {"income": "30,000 - 200,000+ บ./ด.", "timeframe": "1-2 สัปดาห์", "difficulty": "Intermediate", "tools": ["Shopify", "TikTok Shop", "Midjourney"]},
    16: {"income": "50,000 - 300,000+ บ./ด.", "timeframe": "2-3 สัปดาห์", "difficulty": "Advanced", "tools": ["Make.com", "n8n", "OpenAI API"]},
    17: {"income": "30,000 - 500,000+ บ./ด.", "timeframe": "2-4 สัปดาห์", "difficulty": "Advanced", "tools": ["Next.js", "Python", "Stripe"]},
    18: {"income": "50,000 - 300,000+ บ./ด.", "timeframe": "1-2 สัปดาห์", "difficulty": "Intermediate", "tools": ["Skool", "Zoom", "Claude"]},
    19: {"income": "30,000 - 150,000 บ./ดีล", "timeframe": "3-5 วัน", "difficulty": "Intermediate", "tools": ["Claude 3.5 Sonnet", "ChatGPT"]},
    20: {"income": "50,000 - 200,000+ บ./ด.", "timeframe": "1 สัปดาห์", "difficulty": "Advanced", "tools": ["DeepSeek", "Perplexity", "Excel"]}
}

# Metadata mapping by category for Web Dev (1-10)
web_meta_map = {
    1: {"level": "Senior Architect", "tech": "Architecture", "tools": ["System Design", "AWS", "Docker"]},
    2: {"level": "UI/UX Designer", "tech": "Design System", "tools": ["Figma", "Tailwind", "WCAG"]},
    3: {"level": "Frontend Dev", "tech": "React / Vue", "tools": ["React 19", "TypeScript", "Tailwind"]},
    4: {"level": "Backend Engineer", "tech": "Node / Python", "tools": ["Express", "FastAPI", "JWT"]},
    5: {"level": "Database Admin", "tech": "PostgreSQL / SQL", "tools": ["PostgreSQL", "Prisma", "Redis"]},
    6: {"level": "Security Auditor", "tech": "OWASP / DevSecOps", "tools": ["OWASP", "CSP", "TOTP 2FA"]},
    7: {"level": "QA Engineer", "tech": "Testing Automation", "tools": ["Playwright", "Vitest", "k6"]},
    8: {"level": "Performance Lead", "tech": "Web Vitals / SEO", "tools": ["LCP/INP", "SSR/SSG", "JSON-LD"]},
    9: {"level": "DevOps Engineer", "tech": "Cloud / CI/CD", "tools": ["Docker", "GitHub Actions", "Nginx"]},
    10: {"level": "CRO Specialist", "tech": "Conversion & Analytics", "tools": ["GA4", "A/B Testing", "CRO"]}
}

for p in prompts:
    cid = p.get('categoryId', 1)
    mode = p.get('mode', 'web')
    
    if mode == 'money':
        meta = money_meta_map.get(cid, {"income": "10,000+ บ./ด.", "timeframe": "1 สัปดาห์", "difficulty": "Beginner", "tools": ["AI"]})
        p['income'] = meta['income']
        p['timeframe'] = meta['timeframe']
        p['difficulty'] = meta['difficulty']
        p['tools'] = meta['tools']
    else:
        meta = web_meta_map.get(cid, {"level": "Full-Stack Engineer", "tech": "Web", "tools": ["TypeScript"]})
        p['level'] = meta['level']
        p['tech'] = meta['tech']
        p['tools'] = meta['tools']

with open('web_prompts_100.json', 'w', encoding='utf-8') as f:
    json.dump(prompts, f, ensure_ascii=False, indent=2)

print(f"Enriched {len(prompts)} prompts with business & technical metadata successfully!")
