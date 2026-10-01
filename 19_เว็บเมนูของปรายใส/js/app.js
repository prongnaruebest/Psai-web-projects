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


// ==================== NEW: PANTRY EXPIRY & MEAL FEEDBACK EXTENSION ====================
function getPantryExpiring() {
  try {
    return JSON.parse(localStorage.getItem('praysai_pantry_expiring')) || [
      { id: 'egg', status: 'urgent', nameTh: 'ไข่ไก่' },
      { id: 'tofu_egg', status: 'soon', nameTh: 'เต้าหู้ไข่' },
      { id: 'pumpkin', status: 'soon', nameTh: 'ฟักทอง' }
    ];
  } catch(e) { return []; }
}

function savePantryExpiring(list) {
  localStorage.setItem('praysai_pantry_expiring', JSON.stringify(list));
  updatePantryCountBadge();
}

function updatePantryCountBadge() {
  const list = getPantryExpiring();
  const el = document.getElementById('pantryCount');
  if (el) el.textContent = list.length;
}

function getMealReactions() {
  try {
    return JSON.parse(localStorage.getItem('praysai_meal_reactions')) || {};
  } catch(e) { return {}; }
}

function saveMealReaction(recipeId, rating, allergyNote) {
  const map = getMealReactions();
  map[recipeId] = { rating, allergyNote, date: new Date().toISOString() };
  localStorage.setItem('praysai_meal_reactions', JSON.stringify(map));
}

function initPantryModal() {
  const pantryBtn = document.getElementById('pantryButton');
  const pantryDialog = document.getElementById('pantryDialog');
  const closePantry = document.getElementById('closePantry');
  const selectIngredient = document.getElementById('pantrySelectIngredient');
  const addBtn = document.getElementById('addPantryItem');
  const clearBtn = document.getElementById('clearPantryBtn');
  const autoCookBtn = document.getElementById('autoCookExpiringBtn');

  if (!pantryBtn || !pantryDialog) return;

  // Populate ingredient select dropdown
  if (selectIngredient) {
    selectIngredient.innerHTML = ingredients.filter(i => i.enabled).map(i => `<option value="${i.id}">${i.nameTh}</option>`).join('');
  }

  function renderPantryList() {
    const list = getPantryExpiring();
    const container = document.getElementById('pantryListContainer');
    if (!container) return;
    if (list.length === 0) {
      container.innerHTML = '<div style="padding:16px; text-align:center; color:#94a3b8; font-size:13px;">ยังไม่มีวัตถุดิบใกล้หมดอายุในรายการ</div>';
      return;
    }
    container.innerHTML = list.map(item => {
      const isUrgent = item.status === 'urgent';
      const badgeColor = isUrgent ? '#ef4444' : '#f59e0b';
      const badgeText = isUrgent ? '🔴 รีบใช้ใน 1-2 วัน' : '🟡 ควรใช้ใน 3 วัน';
      return `<div style="display:flex; align-items:center; justify-content:space-between; padding:8px; border-bottom:1px solid #f1f5f9;">
        <div>
          <span style="font-weight:600; font-size:13.5px;">${item.nameTh}</span>
          <span style="font-size:11px; color:${badgeColor}; margin-left:8px; font-weight:500;">${badgeText}</span>
        </div>
        <button type="button" class="link-danger" data-remove-pantry="${item.id}" style="font-size:12px; cursor:pointer;">ลบ</button>
      </div>`;
    }).join('');

    container.querySelectorAll('[data-remove-pantry]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.removePantry;
        const filtered = getPantryExpiring().filter(x => x.id !== id);
        savePantryExpiring(filtered);
        renderPantryList();
      };
    });
  }

  pantryBtn.onclick = () => {
    renderPantryList();
    pantryDialog.showModal();
  };

  if (closePantry) closePantry.onclick = () => pantryDialog.close();

  if (addBtn) {
    addBtn.onclick = () => {
      const id = selectIngredient.value;
      const status = document.getElementById('pantrySelectStatus').value;
      const nameTh = ingredientName(id);
      let list = getPantryExpiring();
      if (!list.some(x => x.id === id)) {
        list.push({ id, status, nameTh });
        savePantryExpiring(list);
        renderPantryList();
      }
    };
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      savePantryExpiring([]);
      renderPantryList();
    };
  }

  if (autoCookBtn) {
    autoCookBtn.onclick = () => {
      const list = getPantryExpiring();
      if (list.length === 0) {
        alert('กรุณาเพิ่มวัตถุดิบใกล้หมดอายุก่อน');
        return;
      }
      state.selectedIngredients = [...new Set([...state.selectedIngredients, ...list.map(x => x.id)])];
      persist();
      renderIngredients();
      renderRecipes();
      pantryDialog.close();
      const resultsEl = document.getElementById('results');
      if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
    };
  }
}

// Enhance openRecipe dialog with rating stars and reaction
const origOpenRecipe = openRecipe;
openRecipe = function(id) {
  origOpenRecipe(id);
  const recipe = recipeById(id);
  if (!recipe) return;

  const reactions = getMealReactions();
  const currentReaction = reactions[id] || { rating: 0, allergyNote: 'normal' };

  const reactionBoxHtml = `
    <div style="margin-top:16px; padding:14px; background:#fffbeb; border:1px solid #fde68a; border-radius:12px;">
      <h4 style="font-size:13px; font-weight:700; color:#b45309; margin:0 0 8px;">🌟 บันทึกความชอบ & อาการของปรายใสสำหรับเมนูนี้:</h4>
      <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:12px; color:#78350f;">ระดับความชอบ:</span>
          <div style="display:flex; gap:4px;" id="starRatingBox">
            <button type="button" class="star-btn" data-star="1" style="cursor:pointer; background:none; border:none; font-size:18px; color:${currentReaction.rating >= 1 ? '#f59e0b' : '#cbd5e1'};">★</button>
            <button type="button" class="star-btn" data-star="2" style="cursor:pointer; background:none; border:none; font-size:18px; color:${currentReaction.rating >= 2 ? '#f59e0b' : '#cbd5e1'};">★</button>
            <button type="button" class="star-btn" data-star="3" style="cursor:pointer; background:none; border:none; font-size:18px; color:${currentReaction.rating >= 3 ? '#f59e0b' : '#cbd5e1'};">★</button>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:12px; color:#78350f;">อาการ/ปฏิกิริยา:</span>
          <select id="allergySelect" style="padding:4px 8px; border-radius:6px; border:1px solid #fcd34d; font-size:12px; background:white;">
            <option value="normal" ${currentReaction.allergyNote === 'normal' ? 'selected' : ''}>ปกติ (กินเกลี้ยง)</option>
            <option value="dislike" ${currentReaction.allergyNote === 'dislike' ? 'selected' : ''}>ไม่ค่อยชอบ</option>
            <option value="rash" ${currentReaction.allergyNote === 'rash' ? 'selected' : ''}>มีผื่น/คัน</option>
            <option value="bloating" ${currentReaction.allergyNote === 'bloating' ? 'selected' : ''}>ท้องอืด/แหวะ</option>
          </select>
        </div>
      </div>
      <div id="ratingSavedFeedback" style="font-size:11px; color:#16a34a; font-weight:600; margin-top:6px; display:none;">✔ บันทึกข้อมูลปรายใสเรียบร้อยแล้ว</div>
    </div>
  `;

  const contentEl = document.getElementById('recipeContent');
  if (contentEl) {
    const dialogBody = contentEl.querySelector('.dialog-body');
    if (dialogBody) {
      const actionsEl = dialogBody.querySelector('.dialog-actions');
      if (actionsEl) {
        const wrap = document.createElement('div');
        wrap.innerHTML = reactionBoxHtml;
        dialogBody.insertBefore(wrap, actionsEl);

        let selectedStars = currentReaction.rating;
        const starBtns = wrap.querySelectorAll('.star-btn');
        starBtns.forEach(btn => {
          btn.onclick = () => {
            selectedStars = parseInt(btn.dataset.star, 10);
            starBtns.forEach(b => {
              const s = parseInt(b.dataset.star, 10);
              b.style.color = s <= selectedStars ? '#f59e0b' : '#cbd5e1';
            });
            saveMealReaction(id, selectedStars, document.getElementById('allergySelect').value);
            showFeedback();
          };
        });

        const allergySelect = wrap.querySelector('#allergySelect');
        if (allergySelect) {
          allergySelect.onchange = () => {
            saveMealReaction(id, selectedStars, allergySelect.value);
            showFeedback();
          };
        }

        function showFeedback() {
          const fb = wrap.querySelector('#ratingSavedFeedback');
          if (fb) {
            fb.style.display = 'block';
            setTimeout(() => fb.style.display = 'none', 1500);
          }
        }
      }
    }
  }
};

setTimeout(() => {
  initPantryModal();
  updatePantryCountBadge();
}, 100);
