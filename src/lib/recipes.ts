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
    id: "yogurt-parfait",
    name: "بارفيه الزبادي اليوناني واللوز",
    emoji: "🥣",
    time: "٥ دقائق",
    servings: 1,
    benefits: ["كالسيوم عالي", "بروبيوتيك للهضم", "مغنيسيوم من اللوز"],
    ingredients: [
      "كوب زبادي يوناني كامل الدسم",
      "ملعقتان عسل",
      "ربع كوب لوز مفروم",
      "ملعقة بذور شيا",
      "حفنة توت أزرق",
    ],
    steps: [
      "في كوب زجاجي ضع طبقة زبادي.",
      "أضف طبقة لوز وبذور الشيا.",
      "كرّر الطبقات وزيّن بالتوت والعسل.",
    ],
    nutrition: { calories: 410, proteinG: 24, calciumMg: 380, vitaminDIu: 80 },
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
    id: "chicken-broccoli",
    name: "دجاج مشوي مع البروكلي والبطاطا",
    emoji: "🍗",
    time: "٢٥ دقيقة",
    servings: 2,
    benefits: ["بروتين كامل للنمو", "فيتامين ك من البروكلي", "كالسيوم نباتي"],
    ingredients: [
      "٣٠٠غ صدر دجاج",
      "رأس بروكلي صغير",
      "حبتا بطاطا",
      "ملعقتا زيت زيتون",
      "ثوم + ملح + فلفل + بابريكا",
    ],
    steps: [
      "قطّع الدجاج والبطاطا ووزّعهما في صينية.",
      "أضف البروكلي والتوابل والزيت وامزج جيداً.",
      "اخبز في فرن ٢٠٠°م لمدة ٢٠ دقيقة.",
    ],
    nutrition: { calories: 560, proteinG: 48, calciumMg: 180, vitaminDIu: 40 },
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
  {
    id: "lentil-soup",
    name: "شوربة العدس بالليمون",
    emoji: "🍲",
    time: "٣٠ دقيقة",
    servings: 3,
    benefits: ["بروتين نباتي وحديد", "زنك للنمو", "ألياف ممتازة"],
    ingredients: [
      "كوب عدس أحمر",
      "بصلة + جزرة + ٢ فص ثوم",
      "ملعقة كمون + كركم",
      "٤ أكواب ماء",
      "عصير ليمونة",
    ],
    steps: [
      "اقلِ البصل والجزر والثوم بالزيت.",
      "أضف العدس والتوابل والماء واتركها تغلي.",
      "خفّف النار ٢٠ دقيقة ثم اخلطها بالخلاط.",
      "أضف الليمون قبل التقديم.",
    ],
    nutrition: { calories: 280, proteinG: 18, calciumMg: 90, vitaminDIu: 0 },
  },
];
