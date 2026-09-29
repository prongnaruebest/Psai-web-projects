export function validateData(ingredients,recipes,approvedAllergens){
  const errors=[];const ingredientIds=new Set();const recipeIds=new Set();
  ingredients.forEach(item=>{if(!item.id||ingredientIds.has(item.id))errors.push(`Ingredient ID invalid/duplicate: ${item.id}`);ingredientIds.add(item.id);});
  recipes.forEach(recipe=>{
    if(!recipe.id||recipeIds.has(recipe.id))errors.push(`Recipe ID invalid/duplicate: ${recipe.id}`);recipeIds.add(recipe.id);
    if(!Number.isInteger(recipe.cookingTimeMinutes)||recipe.cookingTimeMinutes<=0)errors.push(`${recipe.id}: invalid cooking time`);
    if(!Number.isInteger(recipe.minimumAgeMonths))errors.push(`${recipe.id}: missing minimum age`);
    if(!recipe.instructions?.length)errors.push(`${recipe.id}: empty instructions`);
    if(!recipe.requiredIngredients?.length)errors.push(`${recipe.id}: no required ingredients`);
    [...(recipe.requiredIngredients||[]),...(recipe.optionalIngredients||[])].forEach(item=>{if(!ingredientIds.has(item.ingredientId))errors.push(`${recipe.id}: unknown ingredient ${item.ingredientId}`);});
    recipe.allergens.forEach(item=>{if(!approvedAllergens.includes(item))errors.push(`${recipe.id}: unknown allergen ${item}`);});
  });
  return errors;
}
