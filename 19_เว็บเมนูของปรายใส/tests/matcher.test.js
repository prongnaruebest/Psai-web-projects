import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreRecipe,getRankedRecipes} from '../js/matcher.js';

const sample={id:'sample',minimumAgeMonths:12,mealTypes:['เช้า'],cookingTimeMinutes:10,texture:'ชิ้นนุ่ม',equipment:['หม้อ'],requiredIngredients:[{ingredientId:'rice'},{ingredientId:'egg'}],optionalIngredients:[{ingredientId:'carrot'}],allergens:['egg']};

test('complete required match ranks above partial match',()=>{
  const full=scoreRecipe(sample,['rice','egg'],['หม้อ']);
  const partial=scoreRecipe(sample,['rice'],['หม้อ']);
  assert.equal(full.missing.length,0);assert.ok(full.score>partial.score);
});
test('optional ingredient adds score',()=>assert.ok(scoreRecipe(sample,['rice','egg','carrot'],['หม้อ']).score>scoreRecipe(sample,['rice','egg'],['หม้อ']).score));
test('missing equipment applies penalty',()=>assert.ok(scoreRecipe(sample,['rice','egg'],['หม้อ']).score>scoreRecipe(sample,['rice','egg'],[]).score));
test('age and allergen exclusions work',()=>{
  const base={age:12,meal:'all',maxTime:999,texture:'all',sort:'match',selectedIngredients:['rice'],availableEquipment:['หม้อ'],excludedAllergens:[]};
  assert.equal(getRankedRecipes([sample],{...base,age:9}).length,0);
  assert.equal(getRankedRecipes([sample],{...base,excludedAllergens:['egg']}).length,0);
});
