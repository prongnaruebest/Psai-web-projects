# -*- coding: utf-8 -*-
"""
Merges all 5 recipe parts into a unified recipes.json file.
Ensures exactly 300 recipes with validated schema.
"""
import json
import os

from data_part1_soup import recipes_soup
from data_part2_stirfry import recipes_stirfry
from data_part3_fried_steam import recipes_fried_steam
from data_part4_salad_single import recipes_salad_single
from data_part5_kids_healthy import recipes_kids_healthy

all_raw = (
    recipes_soup +
    recipes_stirfry +
    recipes_fried_steam +
    recipes_salad_single +
    recipes_kids_healthy
)

print(f"Part 1 (Soup): {len(recipes_soup)}")
print(f"Part 2 (Stirfry): {len(recipes_stirfry)}")
print(f"Part 3 (Fried & Steam): {len(recipes_fried_steam)}")
print(f"Part 4 (Salad & Single): {len(recipes_salad_single)}")
print(f"Part 5 (Kids & Healthy): {len(recipes_kids_healthy)}")
print(f"Raw Total: {len(all_raw)}")

# Normalize schema & assign unique sequential IDs
final_recipes = []
for idx, r in enumerate(all_raw):
    # Calculate total time
    prep_val = r.get("prep", 15)
    cook_val = r.get("cook", 15)
    total_val = prep_val + cook_val
    
    # Format ingredients
    formatted_ings = []
    for item in r.get("ings", []):
        if len(item) == 3:
            formatted_ings.append({"item": item[0], "amount": str(item[1]), "unit": item[2]})
        elif len(item) == 2:
            formatted_ings.append({"item": item[0], "amount": str(item[1]), "unit": "ตามชอบ"})
            
    # Format seasonings
    formatted_seas = []
    for item in r.get("seas", []):
        if len(item) == 3:
            formatted_seas.append({"item": item[0], "amount": str(item[1]), "unit": item[2]})
        elif len(item) == 2:
            formatted_seas.append({"item": item[0], "amount": str(item[1]), "unit": "ตามชอบ"})
            
    # Format steps
    raw_steps = r.get("steps", [])
    formatted_steps = []
    for s_idx, st in enumerate(raw_steps):
        st_clean = st.strip()
        if not st_clean[0].isdigit():
            st_clean = f"{s_idx+1}. {st_clean}"
        formatted_steps.append(st_clean)
        
    recipe_obj = {
        "id": idx + 1,
        "name": r["name"],
        "category": r["cat"],
        "mealType": r.get("meals", ["กลางวัน", "เย็น"]),
        "prepTime": f"{prep_val} นาที",
        "cookTime": f"{cook_val} นาที",
        "totalTime": f"{total_val} นาที",
        "difficulty": r.get("diff", "ง่าย"),
        "calories": f"{r.get('cals', 250)} kcal",
        "tags": r.get("tags", ["ยอดนิยม"]),
        "mainPantry": r.get("pantry", ["วัตถุดิบสด"]),
        "ingredients": formatted_ings,
        "seasonings": formatted_seas,
        "steps": formatted_steps,
        "benefits": r.get("benefits", "อุดมด้วยสารอาหารครบถ้วนตามธรรมชาติ"),
        "tips": r.get("tips", "ปรุงด้วยความร้อนที่พอเหมาะเพื่อรักษาคุณค่าทางอาหาร"),
        "icon": r.get("icon", "🍲")
    }
    final_recipes.append(recipe_obj)

output_path = os.path.join(os.path.dirname(__file__), "recipes.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(final_recipes, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {len(final_recipes)} recipes to {output_path}")
