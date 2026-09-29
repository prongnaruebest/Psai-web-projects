import {ingredients,INGREDIENT_CATEGORIES,ingredientMap} from '../data/ingredients.js';
import {recipes,approvedAllergens,allergenLabels,equipmentLabels} from '../data/recipes.js';
import {getRankedRecipes} from './matcher.js';
import {loadState,saveState,clearState,defaultState} from './storage.js';
import {validateData} from './validation.js';

const $=selector=>document.querySelector(selector);let state=loadState();let activeCategory='ทั้งหมด';let showingFavorites=false;
const dataErrors=validateData(ingredients,recipes,approvedAllergens);if(dataErrors.length)console.error('Data validation errors',dataErrors);

function persist(){saveState(state);updateCounts();}
function filters(){return {age:+$('#age').value,meal:$('#meal').value,maxTime:+$('#maxTime').value,texture:$('#texture').value,sort:$('#sort').value,selectedIngredients:state.selectedIngredients,excludedAllergens:state.excludedAllergens,availableEquipment:state.availableEquipment};}
function ingredientName(id){return ingredientMap.get(id)?.nameTh||id;}
function recipeById(id){return recipes.find(item=>item.id===id);}

function renderTabs(){
  $('#tabs').innerHTML=INGREDIENT_CATEGORIES.map(category=>`<button class="tab ${category===activeCategory?'active':''}" type="button" data-category="${category}" role="tab" aria-selected="${category===activeCategory}">${category}</button>`).join('');
  $('#tabs').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.category;renderTabs();renderIngredients();}));
}
function renderIngredients(){
  const query=$('#search').value.trim().toLowerCase();
  const list=ingredients.filter(item=>item.enabled&&(activeCategory==='ทั้งหมด'||item.category===activeCategory)).filter(item=>[item.nameTh,item.nameEn,...item.aliases].some(text=>text.toLowerCase().includes(query)));
  $('#ingredients').innerHTML=list.length?list.map(item=>`<button class="ingredient ${state.selectedIngredients.includes(item.id)?'selected':''}" type="button" data-id="${item.id}" aria-pressed="${state.selectedIngredients.includes(item.id)}">${item.nameTh}</button>`).join(''):'<p>ไม่พบวัตถุดิบ</p>';
  $('#ingredients').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>toggleIngredient(button.dataset.id)));
}
function toggleIngredient(id){state.selectedIngredients=state.selectedIngredients.includes(id)?state.selectedIngredients.filter(item=>item!==id):[...state.selectedIngredients,id];persist();renderIngredients();renderRecipes();}

function renderFilterOptions(){
  $('#allergenFilters').innerHTML=approvedAllergens.map(id=>`<label class="check"><input type="checkbox" value="${id}" ${state.excludedAllergens.includes(id)?'checked':''}>${allergenLabels[id]}</label>`).join('');
  $('#equipmentFilters').innerHTML=Object.keys(equipmentLabels).map(id=>`<label class="check"><input type="checkbox" value="${id}" ${state.availableEquipment.includes(id)?'checked':''}>${equipmentLabels[id]}</label>`).join('');
  $('#allergenFilters').addEventListener('change',event=>{state.excludedAllergens=checkboxValues('#allergenFilters');persist();renderRecipes();});
  $('#equipmentFilters').addEventListener('change',event=>{state.availableEquipment=checkboxValues('#equipmentFilters');persist();renderRecipes();});
}
function checkboxValues(selector){return [...document.querySelectorAll(`${selector} input:checked`)].map(item=>item.value);}

function badge(recipe){if(recipe.missing.length===0&&recipe.equipmentMissing.length===0)return 'ทำได้ทันที';if(recipe.cookingTimeMinutes<=15)return 'ทำได้ใน 15 นาที';if(recipe.missing.length===1)return 'ขาด 1 อย่าง';return `ตรง ${recipe.score}%`;}
function renderRecipes(){
  let list=getRankedRecipes(recipes,filters());if(showingFavorites)list=list.filter(item=>state.favorites.includes(item.id));
  $('#summary').textContent=showingFavorites?`เมนูโปรด ${list.length} เมนู`:state.selectedIngredients.length?`พบ ${list.length} เมนู จากวัตถุดิบ ${state.selectedIngredients.length} รายการ`:`พบ ${list.length} เมนูตามตัวกรอง`;
  $('#cards').innerHTML=list.length?list.map(recipe=>`<article class="card"><div class="card-top"><span class="badge">${badge(recipe)}</span><button class="favorite ${state.favorites.includes(recipe.id)?'active':''}" type="button" data-favorite="${recipe.id}" aria-label="${state.favorites.includes(recipe.id)?'นำออกจาก':'เพิ่มใน'}เมนูโปรด">★</button></div><h3>${recipe.nameTh}</h3><div class="meta"><span>${recipe.cookingTimeMinutes} นาที</span><span>${recipe.minimumAgeMonths}+ เดือน</span><span>${recipe.texture}</span></div><div class="progress" aria-label="คะแนนความตรง ${recipe.score} เปอร์เซ็นต์"><span style="width:${recipe.score}%"></span></div><p class="missing">${recipe.missing.length?`<strong>ยังขาด:</strong> ${recipe.missing.map(ingredientName).join(', ')}`:'มีวัตถุดิบหลักครบแล้ว'}${recipe.equipmentMissing.length?`<br><strong>อุปกรณ์:</strong> ${recipe.equipmentMissing.join(', ')}`:''}</p><div class="card-actions"><button class="detail-button" type="button" data-recipe="${recipe.id}">ดูวิธีทำ →</button>${recipe.missing.length?`<button class="add-list" type="button" data-shopping="${recipe.id}">เพิ่มของที่ขาด</button>`:''}</div></article>`).join(''):`<div class="empty"><h3>ยังไม่พบเมนูที่ตรง</h3><p>ลองเลือกวัตถุดิบเพิ่ม หรือลดตัวกรองบางรายการ</p></div>`;
  document.querySelectorAll('[data-favorite]').forEach(button=>button.addEventListener('click',()=>toggleFavorite(button.dataset.favorite)));
  document.querySelectorAll('[data-recipe]').forEach(button=>button.addEventListener('click',()=>openRecipe(button.dataset.recipe)));
  document.querySelectorAll('[data-shopping]').forEach(button=>button.addEventListener('click',()=>addMissing(button.dataset.shopping)));
}
function toggleFavorite(id){state.favorites=state.favorites.includes(id)?state.favorites.filter(item=>item!==id):[...state.favorites,id];persist();renderRecipes();}
function addMissing(id){const scored=getRankedRecipes([recipeById(id)],filters())[0];if(!scored)return;state.shopping=[...new Set([...state.shopping,...scored.missing])];persist();buttonFeedback(`[data-shopping="${id}"]`,'เพิ่มแล้ว');}
function buttonFeedback(selector,text){const button=$(selector);if(!button)return;const before=button.textContent;button.textContent=text;setTimeout(()=>button.textContent=before,1000);}

function openRecipe(id){
  const recipe=recipeById(id);if(!recipe)return;state.recent=[id,...state.recent.filter(item=>item!==id)].slice(0,6);persist();renderRecent();
  const missing=recipe.requiredIngredients.filter(item=>!state.selectedIngredients.includes(item.ingredientId));
  $('#recipeContent').innerHTML=`<div class="dialog-body"><div class="dialog-head"><div><span class="badge">สูตรสำหรับเด็ก</span><h2>${recipe.nameTh}</h2></div><button class="close" type="button" aria-label="ปิด">×</button></div><p>${recipe.description}</p><div class="facts"><span class="pill">${recipe.cookingTimeMinutes} นาที</span><span class="pill">${recipe.minimumAgeMonths}+ เดือน</span><span class="pill">${recipe.texture}</span><span class="pill">${recipe.difficulty}</span></div><h3>วัตถุดิบ 1 ที่</h3><ul>${recipe.requiredIngredients.map(item=>`<li>${ingredientName(item.ingredientId)} ${item.quantity} ${item.unit}${item.preparation?` — ${item.preparation}`:''}${state.selectedIngredients.includes(item.ingredientId)?' — มีแล้ว':''}</li>`).join('')}</ul><h3>วิธีทำ</h3><ol>${recipe.instructions.map(step=>`<li>${step}</li>`).join('')}</ol>${recipe.allergens.length?`<div class="notice"><strong>สารก่อภูมิแพ้:</strong> ${recipe.allergens.map(item=>allergenLabels[item]).join(', ')}</div>`:''}${recipe.safetyWarnings.length?`<div class="notice"><strong>ความปลอดภัย:</strong><ul>${recipe.safetyWarnings.map(item=>`<li>${item}</li>`).join('')}</ul></div>`:''}${missing.length?`<div class="notice"><strong>ของที่ยังขาด:</strong> ${missing.map(item=>ingredientName(item.ingredientId)).join(', ')}</div>`:''}<h3>การเก็บรักษา</h3><p>แช่เย็นไม่เกิน ${recipe.storage.refrigeratorHours} ชั่วโมง หรือแช่แข็งไม่เกิน ${recipe.storage.freezerDays} วัน ${recipe.storage.reheatingInstructions}</p><div class="dialog-actions"><button class="secondary" id="addDialogList" type="button">เพิ่มของที่ขาด</button><button class="primary" id="cookedButton" type="button">ทำเมนูนี้แล้ว</button></div></div>`;
  $('#recipeDialog').showModal();$('#recipeContent .close').onclick=()=>$('#recipeDialog').close();$('#addDialogList').onclick=()=>{state.shopping=[...new Set([...state.shopping,...missing.map(item=>item.ingredientId)])];persist();$('#addDialogList').textContent='เพิ่มแล้ว';};$('#cookedButton').onclick=()=>{state.cooked=[{id,date:new Date().toISOString()},...state.cooked].slice(0,30);persist();$('#cookedButton').textContent='บันทึกแล้ว';};
}
function renderRecent(){const items=state.recent.map(recipeById).filter(Boolean);$('#recentList').innerHTML=items.length?items.map(item=>`<button class="history-item" type="button" data-recent="${item.id}">${item.nameTh}</button>`).join(''):'<span class="meta">ยังไม่มีประวัติ</span>';document.querySelectorAll('[data-recent]').forEach(button=>button.addEventListener('click',()=>openRecipe(button.dataset.recent)));}
function openShopping(){const items=state.shopping.map(ingredientName);$('#listContent').innerHTML=`<div class="dialog-body"><div class="dialog-head"><h2>รายการซื้อของ</h2><button class="close" type="button" aria-label="ปิด">×</button></div>${items.length?`<ul class="shopping-list">${state.shopping.map(id=>`<li><span>${ingredientName(id)}</span><button class="link-danger" type="button" data-remove-shopping="${id}">นำออก</button></li>`).join('')}</ul><div class="shopping-tools"><button class="primary" id="copyShopping" type="button">คัดลอกรายการ</button><button class="secondary" id="clearShopping" type="button">ล้างรายการ</button></div>`:'<div class="empty"><h3>ยังไม่มีรายการ</h3><p>กด “เพิ่มของที่ขาด” จากการ์ดเมนู</p></div>'}</div>`;if(!$('#listDialog').open)$('#listDialog').showModal();$('#listContent .close').onclick=()=>$('#listDialog').close();document.querySelectorAll('[data-remove-shopping]').forEach(button=>button.onclick=()=>{state.shopping=state.shopping.filter(id=>id!==button.dataset.removeShopping);persist();openShopping();});if($('#copyShopping'))$('#copyShopping').onclick=async()=>{await navigator.clipboard.writeText(items.map((item,index)=>`${index+1}. ${item}`).join('\n'));$('#copyShopping').textContent='คัดลอกแล้ว';};if($('#clearShopping'))$('#clearShopping').onclick=()=>{state.shopping=[];persist();openShopping();};}
function updateCounts(){$('#selectedCount').textContent=`${state.selectedIngredients.length} รายการ`;$('#mobileSelectedCount').textContent=state.selectedIngredients.length;$('#favoriteCount').textContent=state.favorites.length;$('#shoppingCount').textContent=state.shopping.length;$('#activeFilterCount').textContent=state.excludedAllergens.length;}
function restoreControls(){$('#age').value=state.age;$('#meal').value=state.meal;$('#maxTime').value=state.maxTime;$('#texture').value=state.texture;}
function bind(){
  $('#search').addEventListener('input',renderIngredients);['age','meal','maxTime','texture'].forEach(id=>$('#'+id).addEventListener('change',event=>{state[id]=id==='age'||id==='maxTime'?+event.target.value:event.target.value;persist();renderRecipes();}));$('#sort').addEventListener('change',renderRecipes);
  $('#moreFilters').onclick=()=>{const panel=$('#advancedFilters');panel.hidden=!panel.hidden;$('#moreFilters').setAttribute('aria-expanded',String(!panel.hidden));};
  $('#resetIngredients').onclick=()=>{state.selectedIngredients=[];persist();renderIngredients();renderRecipes();};
  $('#findButton').onclick=$('#mobileFind').onclick=()=>$('#results').scrollIntoView({behavior:'smooth'});
  $('#randomButton').onclick=()=>{const list=getRankedRecipes(recipes,filters()).filter(item=>item.have.length||!state.selectedIngredients.length);if(list.length)openRecipe(list[Math.floor(Math.random()*Math.min(list.length,12))].id);};
  $('#favoritesButton').onclick=()=>{showingFavorites=!showingFavorites;$('#favoritesButton').classList.toggle('active',showingFavorites);renderRecipes();$('#results').scrollIntoView({behavior:'smooth'});};$('#shoppingButton').onclick=openShopping;
  $('#clearDataButton').onclick=()=>$('#confirmDialog').showModal();$('#cancelClear').onclick=()=>$('#confirmDialog').close();$('#confirmClear').onclick=()=>{clearState();state={...defaultState};$('#confirmDialog').close();location.reload();};
  [$('#recipeDialog'),$('#listDialog')].forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();}));
}

restoreControls();renderTabs();renderIngredients();renderFilterOptions();bind();updateCounts();renderRecipes();renderRecent();
window.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());});
