// Simple, nutrient-dense recipes supporting bone health & height growth.
// Focus: calcium, vitamin D, protein, magnesium, zinc, vitamin K2.

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  time: string; // prep time
  servings: number;
  benefits: string[]; // why it helps growth
  ingredients: string[];
  steps: string[];
  nutrition: {
    calories: number;
    proteinG: number;
    calciumMg: number;
    vitaminDIu: number;
  };
}

export const RECIPES: Recipe[] = [
  {
    id: "salmon-bowl",
    name: "بول السلمون مع الكينوا",
    emoji: "🐟",
    time: "٢٠ دقيقة",
    servings: 1,
    benefits: ["فيتامين د طبيعي", "أوميغا ٣ للعظام", "بروتين كامل"],
    ingredients: [
      "١٥٠غ فيليه سلمون",
      "نصف كوب كينوا مطبوخة",
      "حفنة سبانخ طازجة",
      "نصف أفوكادو",
      "ملعقة زيت زيتون",
      "ليمون + ملح + فلفل",
    ],
    steps: [
      "تبّل السلمون بالملح والفلفل والليمون.",
      "اشوِه على مقلاة بزيت الزيتون ٤ دقائق لكل جانب.",
      "ضع الكينوا في وعاء، ثم السبانخ والأفوكادو.",
      "ضع السلمون فوقها وقدّمها دافئة.",
    ],
    nutrition: { calories: 620, proteinG: 42, calciumMg: 120, vitaminDIu: 750 },
  },
  {
    id: "egg-spinach",
    name: "بيض بالسبانخ والجبن",
    emoji: "🍳",
    time: "١٠ دقائق",
    servings: 1,
    benefits: ["بروتين عالي الجودة", "حديد + كالسيوم", "فيتامين د من الصفار"],
    ingredients: [
      "٣ بيضات",
      "حفنتان سبانخ",
      "٣٠غ جبن فيتا أو موزاريلا",
      "ملعقة زيت زيتون",
      "ملح + فلفل أسود",
    ],
    steps: [
      "سخّن الزيت وأضف السبانخ حتى تذبل.",
      "اخفق البيض وصبّه فوق السبانخ.",
      "رشّ الجبن واطبخ على نار هادئة حتى ينضج.",
    ],
    nutrition: { calories: 380, proteinG: 28, calciumMg: 320, vitaminDIu: 280 },
  },
  {
    id: "sardine-toast",
    name: "توست السردين بالطحينة",
    emoji: "🥪",
    time: "٧ دقائق",
    servings: 1,
    benefits: ["كالسيوم من عظام السردين", "فيتامين د", "أوميغا ٣"],
    ingredients: [
      "علبة سردين بزيت الزيتون",
      "شريحتا خبز قمح كامل",
      "ملعقة طحينة",
      "شرائح طماطم وخيار",
      "عصرة ليمون",
    ],
    steps: [
      "حمّص الخبز جيداً.",
      "ادهنه بالطحينة ثم وزّع السردين.",
      "أضف الطماطم والخيار وعصرة ليمون.",
    ],
    nutrition: { calories: 480, proteinG: 32, calciumMg: 410, vitaminDIu: 320 },
  },
  {
    id: "milk-oats",
    name: "شوفان بالحليب والموز",
    emoji: "🥛",
    time: "٨ دقائق",
    servings: 1,
    benefits: ["كالسيوم من الحليب", "ألياف وطاقة بطيئة", "بوتاسيوم للعضلات"],
    ingredients: [
      "نصف كوب شوفان",
      "كوب حليب كامل الدسم",
      "موزة ناضجة",
      "ملعقة زبدة فول سوداني",
      "رشة قرفة",
    ],
    steps: [
      "اطبخ الشوفان مع الحليب على نار هادئة ٥ دقائق.",
      "اسكبه في وعاء وأضف شرائح الموز.",
      "ضع زبدة الفول السوداني والقرفة.",
    ],
    nutrition: { calories: 520, proteinG: 22, calciumMg: 360, vitaminDIu: 130 },
  },
  {
    id: "tahini-smoothie",
    name: "سموذي الطحينة والتمر",
    emoji: "🥤",
    time: "٣ دقائق",
    servings: 1,
    benefits: ["كالسيوم مركّز من السمسم", "حديد ومغنيسيوم", "طاقة سريعة"],
    ingredients: [
      "كوب حليب",
      "ملعقة طحينة",
      "٣ تمرات منزوعة النوى",
      "ملعقة كاكاو خام",
      "مكعبات ثلج",
    ],
    steps: [
      "ضع كل المكونات في الخلاط.",
      "اخلط حتى يصبح ناعماً وكريمياً.",
      "اسكبه في كوب وقدّمه بارداً.",
    ],
    nutrition: { calories: 360, proteinG: 12, calciumMg: 420, vitaminDIu: 100 },
  },
];
