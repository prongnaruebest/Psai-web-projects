export function scoreRecipe(recipe,selectedIngredients,availableEquipment){
  const selected=new Set(selectedIngredients);
  const equipment=new Set(availableEquipment);
  const required=recipe.requiredIngredients.map(item=>item.ingredientId);
  const optional=recipe.optionalIngredients.map(item=>item.ingredientId);
  const have=required.filter(id=>selected.has(id));
  const missing=required.filter(id=>!selected.has(id));
  const optionalHave=optional.filter(id=>selected.has(id));
  const equipmentMissing=recipe.equipment.filter(item=>!equipment.has(item));
  const availabilityScore=required.length?have.length/required.length:0;
  const optionalBonus=optional.length?optionalHave.length/optional.length:0;
  const missingPenalty=missing.length*0.08;
  const equipmentPenalty=equipmentMissing.length?0.15:0;
  const score=Math.max(0,Math.min(1,availabilityScore*0.85+optionalBonus*0.15-missingPenalty-equipmentPenalty));
  return {...recipe,have,missing,optionalHave,equipmentMissing,score:Math.round(score*100)};
}

export function getRankedRecipes(recipes,filters){
  const excluded=new Set(filters.excludedAllergens);
  const list=recipes
    .filter(recipe=>recipe.minimumAgeMonths<=filters.age)
    .filter(recipe=>filters.meal==='all'||recipe.mealTypes.includes(filters.meal))
    .filter(recipe=>recipe.cookingTimeMinutes<=filters.maxTime)
    .filter(recipe=>filters.texture==='all'||recipe.texture===filters.texture)
    .filter(recipe=>!recipe.allergens.some(item=>excluded.has(item)))
    .map(recipe=>scoreRecipe(recipe,filters.selectedIngredients,filters.availableEquipment))
    .filter(recipe=>filters.selectedIngredients.length===0||recipe.have.length>0);
  const sorters={
    match:(a,b)=>b.score-a.score||a.missing.length-b.missing.length||a.cookingTimeMinutes-b.cookingTimeMinutes,
    time:(a,b)=>a.cookingTimeMinutes-b.cookingTimeMinutes||b.score-a.score,
    missing:(a,b)=>a.missing.length-b.missing.length||b.score-a.score
  };
  return list.sort(sorters[filters.sort]||sorters.match);
}
