// Celebrity height database. Heights in cm. Mix of athletes, actors,
// musicians, and historical figures across the spectrum (140cm – 220cm).
export interface Celebrity {
  name: string;
  nameAr: string;
  heightCm: number;
  category: "football" | "basketball" | "actor" | "musician" | "historical" | "other";
  emoji: string;
  fact: string;
}

export const CELEBRITIES: Celebrity[] = [
  // Short range
  { name: "Kevin Hart", nameAr: "كيفن هارت", heightCm: 157, category: "actor", emoji: "🎬", fact: "ممثل كوميدي شهير، أثبت أن الطول لا يحد الموهبة." },
  { name: "Lionel Messi", nameAr: "ليونيل ميسي", heightCm: 170, category: "football", emoji: "⚽", fact: "أسطورة كرة القدم وأفضل لاعب في التاريخ." },
  { name: "Diego Maradona", nameAr: "دييغو مارادونا", heightCm: 165, category: "football", emoji: "⚽", fact: "أسطورة الأرجنتين وصاحب 'هدف القرن'." },
  { name: "Bruno Mars", nameAr: "برونو مارس", heightCm: 165, category: "musician", emoji: "🎤", fact: "نجم بوب عالمي حائز على جوائز جرامي." },
  { name: "Daniel Radcliffe", nameAr: "دانيال رادكليف", heightCm: 165, category: "actor", emoji: "🎬", fact: "بطل سلسلة هاري بوتر." },
  { name: "Tom Cruise", nameAr: "توم كروز", heightCm: 170, category: "actor", emoji: "🎬", fact: "نجم هوليوود وبطل سلسلة المهمة المستحيلة." },
  { name: "Napoleon Bonaparte", nameAr: "نابليون بونابرت", heightCm: 168, category: "historical", emoji: "👑", fact: "إمبراطور فرنسا وأحد أعظم القادة العسكريين." },
  // Medium range
  { name: "Cristiano Ronaldo", nameAr: "كريستيانو رونالدو", heightCm: 187, category: "football", emoji: "⚽", fact: "خماسي الكرة الذهبية وأحد أعظم الهدافين." },
  { name: "Mohamed Salah", nameAr: "محمد صلاح", heightCm: 175, category: "football", emoji: "⚽", fact: "نجم ليفربول وفخر الكرة المصرية." },
  { name: "Neymar Jr.", nameAr: "نيمار جونيور", heightCm: 175, category: "football", emoji: "⚽", fact: "نجم البرازيل وصاحب المهارات الاستثنائية." },
  { name: "Brad Pitt", nameAr: "براد بيت", heightCm: 180, category: "actor", emoji: "🎬", fact: "نجم هوليوود وحائز على الأوسكار." },
  { name: "Will Smith", nameAr: "ويل سميث", heightCm: 188, category: "actor", emoji: "🎬", fact: "ممثل وموسيقي حائز على الأوسكار." },
  { name: "Leonardo DiCaprio", nameAr: "ليوناردو ديكابريو", heightCm: 183, category: "actor", emoji: "🎬", fact: "نجم تايتانيك وحائز على الأوسكار." },
  { name: "Eminem", nameAr: "إمينيم", heightCm: 173, category: "musician", emoji: "🎤", fact: "أسطورة الراب وأكثر فنان مبيعاً للأغاني الفردية." },
  { name: "Drake", nameAr: "دريك", heightCm: 182, category: "musician", emoji: "🎤", fact: "أحد أنجح فناني الراب في التاريخ." },
  { name: "Zinedine Zidane", nameAr: "زين الدين زيدان", heightCm: 185, category: "football", emoji: "⚽", fact: "أسطورة فرنسا والكرة الذهبية 1998." },
  { name: "Karim Benzema", nameAr: "كريم بنزيمة", heightCm: 185, category: "football", emoji: "⚽", fact: "صاحب الكرة الذهبية 2022." },
  { name: "Mike Tyson", nameAr: "مايك تايسون", heightCm: 178, category: "other", emoji: "🥊", fact: "أصغر بطل عالمي للوزن الثقيل في تاريخ الملاكمة." },
  { name: "Steve Jobs", nameAr: "ستيف جوبز", heightCm: 188, category: "historical", emoji: "💡", fact: "مؤسس آبل وأحد أعظم رواد التكنولوجيا." },
  { name: "Elon Musk", nameAr: "إيلون ماسك", heightCm: 188, category: "other", emoji: "🚀", fact: "مؤسس تسلا وسبيس إكس." },
  // Tall range
  { name: "Zlatan Ibrahimović", nameAr: "زلاتان إبراهيموفيتش", heightCm: 195, category: "football", emoji: "⚽", fact: "نجم سويدي بمسيرة استثنائية في كبرى الأندية الأوروبية." },
  { name: "Virgil van Dijk", nameAr: "فيرجيل فان دايك", heightCm: 195, category: "football", emoji: "⚽", fact: "أحد أفضل المدافعين في العالم." },
  { name: "Peter Crouch", nameAr: "بيتر كراوتش", heightCm: 201, category: "football", emoji: "⚽", fact: "أطول لاعب في تاريخ الدوري الإنجليزي الممتاز." },
  { name: "LeBron James", nameAr: "ليبرون جيمس", heightCm: 206, category: "basketball", emoji: "🏀", fact: "أعظم هداف في تاريخ NBA." },
  { name: "Michael Jordan", nameAr: "مايكل جوردن", heightCm: 198, category: "basketball", emoji: "🏀", fact: "أعظم لاعب كرة سلة في التاريخ." },
  { name: "Kobe Bryant", nameAr: "كوبي براينت", heightCm: 198, category: "basketball", emoji: "🏀", fact: "أسطورة لوس أنجلوس ليكرز." },
  { name: "Stephen Curry", nameAr: "ستيفن كاري", heightCm: 188, category: "basketball", emoji: "🏀", fact: "أعظم رامي ثلاثيات في تاريخ NBA." },
  { name: "Kevin Durant", nameAr: "كيفن دورانت", heightCm: 211, category: "basketball", emoji: "🏀", fact: "أحد أفضل المسجلين في تاريخ NBA." },
  { name: "Giannis Antetokounmpo", nameAr: "ياينيس أنتيتوكونمبو", heightCm: 211, category: "basketball", emoji: "🏀", fact: "MVP الدوري وبطل العالم مع ميلووكي باكس." },
  { name: "Shaquille O'Neal", nameAr: "شاكيل أونيل", heightCm: 216, category: "basketball", emoji: "🏀", fact: "واحد من أقوى المهيمنين في تاريخ NBA." },
  { name: "Yao Ming", nameAr: "ياو مينغ", heightCm: 229, category: "basketball", emoji: "🏀", fact: "أسطورة الصين في كرة السلة." },
  { name: "Dwayne Johnson", nameAr: "دواين جونسون", heightCm: 196, category: "actor", emoji: "🎬", fact: "ذا روك، نجم هوليوود وأحد أعلى الممثلين أجراً." },
  { name: "Chris Hemsworth", nameAr: "كريس هيمسوورث", heightCm: 191, category: "actor", emoji: "🎬", fact: "ثور في عالم مارفل السينمائي." },
  { name: "Vin Diesel", nameAr: "فين ديزل", heightCm: 182, category: "actor", emoji: "🎬", fact: "بطل سلسلة فاست آند فيوريوس." },
  { name: "Jason Momoa", nameAr: "جيسون موموا", heightCm: 193, category: "actor", emoji: "🎬", fact: "أكوامان في عالم DC السينمائي." },
  { name: "Conor McGregor", nameAr: "كونور ماكجريجور", heightCm: 175, category: "other", emoji: "🥊", fact: "أول بطل بحزامين في وقت واحد بـ UFC." },
  { name: "Khabib Nurmagomedov", nameAr: "خبيب نورمحمدوف", heightCm: 178, category: "other", emoji: "🥊", fact: "اعتزل بسجل خالٍ من الهزائم في UFC." },
  { name: "Roger Federer", nameAr: "روجر فيدرر", heightCm: 185, category: "other", emoji: "🎾", fact: "أحد أعظم لاعبي التنس في التاريخ." },
  { name: "Rafael Nadal", nameAr: "رافائيل نادال", heightCm: 185, category: "other", emoji: "🎾", fact: "ملك التراب وصاحب 22 لقباً كبيراً." },
  { name: "Novak Djokovic", nameAr: "نوفاك ديوكوفيتش", heightCm: 188, category: "other", emoji: "🎾", fact: "أكثر لاعب فاز بالألقاب الكبرى في التنس." },
  { name: "Usain Bolt", nameAr: "يوسين بولت", heightCm: 195, category: "other", emoji: "🏃", fact: "أسرع رجل في التاريخ." },
  { name: "Abraham Lincoln", nameAr: "أبراهام لينكولن", heightCm: 193, category: "historical", emoji: "👑", fact: "الرئيس السادس عشر للولايات المتحدة." },
  { name: "Albert Einstein", nameAr: "ألبرت أينشتاين", heightCm: 175, category: "historical", emoji: "🧠", fact: "أعظم عالم فيزياء في القرن العشرين." },
];

/**
 * Find the celebrity whose height is closest to the user's height.
 * If multiple are equally close, rotate by date so the user sees a
 * different "match of the day" each day.
 */
export function getCelebrityMatch(userHeightCm: number, dateSeed?: number): Celebrity {
  const sorted = [...CELEBRITIES].sort((a, b) => {
    const da = Math.abs(a.heightCm - userHeightCm);
    const db = Math.abs(b.heightCm - userHeightCm);
    return da - db;
  });
  // Take top 5 closest, then rotate by day-of-year
  const pool = sorted.slice(0, 5);
  const day = dateSeed ?? Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return pool[day % pool.length];
}

export function getCategoryLabel(c: Celebrity["category"]): string {
  switch (c) {
    case "football": return "كرة قدم";
    case "basketball": return "كرة سلة";
    case "actor": return "ممثل";
    case "musician": return "موسيقي";
    case "historical": return "شخصية تاريخية";
    case "other": return "رياضي / أخرى";
  }
}
