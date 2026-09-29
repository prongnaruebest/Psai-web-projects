import test from 'node:test';
import assert from 'node:assert/strict';
import {ingredients} from '../data/ingredients.js';
import {recipes,approvedAllergens} from '../data/recipes.js';
import {validateData} from '../js/validation.js';

test('database size and references are valid',()=>{
  assert.ok(ingredients.length>=70);
  assert.ok(recipes.length>=50);
  assert.deepEqual(validateData(ingredients,recipes,approvedAllergens),[]);
});
