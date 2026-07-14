import React, { useState, useRef } from "react";
import { Plus, X, ChefHat, Loader2, Beef, Leaf, Sprout, AlertCircle, Clock, Users2, Carrot, Apple, Drumstick, Milk, Wheat, Heart, Star, Globe, Flame } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
];

const LANGUAGE_NAMES = { en: "English", pt: "Portuguese", es: "Spanish", fr: "French", it: "Italian" };

const DIETS = [
  { key: "carnivorous", icon: Beef, color: "#B5482A" },
  { key: "vegetarian", icon: Leaf, color: "#B98418" },
  { key: "vegan", icon: Sprout, color: "#5B7A4A" },
];

const UNITS = ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "piece", "pinch"];

const UNIT_LABELS = {
  g: { en: "g", pt: "g", es: "g", fr: "g", it: "g" },
  kg: { en: "kg", pt: "kg", es: "kg", fr: "kg", it: "kg" },
  ml: { en: "ml", pt: "ml", es: "ml", fr: "ml", it: "ml" },
  l: { en: "l", pt: "l", es: "l", fr: "l", it: "l" },
  tsp: { en: "tsp", pt: "colher chá", es: "cdta", fr: "c. à c.", it: "cucchiaino" },
  tbsp: { en: "tbsp", pt: "colher sopa", es: "cda", fr: "c. à s.", it: "cucchiaio" },
  cup: { en: "cup", pt: "xícara", es: "taza", fr: "tasse", it: "tazza" },
  piece: { en: "piece(s)", pt: "un.", es: "ud.", fr: "pièce(s)", it: "pz" },
  pinch: { en: "pinch", pt: "pitada", es: "pizca", fr: "pincée", it: "pizzico" },
};

const CATEGORIES = [
  { key: "vegetables", icon: Carrot, defaultUnit: "g", items: ["Tomato", "Onion", "Garlic", "Carrot", "Potato", "Spinach", "Broccoli", "Bell pepper", "Zucchini", "Mushroom", "Cucumber", "Lettuce"] },
  { key: "fruits", icon: Apple, defaultUnit: "piece", items: ["Apple", "Banana", "Lemon", "Lime", "Orange", "Avocado", "Berries", "Mango", "Grapes", "Pineapple"] },
  { key: "proteins", icon: Drumstick, defaultUnit: "g", items: ["Chicken breast", "Beef", "Pork", "Salmon", "Shrimp", "Tofu", "Eggs", "Chickpeas", "Lentils", "Black beans"] },
  { key: "dairy", icon: Milk, defaultUnit: "ml", items: ["Milk", "Butter", "Cheese", "Yogurt", "Cream", "Eggs"] },
  { key: "grains", icon: Wheat, defaultUnit: "g", items: ["Rice", "Pasta", "Bread", "Flour", "Oats", "Quinoa"] },
  { key: "spices", icon: Flame, defaultUnit: "tsp", items: ["Salt", "Black pepper", "Paprika", "Cumin", "Cinnamon", "Oregano", "Basil", "Chili powder", "Turmeric", "Ginger", "Nutmeg", "Bay leaf"] },
];

const ITEM_TRANSLATIONS = {
  "Tomato": { pt: "Tomate", es: "Tomate", fr: "Tomate", it: "Pomodoro" },
  "Onion": { pt: "Cebola", es: "Cebolla", fr: "Oignon", it: "Cipolla" },
  "Garlic": { pt: "Alho", es: "Ajo", fr: "Ail", it: "Aglio" },
  "Carrot": { pt: "Cenoura", es: "Zanahoria", fr: "Carotte", it: "Carota" },
  "Potato": { pt: "Batata", es: "Patata", fr: "Pomme de terre", it: "Patata" },
  "Spinach": { pt: "Espinafre", es: "Espinaca", fr: "Épinard", it: "Spinaci" },
  "Broccoli": { pt: "Brócolis", es: "Brócoli", fr: "Brocoli", it: "Broccoli" },
  "Bell pepper": { pt: "Pimentão", es: "Pimiento", fr: "Poivron", it: "Peperone" },
  "Zucchini": { pt: "Courgette", es: "Calabacín", fr: "Courgette", it: "Zucchina" },
  "Mushroom": { pt: "Cogumelo", es: "Champiñón", fr: "Champignon", it: "Fungo" },
  "Cucumber": { pt: "Pepino", es: "Pepino", fr: "Concombre", it: "Cetriolo" },
  "Lettuce": { pt: "Alface", es: "Lechuga", fr: "Laitue", it: "Lattuga" },
  "Apple": { pt: "Maçã", es: "Manzana", fr: "Pomme", it: "Mela" },
  "Banana": { pt: "Banana", es: "Plátano", fr: "Banane", it: "Banana" },
  "Lemon": { pt: "Limão", es: "Limón", fr: "Citron", it: "Limone" },
  "Lime": { pt: "Lima", es: "Lima", fr: "Citron vert", it: "Lime" },
  "Orange": { pt: "Laranja", es: "Naranja", fr: "Orange", it: "Arancia" },
  "Avocado": { pt: "Abacate", es: "Aguacate", fr: "Avocat", it: "Avocado" },
  "Berries": { pt: "Frutas vermelhas", es: "Bayas", fr: "Baies", it: "Frutti di bosco" },
  "Mango": { pt: "Manga", es: "Mango", fr: "Mangue", it: "Mango" },
  "Grapes": { pt: "Uvas", es: "Uvas", fr: "Raisins", it: "Uva" },
  "Pineapple": { pt: "Ananás", es: "Piña", fr: "Ananas", it: "Ananas" },
  "Chicken breast": { pt: "Peito de frango", es: "Pechuga de pollo", fr: "Blanc de poulet", it: "Petto di pollo" },
  "Beef": { pt: "Carne bovina", es: "Carne de res", fr: "Bœuf", it: "Manzo" },
  "Pork": { pt: "Carne de porco", es: "Cerdo", fr: "Porc", it: "Maiale" },
  "Salmon": { pt: "Salmão", es: "Salmón", fr: "Saumon", it: "Salmone" },
  "Shrimp": { pt: "Camarão", es: "Camarón", fr: "Crevette", it: "Gambero" },
  "Tofu": { pt: "Tofu", es: "Tofu", fr: "Tofu", it: "Tofu" },
  "Eggs": { pt: "Ovos", es: "Huevos", fr: "Œufs", it: "Uova" },
  "Chickpeas": { pt: "Grão-de-bico", es: "Garbanzos", fr: "Pois chiches", it: "Ceci" },
  "Lentils": { pt: "Lentilhas", es: "Lentejas", fr: "Lentilles", it: "Lenticchie" },
  "Black beans": { pt: "Feijão preto", es: "Frijoles negros", fr: "Haricots noirs", it: "Fagioli neri" },
  "Milk": { pt: "Leite", es: "Leche", fr: "Lait", it: "Latte" },
  "Butter": { pt: "Manteiga", es: "Mantequilla", fr: "Beurre", it: "Burro" },
  "Cheese": { pt: "Queijo", es: "Queso", fr: "Fromage", it: "Formaggio" },
  "Yogurt": { pt: "Iogurte", es: "Yogur", fr: "Yaourt", it: "Yogurt" },
  "Cream": { pt: "Natas", es: "Nata", fr: "Crème", it: "Panna" },
  "Rice": { pt: "Arroz", es: "Arroz", fr: "Riz", it: "Riso" },
  "Pasta": { pt: "Massa", es: "Pasta", fr: "Pâtes", it: "Pasta" },
  "Bread": { pt: "Pão", es: "Pan", fr: "Pain", it: "Pane" },
  "Flour": { pt: "Farinha", es: "Harina", fr: "Farine", it: "Farina" },
  "Oats": { pt: "Aveia", es: "Avena", fr: "Avoine", it: "Avena" },
  "Quinoa": { pt: "Quinoa", es: "Quinoa", fr: "Quinoa", it: "Quinoa" },
  "Salt": { pt: "Sal", es: "Sal", fr: "Sel", it: "Sale" },
  "Black pepper": { pt: "Pimenta-do-reino", es: "Pimienta negra", fr: "Poivre noir", it: "Pepe nero" },
  "Paprika": { pt: "Páprica", es: "Pimentón", fr: "Paprika", it: "Paprika" },
  "Cumin": { pt: "Cominho", es: "Comino", fr: "Cumin", it: "Cumino" },
  "Cinnamon": { pt: "Canela", es: "Canela", fr: "Cannelle", it: "Cannella" },
  "Oregano": { pt: "Orégano", es: "Orégano", fr: "Origan", it: "Origano" },
  "Basil": { pt: "Manjericão", es: "Albahaca", fr: "Basilic", it: "Basilico" },
  "Chili powder": { pt: "Pimenta em pó", es: "Chile en polvo", fr: "Piment en poudre", it: "Peperoncino in polvere" },
  "Turmeric": { pt: "Açafrão-da-terra", es: "Cúrcuma", fr: "Curcuma", it: "Curcuma" },
  "Ginger": { pt: "Gengibre", es: "Jengibre", fr: "Gingembre", it: "Zenzero" },
  "Nutmeg": { pt: "Noz-moscada", es: "Nuez moscada", fr: "Muscade", it: "Noce moscata" },
  "Bay leaf": { pt: "Louro", es: "Laurel", fr: "Laurier", it: "Alloro" },
};

const TRANSLATIONS = {
  en: { brand: "Pantry Ledger", heroLine1: "What's in the kitchen,", heroLine2: "what's on the table.", subtitle: "List what you've got, set how you eat, and let the ledger turn it into supper.", chooseLanguage: "Language", favorites: "Favorites", yourPantry: "Your pantry", emptyPantry: "Nothing listed yet — add an ingredient below.", quickAdd: "Quick add", orAddOwn: "Or add your own", ingredientPlaceholder: "Ingredient, e.g. courgette", qtyPlaceholder: "Qty", howYouEat: "How you eat", findRecipes: "Find recipes", workingItOut: "Working it out…", loadMore: "Load more recipes", kcal: "kcal", protein: "protein", carbs: "carbs", fat: "fat", ledgerWaitingTitle: "The ledger is waiting.", ledgerWaitingSubtitle: 'Add what\'s in your kitchen and press "Find recipes."', noFavoritesTitle: "No favorites yet.", noFavoritesSubtitle: "Tap the heart on any recipe to save it here.", addAtLeastOne: "Add at least one ingredient to your pantry first.", couldntGenerate: "Couldn't generate recipes just now. Try again in a moment.", noRecipesBack: "No recipes came back — try adjusting your pantry and try again.", min: "min", servings: "servings", alsoNeeds: "Also needs:", categoryLabels: { vegetables: "Vegetables", fruits: "Fruits", proteins: "Proteins", dairy: "Dairy & Eggs", grains: "Grains & Pantry", spices: "Spices" }, dietLabels: { carnivorous: "Carnivorous", vegetarian: "Vegetarian", vegan: "Vegan" } },
  pt: { brand: "Livro da Despensa", heroLine1: "O que há na cozinha,", heroLine2: "o que vai à mesa.", subtitle: "Liste o que tem, defina como come, e deixe o livro transformar isso em jantar.", chooseLanguage: "Idioma", favorites: "Favoritos", yourPantry: "Sua despensa", emptyPantry: "Nada listado ainda — adicione um ingrediente abaixo.", quickAdd: "Adicionar rápido", orAddOwn: "Ou adicione o seu", ingredientPlaceholder: "Ingrediente, ex. courgette", qtyPlaceholder: "Qtd", howYouEat: "Como você come", findRecipes: "Encontrar receitas", workingItOut: "Preparando…", loadMore: "Carregar mais receitas", kcal: "kcal", protein: "proteína", carbs: "carboidratos", fat: "gordura", ledgerWaitingTitle: "O livro está à espera.", ledgerWaitingSubtitle: 'Adicione o que tem na cozinha e clique em "Encontrar receitas."', noFavoritesTitle: "Ainda sem favoritos.", noFavoritesSubtitle: "Toque no coração de qualquer receita para guardá-la aqui.", addAtLeastOne: "Adicione pelo menos um ingrediente à sua despensa primeiro.", couldntGenerate: "Não foi possível gerar receitas agora. Tente novamente em instantes.", noRecipesBack: "Nenhuma receita foi encontrada — ajuste sua despensa e tente novamente.", min: "min", servings: "porções", alsoNeeds: "Também precisa de:", categoryLabels: { vegetables: "Vegetais", fruits: "Frutas", proteins: "Proteínas", dairy: "Laticínios e Ovos", grains: "Cereais e Despensa", spices: "Especiarias" }, dietLabels: { carnivorous: "Carnívoro", vegetarian: "Vegetariano", vegan: "Vegano" } },
  es: { brand: "Libro de la Despensa", heroLine1: "Lo que hay en la cocina,", heroLine2: "lo que va a la mesa.", subtitle: "Enumera lo que tienes, define cómo comes, y deja que el libro lo convierta en cena.", chooseLanguage: "Idioma", favorites: "Favoritos", yourPantry: "Tu despensa", emptyPantry: "Nada listado todavía — añade un ingrediente abajo.", quickAdd: "Añadir rápido", orAddOwn: "O añade el tuyo", ingredientPlaceholder: "Ingrediente, ej. calabacín", qtyPlaceholder: "Cant", howYouEat: "Cómo comes", findRecipes: "Buscar recetas", workingItOut: "Preparando…", loadMore: "Cargar más recetas", kcal: "kcal", protein: "proteína", carbs: "carbohidratos", fat: "grasa", ledgerWaitingTitle: "El libro está esperando.", ledgerWaitingSubtitle: 'Añade lo que tienes en la cocina y pulsa "Buscar recetas."', noFavoritesTitle: "Aún no hay favoritos.", noFavoritesSubtitle: "Toca el corazón de cualquier receta para guardarla aquí.", addAtLeastOne: "Añade al menos un ingrediente a tu despensa primero.", couldntGenerate: "No se pudieron generar recetas ahora. Inténtalo de nuevo en un momento.", noRecipesBack: "No se encontraron recetas — ajusta tu despensa e inténtalo de nuevo.", min: "min", servings: "porciones", alsoNeeds: "También necesita:", categoryLabels: { vegetables: "Verduras", fruits: "Frutas", proteins: "Proteínas", dairy: "Lácteos y Huevos", grains: "Cereales y Despensa", spices: "Especias" }, dietLabels: { carnivorous: "Carnívoro", vegetarian: "Vegetariano", vegan: "Vegano" } },
  fr: { brand: "Carnet du Garde-Manger", heroLine1: "Ce qu'il y a dans la cuisine,", heroLine2: "ce qu'il y a sur la table.", subtitle: "Listez ce que vous avez, définissez votre régime, et laissez le carnet le transformer en dîner.", chooseLanguage: "Langue", favorites: "Favoris", yourPantry: "Votre garde-manger", emptyPantry: "Rien n'est encore listé — ajoutez un ingrédient ci-dessous.", quickAdd: "Ajout rapide", orAddOwn: "Ou ajoutez le vôtre", ingredientPlaceholder: "Ingrédient, ex. courgette", qtyPlaceholder: "Qté", howYouEat: "Votre régime", findRecipes: "Trouver des recettes", workingItOut: "Ça mijote…", loadMore: "Charger plus de recettes", kcal: "kcal", protein: "protéines", carbs: "glucides", fat: "lipides", ledgerWaitingTitle: "Le carnet attend.", ledgerWaitingSubtitle: 'Ajoutez ce qu\'il y a dans votre cuisine et appuyez sur "Trouver des recettes."', noFavoritesTitle: "Pas encore de favoris.", noFavoritesSubtitle: "Appuyez sur le cœur d'une recette pour l'enregistrer ici.", addAtLeastOne: "Ajoutez d'abord au moins un ingrédient à votre garde-manger.", couldntGenerate: "Impossible de générer des recettes pour le moment. Réessayez dans un instant.", noRecipesBack: "Aucune recette trouvée — ajustez votre garde-manger et réessayez.", min: "min", servings: "portions", alsoNeeds: "Il faut aussi :", categoryLabels: { vegetables: "Légumes", fruits: "Fruits", proteins: "Protéines", dairy: "Laitages et Œufs", grains: "Céréales et Épicerie", spices: "Épices" }, dietLabels: { carnivorous: "Carnivore", vegetarian: "Végétarien", vegan: "Végane" } },
  it: { brand: "Quaderno della Dispensa", heroLine1: "Quello che c'è in cucina,", heroLine2: "quello che c'è in tavola.", subtitle: "Elenca quello che hai, imposta come mangi, e lascia che il quaderno lo trasformi in cena.", chooseLanguage: "Lingua", favorites: "Preferiti", yourPantry: "La tua dispensa", emptyPantry: "Ancora nulla in elenco — aggiungi un ingrediente qui sotto.", quickAdd: "Aggiunta rapida", orAddOwn: "O aggiungi il tuo", ingredientPlaceholder: "Ingrediente, es. zucchina", qtyPlaceholder: "Qtà", howYouEat: "Come mangi", findRecipes: "Trova ricette", workingItOut: "Sto preparando…", loadMore: "Carica altre ricette", kcal: "kcal", protein: "proteine", carbs: "carboidrati", fat: "grassi", ledgerWaitingTitle: "Il quaderno sta aspettando.", ledgerWaitingSubtitle: 'Aggiungi quello che hai in cucina e premi "Trova ricette."', noFavoritesTitle: "Ancora nessun preferito.", noFavoritesSubtitle: "Tocca il cuore di una ricetta per salvarla qui.", addAtLeastOne: "Aggiungi prima almeno un ingrediente alla tua dispensa.", couldntGenerate: "Impossibile generare ricette al momento. Riprova tra poco.", noRecipesBack: "Nessuna ricetta trovata — modifica la tua dispensa e riprova.", min: "min", servings: "porzioni", alsoNeeds: "Serve anche:", categoryLabels: { vegetables: "Verdure", fruits: "Frutta", proteins: "Proteine", dairy: "Latticini e Uova", grains: "Cereali e Dispensa", spices: "Spezie" }, dietLabels: { carnivorous: "Carnivoro", vegetarian: "Vegetariano", vegan: "Vegano" } },
};

function translateItem(name, lang) {
  return ITEM_TRANSLATIONS[name]?.[lang] || name;
}

function parseRecipesSafely(text) {
  // Try a clean parse first.
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // fall through to recovery below
  }
  // Response was likely cut off mid-object. Recover whichever top-level
  // {...} objects in the array are complete and valid, and drop the rest.
  const recovered = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        const chunk = text.slice(start, i + 1);
        try {
          recovered.push(JSON.parse(chunk));
        } catch (e) {
          // skip malformed chunk
        }
        start = -1;
      }
    }
  }
  return recovered;
}

function Punch() {
  return (
    <div className="flex gap-2 justify-center -mt-1 mb-3">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#1F2E22", opacity: 0.15 }} />
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#1F2E22", opacity: 0.15 }} />
    </div>
  );
}

function RecipeCard({ recipe: r, dietColor, delay, favorited, onToggleFavorite, t }) {
  return (
    <div className="card-in rounded-sm p-5" style={{ background: "#F6EFE3", boxShadow: "0 10px 24px -10px rgba(0,0,0,0.45)", animationDelay: `${delay}ms` }}>
      <Punch />
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="fraunces text-lg font-semibold leading-snug" style={{ color: "#2B2118" }}>{r.title}</h3>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: dietColor }} />
          <button onClick={() => onToggleFavorite(r)} aria-label={favorited ? `Remove ${r.title} from favorites` : `Save ${r.title} to favorites`} className="transition-transform active:scale-90" style={{ color: favorited ? "#C1543C" : "#B8AC98" }}>
            <Heart size={16} fill={favorited ? "#C1543C" : "none"} strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <p className="text-sm mb-3" style={{ color: "#5A5044" }}>{r.description}</p>
      <div className="flex items-center gap-4 mb-3 mono text-xs" style={{ color: "#8A7F6E" }}>
        {r.time_minutes != null && (<span className="flex items-center gap-1"><Clock size={13} /> {r.time_minutes} {t.min}</span>)}
        {r.servings != null && (<span className="flex items-center gap-1"><Users2 size={13} /> {r.servings} {t.servings}</span>)}
      </div>
      {r.macros && (
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[
            { key: "calories", label: t.kcal, value: r.macros.calories },
            { key: "protein_g", label: t.protein, value: r.macros.protein_g },
            { key: "carbs_g", label: t.carbs, value: r.macros.carbs_g },
            { key: "fat_g", label: t.fat, value: r.macros.fat_g },
          ].map((m) =>
            m.value != null ? (
              <div key={m.key} className="rounded-sm py-1.5 text-center" style={{ background: "rgba(31,46,34,0.05)" }}>
                <div className="mono text-sm font-medium" style={{ color: "#2B2118" }}>
                  {m.value}{m.key !== "calories" ? "g" : ""}
                </div>
                <div className="text-[10px] uppercase tracking-wide" style={{ color: "#8A7F6E" }}>{m.label}</div>
              </div>
            ) : null
          )}
        </div>
      )}
      {r.used_ingredients?.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {r.used_ingredients.map((u, ui) => (
            <span key={ui} className="mono text-[11px] px-2 py-0.5 rounded-sm" style={{ background: "rgba(138,155,110,0.18)", color: "#4E5E3E" }}>{u}</span>
          ))}
        </div>
      )}
      {r.extra_ingredients?.length > 0 && (
        <p className="text-xs mb-3" style={{ color: "#8A7F6E" }}><span className="font-medium">{t.alsoNeeds}</span> {r.extra_ingredients.join(", ")}</p>
      )}
      {r.steps?.length > 0 && (
        <ol className="text-sm flex flex-col gap-1.5 mt-2 pt-3" style={{ borderTop: "1px solid rgba(43,33,24,0.1)", color: "#2B2118" }}>
          {r.steps.map((s, si) => (
            <li key={si} className="flex gap-2"><span className="mono shrink-0" style={{ color: "#C1543C" }}>{si + 1}.</span><span>{s}</span></li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function PantryDashboard() {
  const [lang, setLang] = useState("en");
  const [pantry, setPantry] = useState([
    { name: "Eggs", qty: "6", unit: "piece" },
    { name: "Spinach", qty: "150", unit: "g" },
  ]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("piece");
  const [diet, setDiet] = useState("vegetarian");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [quickCategory, setQuickCategory] = useState("vegetables");
  const [justAdded, setJustAdded] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const nameInputRef = useRef(null);

  const t = TRANSLATIONS[lang];

  const isFavorite = (recipe) => favorites.some((f) => f.title === recipe.title);
  const toggleFavorite = (recipe) => setFavorites((prev) => (isFavorite(recipe) ? prev.filter((f) => f.title !== recipe.title) : [...prev, recipe]));
  const isInPantry = (itemName) => pantry.some((p) => p.name.toLowerCase() === itemName.toLowerCase());

  const quickAdd = (itemName, defaultUnit) => {
    if (isInPantry(itemName)) return;
    setPantry([...pantry, { name: itemName, qty: "1", unit: defaultUnit }]);
    setJustAdded(itemName);
    window.clearTimeout(quickAdd._t);
    quickAdd._t = window.setTimeout(() => setJustAdded(""), 900);
  };

  const addIngredient = () => {
    if (!name.trim()) return;
    setPantry([...pantry, { name: name.trim(), qty: qty.trim() || "1", unit }]);
    setName("");
    setQty("");
    nameInputRef.current?.focus();
  };

  const removeIngredient = (idx) => setPantry(pantry.filter((_, i) => i !== idx));

  const updateQty = (idx, delta) => {
    setPantry(pantry.map((item, i) => {
      if (i !== idx) return item;
      const current = parseFloat(item.qty);
      const base = isNaN(current) ? 0 : current;
      return { ...item, qty: String(Math.max(0, base + delta)) };
    }));
  };

  const setQtyValue = (idx, value) => setPantry(pantry.map((item, i) => (i === idx ? { ...item, qty: value } : item)));
  const setUnitValue = (idx, value) => setPantry(pantry.map((item, i) => (i === idx ? { ...item, unit: value } : item)));
  const handleKeyDown = (e) => { if (e.key === "Enter") addIngredient(); };

  const generateRecipes = async (append = false) => {
    if (pantry.length === 0) {
      setError(t.addAtLeastOne);
      return;
    }
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setRecipes([]);
    }
    setError("");
    setHasSearched(true);
    try {
      const ingredientList = pantry.map((p) => `${p.qty} ${UNIT_LABELS[p.unit]?.en || p.unit} ${p.name}`).join(", ");
      const dietLabelEn = { carnivorous: "Carnivorous", vegetarian: "Vegetarian", vegan: "Vegan" }[diet];
      const languageName = LANGUAGE_NAMES[lang];
      const avoidTitles = append ? recipes.map((r) => r.title) : [];

      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientList, dietLabelEn, languageName, avoidTitles }),
      });

      if (!response.ok) throw new Error("Request failed");
      const parsed = await response.json();
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("No parseable recipes");
      setRecipes((prev) => (append ? [...prev, ...parsed] : parsed));
    } catch (err) {
      console.error(err);
      setError(t.couldntGenerate);
      if (!append) setRecipes([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const activeDiet = DIETS.find((d) => d.key === diet);

  return (
    <div className="min-h-screen w-full" style={{ background: "#1F2E22", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .fraunces { font-family: 'Fraunces', serif; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .card-in { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div style={{ background: "#182219", borderBottom: "1px solid rgba(246,239,227,0.1)" }}>
        <div className="max-w-6xl mx-auto px-5 py-2.5 flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-1.5 mono text-[11px] uppercase tracking-wide" style={{ color: "#8A9B6E" }}>
            <Globe size={13} /> {t.chooseLanguage}
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {LANGUAGES.map((l) => {
              const active = lang === l.code;
              return (
                <button key={l.code} onClick={() => setLang(l.code)} className="px-2.5 py-1 rounded-full text-xs transition-colors" style={{ background: active ? "#D4A017" : "transparent", color: active ? "#1F2E22" : "#A9B6A1", border: active ? "1px solid #D4A017" : "1px solid rgba(169,182,161,0.3)" }}>
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
        <header className="mb-10 md:mb-14 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2" style={{ color: "#D4A017" }}>
              <ChefHat size={20} strokeWidth={1.75} />
              <span className="mono text-xs tracking-[0.2em] uppercase">{t.brand}</span>
            </div>
            <h1 className="fraunces text-4xl md:text-5xl font-semibold leading-tight" style={{ color: "#F6EFE3" }}>{t.heroLine1}<br />{t.heroLine2}</h1>
            <p className="mt-3 max-w-xl" style={{ color: "#A9B6A1" }}>{t.subtitle}</p>
          </div>
          <button onClick={() => setShowFavorites((v) => !v)} className="flex items-center gap-2 px-3.5 py-2 rounded-sm text-sm mt-1 transition-colors" style={{ background: showFavorites ? "#D4A017" : "rgba(246,239,227,0.08)", color: showFavorites ? "#1F2E22" : "#F6EFE3", border: "1px solid rgba(246,239,227,0.2)" }}>
            <Star size={15} fill={showFavorites ? "#1F2E22" : "none"} />
            {t.favorites} {favorites.length > 0 && `(${favorites.length})`}
          </button>
        </header>

        <div className="grid md:grid-cols-[380px_1fr] gap-6 md:gap-8">
          <div>
            <div className="rounded-sm p-5 md:p-6 sticky top-6" style={{ background: "#F6EFE3", boxShadow: "0 12px 30px -12px rgba(0,0,0,0.5)" }}>
              <h2 className="fraunces text-lg font-semibold mb-4" style={{ color: "#2B2118" }}>{t.yourPantry}</h2>

              <ul className="mb-4 flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {pantry.length === 0 && (<li className="text-sm italic" style={{ color: "#8A7F6E" }}>{t.emptyPantry}</li>)}
                {pantry.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-sm" style={{ background: "rgba(31,46,34,0.05)" }}>
                    <span className="text-sm truncate" style={{ color: "#2B2118" }}>{translateItem(item.name, lang)}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => updateQty(idx, -1)} aria-label={`Decrease ${item.name} quantity`} className="w-5 h-5 rounded-sm flex items-center justify-center text-xs mono" style={{ background: "rgba(43,33,24,0.1)", color: "#2B2118" }}>−</button>
                      <input value={item.qty} onChange={(e) => setQtyValue(idx, e.target.value)} className="w-10 text-center text-xs mono rounded-sm py-0.5 outline-none" style={{ background: "#FFFFFF", border: "1px solid rgba(43,33,24,0.15)", color: "#2B2118" }} />
                      <button onClick={() => updateQty(idx, 1)} aria-label={`Increase ${item.name} quantity`} className="w-5 h-5 rounded-sm flex items-center justify-center text-xs mono" style={{ background: "rgba(43,33,24,0.1)", color: "#2B2118" }}>+</button>
                      <select value={item.unit} onChange={(e) => setUnitValue(idx, e.target.value)} className="text-xs mono rounded-sm py-0.5 outline-none" style={{ background: "#FFFFFF", border: "1px solid rgba(43,33,24,0.15)", color: "#2B2118" }}>
                        {UNITS.map((u) => (<option key={u} value={u}>{UNIT_LABELS[u][lang]}</option>))}
                      </select>
                      <button onClick={() => removeIngredient(idx)} aria-label={`Remove ${item.name}`} className="opacity-50 hover:opacity-100 transition-opacity ml-0.5" style={{ color: "#B5482A" }}><X size={15} /></button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mb-4 pt-4" style={{ borderTop: "1px solid rgba(43,33,24,0.12)" }}>
                <div className="text-xs mono uppercase tracking-wide mb-2" style={{ color: "#8A7F6E" }}>{t.quickAdd}</div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const active = quickCategory === cat.key;
                    return (
                      <button key={cat.key} onClick={() => setQuickCategory(cat.key)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs transition-colors" style={{ background: active ? "#1F2E22" : "rgba(31,46,34,0.06)", color: active ? "#F6EFE3" : "#5A5044" }}>
                        <Icon size={13} strokeWidth={1.75} />
                        {t.categoryLabels[cat.key]}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.find((c) => c.key === quickCategory)?.items.map((item) => {
                    const added = isInPantry(item);
                    return (
                      <button key={item} onClick={() => quickAdd(item, CATEGORIES.find((c) => c.key === quickCategory).defaultUnit)} disabled={added} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs transition-all disabled:cursor-default" style={{ background: added ? "rgba(138,155,110,0.25)" : "#FFFFFF", border: added ? "1px solid rgba(138,155,110,0.5)" : "1px solid rgba(43,33,24,0.15)", color: added ? "#4E5E3E" : "#2B2118", transform: justAdded === item ? "scale(1.05)" : "scale(1)" }}>
                        {added ? "✓" : "+"} {translateItem(item, lang)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-5 pt-4" style={{ borderTop: "1px solid rgba(43,33,24,0.12)" }}>
                <div className="text-xs mono uppercase tracking-wide mb-0.5" style={{ color: "#8A7F6E" }}>{t.orAddOwn}</div>
                <input ref={nameInputRef} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.ingredientPlaceholder} className="w-full px-3 py-2 rounded-sm text-sm outline-none" style={{ background: "#FFFFFF", border: "1px solid rgba(43,33,24,0.15)", color: "#2B2118" }} />
                <div className="flex gap-2">
                  <input value={qty} onChange={(e) => setQty(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.qtyPlaceholder} className="w-20 px-3 py-2 rounded-sm text-sm outline-none mono" style={{ background: "#FFFFFF", border: "1px solid rgba(43,33,24,0.15)", color: "#2B2118" }} />
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className="flex-1 px-2 py-2 rounded-sm text-sm outline-none mono" style={{ background: "#FFFFFF", border: "1px solid rgba(43,33,24,0.15)", color: "#2B2118" }}>
                    {UNITS.map((u) => (<option key={u} value={u}>{UNIT_LABELS[u][lang]}</option>))}
                  </select>
                  <button onClick={addIngredient} aria-label="Add ingredient" className="px-3 rounded-sm flex items-center justify-center transition-transform active:scale-95" style={{ background: "#1F2E22", color: "#F6EFE3" }}><Plus size={16} /></button>
                </div>
              </div>

              <div className="mb-5">
                <div className="text-xs mono uppercase tracking-wide mb-2" style={{ color: "#8A7F6E" }}>{t.howYouEat}</div>
                <div className="flex rounded-sm overflow-hidden" style={{ border: "1px solid rgba(43,33,24,0.15)" }} role="radiogroup" aria-label="Dietary preference">
                  {DIETS.map((d) => {
                    const Icon = d.icon;
                    const active = diet === d.key;
                    return (
                      <button key={d.key} role="radio" aria-checked={active} onClick={() => setDiet(d.key)} className="flex-1 flex flex-col items-center gap-1 py-2.5 text-xs transition-colors focus-visible:outline focus-visible:outline-2" style={{ background: active ? d.color : "transparent", color: active ? "#F6EFE3" : "#5A5044" }}>
                        <Icon size={16} strokeWidth={1.75} />
                        {t.dietLabels[d.key]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button onClick={() => generateRecipes(false)} disabled={loading} className="w-full py-2.5 rounded-sm text-sm font-medium flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70" style={{ background: "#C1543C", color: "#F6EFE3" }}>
                {loading ? (<><Loader2 size={16} className="animate-spin" /> {t.workingItOut}</>) : t.findRecipes}
              </button>
            </div>

            {favorites.length > 0 && (
              <div className="rounded-sm p-5 mt-6" style={{ background: "#F6EFE3", boxShadow: "0 12px 30px -12px rgba(0,0,0,0.5)" }}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Star size={15} fill="#D4A017" color="#D4A017" />
                  <h2 className="fraunces text-base font-semibold" style={{ color: "#2B2118" }}>{t.favorites}</h2>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {favorites.map((r, i) => (
                    <li key={r.title + i} className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-sm" style={{ background: "rgba(31,46,34,0.05)" }}>
                      <span className="text-sm truncate" style={{ color: "#2B2118" }}>{r.title}</span>
                      <button
                        onClick={() => toggleFavorite(r)}
                        aria-label={`Remove ${r.title} from favorites`}
                        className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
                        style={{ color: "#C1543C" }}
                      >
                        <Heart size={14} fill="#C1543C" strokeWidth={1.75} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            {showFavorites ? (
              favorites.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {favorites.map((r, i) => (<RecipeCard key={r.title + i} recipe={r} dietColor={activeDiet?.color} delay={i * 80} favorited={true} onToggleFavorite={toggleFavorite} t={t} />))}
                </div>
              ) : (
                <div className="rounded-sm p-10 text-center" style={{ background: "rgba(246,239,227,0.06)", border: "1px dashed rgba(246,239,227,0.2)" }}>
                  <p className="fraunces text-xl mb-1" style={{ color: "#F6EFE3" }}>{t.noFavoritesTitle}</p>
                  <p className="text-sm" style={{ color: "#A9B6A1" }}>{t.noFavoritesSubtitle}</p>
                </div>
              )
            ) : (
              <>
                {error && (<div className="mb-5 px-4 py-3 rounded-sm text-sm flex items-center gap-2" style={{ background: "rgba(193,84,60,0.15)", color: "#E8B8AC" }}><AlertCircle size={16} /> {error}</div>)}
                {!hasSearched && !loading && (
                  <div className="rounded-sm p-10 text-center" style={{ background: "rgba(246,239,227,0.06)", border: "1px dashed rgba(246,239,227,0.2)" }}>
                    <p className="fraunces text-xl mb-1" style={{ color: "#F6EFE3" }}>{t.ledgerWaitingTitle}</p>
                    <p className="text-sm" style={{ color: "#A9B6A1" }}>{t.ledgerWaitingSubtitle}</p>
                  </div>
                )}
                {loading && (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[0, 1, 2, 3].map((i) => (<div key={i} className="rounded-sm h-64 animate-pulse" style={{ background: "rgba(246,239,227,0.08)" }} />))}
                  </div>
                )}
                {!loading && recipes.length > 0 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {recipes.map((r, i) => (<RecipeCard key={r.title + i} recipe={r} dietColor={activeDiet?.color} delay={(i % 3) * 80} favorited={isFavorite(r)} onToggleFavorite={toggleFavorite} t={t} />))}
                    </div>
                    <div className="flex justify-center mt-5">
                      <button
                        onClick={() => generateRecipes(true)}
                        disabled={loadingMore}
                        className="px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70"
                        style={{ background: "rgba(246,239,227,0.1)", color: "#F6EFE3", border: "1px solid rgba(246,239,227,0.25)" }}
                      >
                        {loadingMore ? (<><Loader2 size={15} className="animate-spin" /> {t.workingItOut}</>) : t.loadMore}
                      </button>
                    </div>
                  </>
                )}
                {!loading && hasSearched && !error && recipes.length === 0 && (
                  <div className="rounded-sm p-10 text-center" style={{ background: "rgba(246,239,227,0.06)", border: "1px dashed rgba(246,239,227,0.2)" }}>
                    <p style={{ color: "#A9B6A1" }}>{t.noRecipesBack}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
