const KEY='praysaiMealsV2';
export const defaultState={selectedIngredients:['rice','egg','chicken','pumpkin','carrot'],favorites:[],recent:[],cooked:[],shopping:[],excludedAllergens:[],availableEquipment:['หม้อ','กระทะ','หม้อนึ่ง'],age:18,meal:'all',maxTime:999,texture:'all'};

export function loadState(){
  try{
    const parsed=JSON.parse(localStorage.getItem(KEY)||'{}');
    return {...defaultState,...parsed,
      selectedIngredients:Array.isArray(parsed.selectedIngredients)?parsed.selectedIngredients:defaultState.selectedIngredients,
      favorites:Array.isArray(parsed.favorites)?parsed.favorites:[],recent:Array.isArray(parsed.recent)?parsed.recent:[],
      cooked:Array.isArray(parsed.cooked)?parsed.cooked:[],shopping:Array.isArray(parsed.shopping)?parsed.shopping:[],
      excludedAllergens:Array.isArray(parsed.excludedAllergens)?parsed.excludedAllergens:[],
      availableEquipment:Array.isArray(parsed.availableEquipment)?parsed.availableEquipment:defaultState.availableEquipment
    };
  }catch{return {...defaultState};}
}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state));}
export function clearState(){localStorage.removeItem(KEY);}
