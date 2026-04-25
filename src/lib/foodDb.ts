// Built-in food database — values per 100g.
// Sourced from USDA FoodData Central averages, rounded.
export interface FoodItem {
  id: string;
  name: string; // Arabic
  nameEn: string;
  caloriesPer100g: number;
  proteinG: number;
  calciumMg: number;
  vitaminDIu: number;
}

export const FOOD_DB: FoodItem[] = [
  // Dairy
  { id: "milk", name: "حليب", nameEn: "Milk", caloriesPer100g: 60, proteinG: 3.2, calciumMg: 113, vitaminDIu: 51 },
  { id: "yogurt", name: "زبادي", nameEn: "Yogurt", caloriesPer100g: 59, proteinG: 10, calciumMg: 110, vitaminDIu: 0 },
  { id: "cheese", name: "جبنة", nameEn: "Cheese", caloriesPer100g: 402, proteinG: 25, calciumMg: 721, vitaminDIu: 24 },
  { id: "labneh", name: "لبنة", nameEn: "Labneh", caloriesPer100g: 174, proteinG: 9, calciumMg: 152, vitaminDIu: 0 },
  // Protein
  { id: "egg", name: "بيض", nameEn: "Egg", caloriesPer100g: 155, proteinG: 13, calciumMg: 50, vitaminDIu: 87 },
  { id: "chicken", name: "صدر دجاج", nameEn: "Chicken breast", caloriesPer100g: 165, proteinG: 31, calciumMg: 15, vitaminDIu: 5 },
  { id: "beef", name: "لحم بقري", nameEn: "Beef", caloriesPer100g: 250, proteinG: 26, calciumMg: 18, vitaminDIu: 7 },
  { id: "lamb", name: "لحم ضأن", nameEn: "Lamb", caloriesPer100g: 294, proteinG: 25, calciumMg: 17, vitaminDIu: 3 },
  { id: "salmon", name: "سلمون", nameEn: "Salmon", caloriesPer100g: 208, proteinG: 20, calciumMg: 12, vitaminDIu: 526 },
  { id: "tuna", name: "تونة", nameEn: "Tuna", caloriesPer100g: 132, proteinG: 28, calciumMg: 10, vitaminDIu: 154 },
  { id: "sardine", name: "سردين", nameEn: "Sardines", caloriesPer100g: 208, proteinG: 25, calciumMg: 382, vitaminDIu: 193 },
  { id: "tofu", name: "توفو", nameEn: "Tofu", caloriesPer100g: 76, proteinG: 8, calciumMg: 350, vitaminDIu: 0 },
  // Grains
  { id: "rice", name: "أرز أبيض", nameEn: "White rice", caloriesPer100g: 130, proteinG: 2.7, calciumMg: 10, vitaminDIu: 0 },
  { id: "brownrice", name: "أرز بني", nameEn: "Brown rice", caloriesPer100g: 123, proteinG: 2.7, calciumMg: 3, vitaminDIu: 0 },
  { id: "bread", name: "خبز", nameEn: "Bread", caloriesPer100g: 265, proteinG: 9, calciumMg: 144, vitaminDIu: 0 },
  { id: "pita", name: "خبز عربي", nameEn: "Pita bread", caloriesPer100g: 275, proteinG: 9, calciumMg: 86, vitaminDIu: 0 },
  { id: "oats", name: "شوفان", nameEn: "Oats", caloriesPer100g: 389, proteinG: 17, calciumMg: 54, vitaminDIu: 0 },
  { id: "pasta", name: "معكرونة", nameEn: "Pasta", caloriesPer100g: 131, proteinG: 5, calciumMg: 7, vitaminDIu: 0 },
  // Legumes
  { id: "lentils", name: "عدس", nameEn: "Lentils", caloriesPer100g: 116, proteinG: 9, calciumMg: 19, vitaminDIu: 0 },
  { id: "chickpeas", name: "حمص", nameEn: "Chickpeas", caloriesPer100g: 164, proteinG: 9, calciumMg: 49, vitaminDIu: 0 },
  { id: "beans", name: "فول", nameEn: "Fava beans", caloriesPer100g: 110, proteinG: 7.6, calciumMg: 36, vitaminDIu: 0 },
  // Vegetables
  { id: "spinach", name: "سبانخ", nameEn: "Spinach", caloriesPer100g: 23, proteinG: 2.9, calciumMg: 99, vitaminDIu: 0 },
  { id: "broccoli", name: "بروكلي", nameEn: "Broccoli", caloriesPer100g: 34, proteinG: 2.8, calciumMg: 47, vitaminDIu: 0 },
  { id: "kale", name: "كرنب", nameEn: "Kale", caloriesPer100g: 49, proteinG: 4.3, calciumMg: 150, vitaminDIu: 0 },
  { id: "cucumber", name: "خيار", nameEn: "Cucumber", caloriesPer100g: 16, proteinG: 0.7, calciumMg: 16, vitaminDIu: 0 },
  { id: "tomato", name: "طماطم", nameEn: "Tomato", caloriesPer100g: 18, proteinG: 0.9, calciumMg: 10, vitaminDIu: 0 },
  { id: "carrot", name: "جزر", nameEn: "Carrot", caloriesPer100g: 41, proteinG: 0.9, calciumMg: 33, vitaminDIu: 0 },
  { id: "potato", name: "بطاطا", nameEn: "Potato", caloriesPer100g: 77, proteinG: 2, calciumMg: 12, vitaminDIu: 0 },
  // Fruit
  { id: "apple", name: "تفاح", nameEn: "Apple", caloriesPer100g: 52, proteinG: 0.3, calciumMg: 6, vitaminDIu: 0 },
  { id: "banana", name: "موز", nameEn: "Banana", caloriesPer100g: 89, proteinG: 1.1, calciumMg: 5, vitaminDIu: 0 },
  { id: "orange", name: "برتقال", nameEn: "Orange", caloriesPer100g: 47, proteinG: 0.9, calciumMg: 40, vitaminDIu: 0 },
  { id: "date", name: "تمر", nameEn: "Dates", caloriesPer100g: 277, proteinG: 1.8, calciumMg: 64, vitaminDIu: 0 },
  { id: "grape", name: "عنب", nameEn: "Grapes", caloriesPer100g: 69, proteinG: 0.7, calciumMg: 10, vitaminDIu: 0 },
  { id: "strawberry", name: "فراولة", nameEn: "Strawberry", caloriesPer100g: 32, proteinG: 0.7, calciumMg: 16, vitaminDIu: 0 },
  // Nuts & seeds
  { id: "almond", name: "لوز", nameEn: "Almonds", caloriesPer100g: 579, proteinG: 21, calciumMg: 269, vitaminDIu: 0 },
  { id: "walnut", name: "جوز", nameEn: "Walnuts", caloriesPer100g: 654, proteinG: 15, calciumMg: 98, vitaminDIu: 0 },
  { id: "peanut", name: "فول سوداني", nameEn: "Peanuts", caloriesPer100g: 567, proteinG: 26, calciumMg: 92, vitaminDIu: 0 },
  { id: "sesame", name: "سمسم", nameEn: "Sesame", caloriesPer100g: 573, proteinG: 18, calciumMg: 975, vitaminDIu: 0 },
  // Misc / snacks
  { id: "olive", name: "زيتون", nameEn: "Olives", caloriesPer100g: 115, proteinG: 0.8, calciumMg: 88, vitaminDIu: 0 },
  { id: "hummus", name: "حمص بالطحينة", nameEn: "Hummus", caloriesPer100g: 166, proteinG: 8, calciumMg: 38, vitaminDIu: 0 },
  { id: "shawarma", name: "شاورما", nameEn: "Shawarma", caloriesPer100g: 220, proteinG: 18, calciumMg: 30, vitaminDIu: 5 },
  { id: "falafel", name: "فلافل", nameEn: "Falafel", caloriesPer100g: 333, proteinG: 13, calciumMg: 54, vitaminDIu: 0 },
];

export function searchFoods(q: string, limit = 12): FoodItem[] {
  const s = q.trim().toLowerCase();
  if (!s) return FOOD_DB.slice(0, limit);
  return FOOD_DB.filter(
    (f) => f.name.includes(s) || f.nameEn.toLowerCase().includes(s),
  ).slice(0, limit);
}

export function findFoodById(id: string): FoodItem | undefined {
  return FOOD_DB.find((f) => f.id === id);
}

// Lookup OpenFoodFacts by barcode. No API key required.
export interface OffProduct {
  name: string;
  caloriesPer100g: number;
  proteinG: number;
  calciumMg: number;
  vitaminDIu: number;
}

export async function lookupBarcode(barcode: string): Promise<OffProduct | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;
    const p = data.product;
    const n = p.nutriments ?? {};
    const calciumG = n.calcium_100g ?? 0; // grams
    const vitDUg = n["vitamin-d_100g"] ?? 0; // micrograms
    return {
      name: p.product_name_ar || p.product_name || p.generic_name || "منتج",
      caloriesPer100g: Math.round(n["energy-kcal_100g"] ?? n.energy_100g ?? 0),
      proteinG: Number(n.proteins_100g ?? 0),
      calciumMg: Math.round(calciumG * 1000),
      vitaminDIu: Math.round(vitDUg * 40), // 1 µg = 40 IU
    };
  } catch {
    return null;
  }
}
