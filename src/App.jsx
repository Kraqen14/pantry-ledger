import React, { useState, useRef } from "react";
import { Plus, X, ChefHat, Loader2, Beef, Leaf, Sprout, AlertCircle, Clock, Users2, Carrot, Apple, Drumstick, Milk, Wheat, Heart, Star, Flame, Home, ShoppingBasket, UtensilsCrossed, Settings, ArrowRight } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
];

const LANGUAGE_NAMES = { en: "English", pt: "Portuguese", es: "Spanish", fr: "French", it: "Italian" };

const DIETS = [
  { key: "carnivorous", icon: Beef, color: "#B04A2F" },
  { key: "vegetarian", icon: Leaf, color: "#C99B2E" },
  { key: "vegan", icon: Sprout, color: "#5F6F45" },
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
  en: { brand: "Pantry Ledger", navHome: "Home", navPantry: "Pantry", navRecipes: "Recipes", navFavorites: "Favorites", navSettings: "Settings", homeGreeting: "What's cooking today?", homeTagline: "Your kitchen companion — tell it what you have, it tells you what's for dinner.", statIngredients: "ingredients in your pantry", statFavorites: "saved favorites", homeGoPantry: "Stock the pantry", homeGoRecipes: "Find something to cook", favorites: "Favorites", yourPantry: "Your pantry", emptyPantry: "Nothing listed yet — add an ingredient below.", quickAdd: "Quick add", orAddOwn: "Or add your own", ingredientPlaceholder: "Ingredient, e.g. courgette", qtyPlaceholder: "Qty", howYouEat: "How you eat", findRecipes: "Find recipes", workingItOut: "Working it out…", loadMore: "Load more recipes", kcal: "kcal", protein: "protein", carbs: "carbs", fat: "fat", recipesEmptyTitle: "The stove is waiting.", recipesEmptySubtitle: "Stock your pantry, then come back and press \"Find recipes.\"", noFavoritesTitle: "No favorites yet.", noFavoritesSubtitle: "Tap the heart on any recipe to save it here.", addAtLeastOne: "Add at least one ingredient to your pantry first.", couldntGenerate: "Couldn't generate recipes just now. Try again in a moment.", noRecipesBack: "No recipes came back — try adjusting your pantry and try again.", min: "min", servings: "servings", alsoNeeds: "Also needs:", chooseLanguage: "Language", settingsIntro: "Set the table your way.", categoryLabels: { vegetables: "Vegetables", fruits: "Fruits", proteins: "Proteins", dairy: "Dairy & Eggs", grains: "Grains & Pantry", spices: "Spices" }, dietLabels: { carnivorous: "Carnivorous", vegetarian: "Vegetarian", vegan: "Vegan" } },
  pt: { brand: "Livro da Despensa", navHome: "Início", navPantry: "Despensa", navRecipes: "Receitas", navFavorites: "Favoritos", navSettings: "Ajustes", homeGreeting: "O que vamos cozinhar hoje?", homeTagline: "O seu companheiro de cozinha — diga o que tem, e ele diz o que vai para a mesa.", statIngredients: "ingredientes na sua despensa", statFavorites: "favoritos guardados", homeGoPantry: "Encher a despensa", homeGoRecipes: "Encontrar algo para cozinhar", favorites: "Favoritos", yourPantry: "Sua despensa", emptyPantry: "Nada listado ainda — adicione um ingrediente abaixo.", quickAdd: "Adicionar rápido", orAddOwn: "Ou adicione o seu", ingredientPlaceholder: "Ingrediente, ex. courgette", qtyPlaceholder: "Qtd", howYouEat: "Como você come", findRecipes: "Encontrar receitas", workingItOut: "Preparando…", loadMore: "Carregar mais receitas", kcal: "kcal", protein: "proteína", carbs: "carboidratos", fat: "gordura", recipesEmptyTitle: "O fogão está à espera.", recipesEmptySubtitle: "Encha a despensa e depois volte e toque em \"Encontrar receitas.\"", noFavoritesTitle: "Ainda sem favoritos.", noFavoritesSubtitle: "Toque no coração de qualquer receita para guardá-la aqui.", addAtLeastOne: "Adicione pelo menos um ingrediente à sua despensa primeiro.", couldntGenerate: "Não foi possível gerar receitas agora. Tente novamente em instantes.", noRecipesBack: "Nenhuma receita foi encontrada — ajuste sua despensa e tente novamente.", min: "min", servings: "porções", alsoNeeds: "Também precisa de:", chooseLanguage: "Idioma", settingsIntro: "Ponha a mesa à sua maneira.", categoryLabels: { vegetables: "Vegetais", fruits: "Frutas", proteins: "Proteínas", dairy: "Laticínios e Ovos", grains: "Cereais e Despensa", spices: "Especiarias" }, dietLabels: { carnivorous: "Carnívoro", vegetarian: "Vegetariano", vegan: "Vegano" } },
  es: { brand: "Libro de la Despensa", navHome: "Inicio", navPantry: "Despensa", navRecipes: "Recetas", navFavorites: "Favoritos", navSettings: "Ajustes", homeGreeting: "¿Qué cocinamos hoy?", homeTagline: "Tu compañero de cocina — dile lo que tienes, y te dice qué hay para cenar.", statIngredients: "ingredientes en tu despensa", statFavorites: "favoritos guardados", homeGoPantry: "Llenar la despensa", homeGoRecipes: "Buscar algo para cocinar", favorites: "Favoritos", yourPantry: "Tu despensa", emptyPantry: "Nada listado todavía — añade un ingrediente abajo.", quickAdd: "Añadir rápido", orAddOwn: "O añade el tuyo", ingredientPlaceholder: "Ingrediente, ej. calabacín", qtyPlaceholder: "Cant", howYouEat: "Cómo comes", findRecipes: "Buscar recetas", workingItOut: "Preparando…", loadMore: "Cargar más recetas", kcal: "kcal", protein: "proteína", carbs: "carbohidratos", fat: "grasa", recipesEmptyTitle: "Los fogones esperan.", recipesEmptySubtitle: "Llena tu despensa, vuelve y pulsa \"Buscar recetas.\"", noFavoritesTitle: "Aún no hay favoritos.", noFavoritesSubtitle: "Toca el corazón de cualquier receta para guardarla aquí.", addAtLeastOne: "Añade al menos un ingrediente a tu despensa primero.", couldntGenerate: "No se pudieron generar recetas ahora. Inténtalo de nuevo en un momento.", noRecipesBack: "No se encontraron recetas — ajusta tu despensa e inténtalo de nuevo.", min: "min", servings: "porciones", alsoNeeds: "También necesita:", chooseLanguage: "Idioma", settingsIntro: "Pon la mesa a tu manera.", categoryLabels: { vegetables: "Verduras", fruits: "Frutas", proteins: "Proteínas", dairy: "Lácteos y Huevos", grains: "Cereales y Despensa", spices: "Especias" }, dietLabels: { carnivorous: "Carnívoro", vegetarian: "Vegetariano", vegan: "Vegano" } },
  fr: { brand: "Carnet du Garde-Manger", navHome: "Accueil", navPantry: "Garde-manger", navRecipes: "Recettes", navFavorites: "Favoris", navSettings: "Réglages", homeGreeting: "Qu'est-ce qu'on cuisine aujourd'hui ?", homeTagline: "Votre compagnon de cuisine — dites-lui ce que vous avez, il vous dit ce qu'il y a pour dîner.", statIngredients: "ingrédients dans votre garde-manger", statFavorites: "favoris enregistrés", homeGoPantry: "Remplir le garde-manger", homeGoRecipes: "Trouver quoi cuisiner", favorites: "Favoris", yourPantry: "Votre garde-manger", emptyPantry: "Rien n'est encore listé — ajoutez un ingrédient ci-dessous.", quickAdd: "Ajout rapide", orAddOwn: "Ou ajoutez le vôtre", ingredientPlaceholder: "Ingrédient, ex. courgette", qtyPlaceholder: "Qté", howYouEat: "Votre régime", findRecipes: "Trouver des recettes", workingItOut: "Ça mijote…", loadMore: "Charger plus de recettes", kcal: "kcal", protein: "protéines", carbs: "glucides", fat: "lipides", recipesEmptyTitle: "Les fourneaux attendent.", recipesEmptySubtitle: "Remplissez votre garde-manger, revenez et appuyez sur \"Trouver des recettes.\"", noFavoritesTitle: "Pas encore de favoris.", noFavoritesSubtitle: "Appuyez sur le cœur d'une recette pour l'enregistrer ici.", addAtLeastOne: "Ajoutez d'abord au moins un ingrédient à votre garde-manger.", couldntGenerate: "Impossible de générer des recettes pour le moment. Réessayez dans un instant.", noRecipesBack: "Aucune recette trouvée — ajustez votre garde-manger et réessayez.", min: "min", servings: "portions", alsoNeeds: "Il faut aussi :", chooseLanguage: "Langue", settingsIntro: "Mettez la table à votre façon.", categoryLabels: { vegetables: "Légumes", fruits: "Fruits", proteins: "Protéines", dairy: "Laitages et Œufs", grains: "Céréales et Épicerie", spices: "Épices" }, dietLabels: { carnivorous: "Carnivore", vegetarian: "Végétarien", vegan: "Végane" } },
  it: { brand: "Quaderno della Dispensa", navHome: "Home", navPantry: "Dispensa", navRecipes: "Ricette", navFavorites: "Preferiti", navSettings: "Impostazioni", homeGreeting: "Cosa cuciniamo oggi?", homeTagline: "Il tuo compagno di cucina — digli cosa hai, e ti dice cosa c'è per cena.", statIngredients: "ingredienti nella tua dispensa", statFavorites: "preferiti salvati", homeGoPantry: "Riempire la dispensa", homeGoRecipes: "Trovare qualcosa da cucinare", favorites: "Preferiti", yourPantry: "La tua dispensa", emptyPantry: "Ancora nulla in elenco — aggiungi un ingrediente qui sotto.", quickAdd: "Aggiunta rapida", orAddOwn: "O aggiungi il tuo", ingredientPlaceholder: "Ingrediente, es. zucchina", qtyPlaceholder: "Qtà", howYouEat: "Come mangi", findRecipes: "Trova ricette", workingItOut: "Sto preparando…", loadMore: "Carica altre ricette", kcal: "kcal", protein: "proteine", carbs: "carboidrati", fat: "grassi", recipesEmptyTitle: "I fornelli aspettano.", recipesEmptySubtitle: "Riempi la dispensa, torna e premi \"Trova ricette.\"", noFavoritesTitle: "Ancora nessun preferito.", noFavoritesSubtitle: "Tocca il cuore di una ricetta per salvarla qui.", addAtLeastOne: "Aggiungi prima almeno un ingrediente alla tua dispensa.", couldntGenerate: "Impossibile generare ricette al momento. Riprova tra poco.", noRecipesBack: "Nessuna ricetta trovata — modifica la tua dispensa e riprova.", min: "min", servings: "porzioni", alsoNeeds: "Serve anche:", chooseLanguage: "Lingua", settingsIntro: "Apparecchia a modo tuo.", categoryLabels: { vegetables: "Verdure", fruits: "Frutta", proteins: "Proteine", dairy: "Latticini e Uova", grains: "Cereali e Dispensa", spices: "Spezie" }, dietLabels: { carnivorous: "Carnivoro", vegetarian: "Vegetariano", vegan: "Vegano" } },
};

function translateItem(name, lang) {
  return ITEM_TRANSLATIONS[name]?.[lang] || name;
}

function parseRecipesSafely(text) {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // fall through to recovery below
  }
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

// Gingham "tablecloth" strip — the app's signature element.
function Gingham({ height = 12 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height,
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(176,74,47,0.55) 0 10px, rgba(176,74,47,0.18) 10px 20px), repeating-linear-gradient(0deg, rgba(176,74,47,0.55) 0 10px, rgba(176,74,47,0.18) 10px 20px)",
        backgroundBlendMode: "multiply",
        backgroundColor: "#FBF6E9",
      }}
    />
  );
}

function RecipeCard({ recipe: r, dietColor, delay, favorited, onToggleFavorite, t }) {
  return (
    <div className="card-in rounded-2xl overflow-hidden" style={{ background: "#FFFDF6", border: "1px solid #EAE0C9", boxShadow: "0 8px 20px -12px rgba(59,48,36,0.35)", animationDelay: `${delay}ms` }}>
      <div style={{ height: 5, background: dietColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="serif text-xl font-semibold leading-snug" style={{ color: "#3B3024" }}>{r.title}</h3>
          <button onClick={() => onToggleFavorite(r)} aria-label={favorited ? `Remove ${r.title} from favorites` : `Save ${r.title} to favorites`} className="transition-transform active:scale-90 shrink-0 mt-0.5" style={{ color: favorited ? "#B04A2F" : "#CBBFA8" }}>
            <Heart size={18} fill={favorited ? "#B04A2F" : "none"} strokeWidth={1.75} />
          </button>
        </div>
        <p className="text-sm mb-3" style={{ color: "#7C6F5C" }}>{r.description}</p>
        <div className="flex items-center gap-4 mb-3 text-xs font-semibold" style={{ color: "#A08F76" }}>
          {r.time_minutes != null && (<span className="flex items-center gap-1"><Clock size={13} /> {r.time_minutes} {t.min}</span>)}
          {r.servings != null && (<span className="flex items-center gap-1"><Users2 size={13} /> {r.servings} {t.servings}</span>)}
        </div>
        {r.macros && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
            {[
              { key: "calories", label: t.kcal, value: r.macros.calories },
              { key: "protein_g", label: t.protein, value: r.macros.protein_g },
              { key: "carbs_g", label: t.carbs, value: r.macros.carbs_g },
              { key: "fat_g", label: t.fat, value: r.macros.fat_g },
            ].map((m) =>
              m.value != null ? (
                <div key={m.key} className="rounded-xl py-1.5 text-center" style={{ background: "#F5EDDA" }}>
                  <div className="text-sm font-bold" style={{ color: "#3B3024" }}>
                    {m.value}{m.key !== "calories" ? "g" : ""}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: "#A08F76" }}>{m.label}</div>
                </div>
              ) : null
            )}
          </div>
        )}
        {r.used_ingredients?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {r.used_ingredients.map((u, ui) => (
              <span key={ui} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(95,111,69,0.14)", color: "#5F6F45" }}>{u}</span>
            ))}
          </div>
        )}
        {r.extra_ingredients?.length > 0 && (
          <p className="text-xs mb-3" style={{ color: "#A08F76" }}><span className="font-semibold">{t.alsoNeeds}</span> {r.extra_ingredients.join(", ")}</p>
        )}
        {r.steps?.length > 0 && (
          <ol className="text-sm flex flex-col gap-1.5 mt-2 pt-3" style={{ borderTop: "1px dashed #E0D4BB", color: "#3B3024" }}>
            {r.steps.map((s, si) => (
              <li key={si} className="flex gap-2"><span className="hand text-base shrink-0 font-bold" style={{ color: "#B04A2F" }}>{si + 1}.</span><span>{s}</span></li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default function PantryDashboard() {
  const [page, setPage] = useState("home");
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

      // On the website, a relative path works. Inside the native (Capacitor)
      // app there is no server behind the page, so requests must go to the
      // deployed backend's absolute URL.
      const isNativeApp = window.Capacitor?.isNativePlatform?.() === true;
      const API_BASE = isNativeApp ? "https://pantry-ledger-ochre.vercel.app" : "";
      const response = await fetch(`${API_BASE}/api/recipes`, {
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
  const activeCategory = CATEGORIES.find((c) => c.key === quickCategory);

  const NAV = [
    { key: "home", icon: Home, label: t.navHome },
    { key: "pantry", icon: ShoppingBasket, label: t.navPantry },
    { key: "recipes", icon: UtensilsCrossed, label: t.navRecipes },
    { key: "favorites", icon: Heart, label: t.navFavorites },
    { key: "settings", icon: Settings, label: t.navSettings },
  ];

  const sectionLabel = { color: "#A08F76" };
  const card = { background: "#FFFDF6", border: "1px solid #EAE0C9", boxShadow: "0 8px 20px -12px rgba(59,48,36,0.3)" };

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "#FBF6E9", fontFamily: "'Nunito', sans-serif", color: "#3B3024" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Caveat:wght@600;700&family=Nunito:wght@400;600;700;800&display=swap');
        .serif { font-family: 'Fraunces', serif; }
        .hand { font-family: 'Caveat', cursive; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .card-in { animation: fadeUp 0.4s ease both; }
        @media (prefers-reduced-motion: reduce) { .card-in { animation: none; } }
      `}</style>

      {/* Signature gingham strip + brand bar */}
      <Gingham />
      <header className="px-5 pt-4 pb-2 max-w-3xl mx-auto flex items-center gap-2" style={{ color: "#B04A2F" }}>
        <ChefHat size={20} strokeWidth={2} />
        <span className="hand text-2xl font-bold" style={{ color: "#3B3024" }}>{t.brand}</span>
      </header>

      {/* Page content */}
      <main className="max-w-3xl mx-auto px-5 pb-28 pt-2">

        {page === "home" && (
          <div className="card-in">
            <h1 className="serif text-4xl sm:text-5xl font-semibold leading-tight mt-6 mb-3" style={{ color: "#3B3024" }}>{t.homeGreeting}</h1>
            <p className="text-base mb-8 max-w-md" style={{ color: "#7C6F5C" }}>{t.homeTagline}</p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="rounded-2xl p-5" style={card}>
                <div className="hand text-5xl font-bold leading-none mb-1" style={{ color: "#5F6F45" }}>{pantry.length}</div>
                <div className="text-xs font-semibold" style={sectionLabel}>{t.statIngredients}</div>
              </div>
              <div className="rounded-2xl p-5" style={card}>
                <div className="hand text-5xl font-bold leading-none mb-1" style={{ color: "#B04A2F" }}>{favorites.length}</div>
                <div className="text-xs font-semibold" style={sectionLabel}>{t.statFavorites}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => setPage("pantry")} className="flex items-center justify-between px-5 py-4 rounded-2xl text-left transition-transform active:scale-[0.98]" style={{ background: "#5F6F45", color: "#FBF6E9" }}>
                <span className="flex items-center gap-3 font-bold"><ShoppingBasket size={19} /> {t.homeGoPantry}</span>
                <ArrowRight size={18} />
              </button>
              <button onClick={() => setPage("recipes")} className="flex items-center justify-between px-5 py-4 rounded-2xl text-left transition-transform active:scale-[0.98]" style={{ background: "#B04A2F", color: "#FBF6E9" }}>
                <span className="flex items-center gap-3 font-bold"><UtensilsCrossed size={19} /> {t.homeGoRecipes}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {page === "pantry" && (
          <div className="card-in">
            <h1 className="serif text-3xl font-semibold mt-4 mb-5">{t.yourPantry}</h1>

            <ul className="mb-6 flex flex-col gap-2">
              {pantry.length === 0 && (<li className="text-sm italic" style={{ color: "#A08F76" }}>{t.emptyPantry}</li>)}
              {pantry.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2 py-2 px-3 rounded-xl" style={card}>
                  <span className="text-sm truncate font-semibold">{translateItem(item.name, lang)}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => updateQty(idx, -1)} aria-label={`Decrease ${item.name} quantity`} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#F5EDDA", color: "#B04A2F" }}>−</button>
                    <input value={item.qty} onChange={(e) => setQtyValue(idx, e.target.value)} className="w-10 text-center text-xs rounded-lg py-0.5 outline-none" style={{ background: "#FFFDF6", border: "1px solid #EAE0C9" }} />
                    <button onClick={() => updateQty(idx, 1)} aria-label={`Increase ${item.name} quantity`} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#F5EDDA", color: "#B04A2F" }}>+</button>
                    <select value={item.unit} onChange={(e) => setUnitValue(idx, e.target.value)} className="text-xs rounded-lg py-0.5 outline-none" style={{ background: "#FFFDF6", border: "1px solid #EAE0C9" }}>
                      {UNITS.map((u) => (<option key={u} value={u}>{UNIT_LABELS[u][lang]}</option>))}
                    </select>
                    <button onClick={() => removeIngredient(idx)} aria-label={`Remove ${item.name}`} className="opacity-50 hover:opacity-100 transition-opacity ml-0.5" style={{ color: "#B04A2F" }}><X size={15} /></button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="hand text-xl font-bold mb-2" style={{ color: "#5F6F45" }}>{t.quickAdd}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = quickCategory === cat.key;
                return (
                  <button key={cat.key} onClick={() => setQuickCategory(cat.key)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors" style={{ background: active ? "#5F6F45" : "rgba(95,111,69,0.12)", color: active ? "#FBF6E9" : "#5F6F45" }}>
                    <Icon size={13} strokeWidth={2} />
                    {t.categoryLabels[cat.key]}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {activeCategory?.items.map((item) => {
                const added = isInPantry(item);
                return (
                  <button key={item} onClick={() => quickAdd(item, activeCategory.defaultUnit)} disabled={added} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all disabled:cursor-default" style={{
                    background: added ? "rgba(95,111,69,0.16)" : "#FFFDF6",
                    border: added ? "1px solid rgba(95,111,69,0.4)" : "1px solid #EAE0C9",
                    color: added ? "#5F6F45" : "#3B3024",
                    transform: justAdded === item ? "scale(1.06)" : "scale(1)",
                  }}>
                    {added ? "✓" : "+"} {translateItem(item, lang)}
                  </button>
                );
              })}
            </div>

            <div className="hand text-xl font-bold mb-2" style={{ color: "#5F6F45" }}>{t.orAddOwn}</div>
            <div className="flex flex-col gap-2">
              <input ref={nameInputRef} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.ingredientPlaceholder} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ background: "#FFFDF6", border: "1px solid #EAE0C9" }} />
              <div className="flex gap-2">
                <input value={qty} onChange={(e) => setQty(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.qtyPlaceholder} className="w-20 px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "#FFFDF6", border: "1px solid #EAE0C9" }} />
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="flex-1 px-2 py-2.5 rounded-xl text-sm outline-none" style={{ background: "#FFFDF6", border: "1px solid #EAE0C9" }}>
                  {UNITS.map((u) => (<option key={u} value={u}>{UNIT_LABELS[u][lang]}</option>))}
                </select>
                <button onClick={addIngredient} aria-label="Add ingredient" className="px-3.5 rounded-xl flex items-center justify-center transition-transform active:scale-90" style={{ background: "#5F6F45", color: "#FBF6E9" }}><Plus size={16} /></button>
              </div>
            </div>
          </div>
        )}

        {page === "recipes" && (
          <div className="card-in">
            <h1 className="serif text-3xl font-semibold mt-4 mb-5">{t.navRecipes}</h1>

            <button onClick={() => generateRecipes(false)} disabled={loading} className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 mb-6 transition-transform active:scale-[0.98] disabled:opacity-70" style={{ background: "#B04A2F", color: "#FBF6E9", boxShadow: "0 10px 22px -10px rgba(176,74,47,0.6)" }}>
              {loading ? (<><Loader2 size={16} className="animate-spin" /> {t.workingItOut}</>) : t.findRecipes}
            </button>

            {error && (<div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2 font-semibold" style={{ background: "rgba(176,74,47,0.12)", color: "#B04A2F" }}><AlertCircle size={16} /> {error}</div>)}

            {!hasSearched && !loading && (
              <div className="rounded-2xl p-10 text-center" style={{ border: "2px dashed #E0D4BB" }}>
                <p className="serif text-2xl mb-1">{t.recipesEmptyTitle}</p>
                <p className="text-sm" style={{ color: "#A08F76" }}>{t.recipesEmptySubtitle}</p>
              </div>
            )}

            {loading && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[0, 1, 2].map((i) => (<div key={i} className="rounded-2xl h-64 animate-pulse" style={{ background: "rgba(59,48,36,0.07)" }} />))}
              </div>
            )}

            {!loading && recipes.length > 0 && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  {recipes.map((r, i) => (<RecipeCard key={r.title + i} recipe={r} dietColor={activeDiet?.color} delay={(i % 3) * 80} favorited={isFavorite(r)} onToggleFavorite={toggleFavorite} t={t} />))}
                </div>
                <div className="flex justify-center mt-5">
                  <button onClick={() => generateRecipes(true)} disabled={loadingMore} className="px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-70" style={{ background: "#FFFDF6", color: "#B04A2F", border: "1px solid #EAE0C9" }}>
                    {loadingMore ? (<><Loader2 size={15} className="animate-spin" /> {t.workingItOut}</>) : t.loadMore}
                  </button>
                </div>
              </>
            )}

            {!loading && hasSearched && !error && recipes.length === 0 && (
              <div className="rounded-2xl p-10 text-center" style={{ border: "2px dashed #E0D4BB" }}>
                <p style={{ color: "#A08F76" }}>{t.noRecipesBack}</p>
              </div>
            )}
          </div>
        )}

        {page === "favorites" && (
          <div className="card-in">
            <h1 className="serif text-3xl font-semibold mt-4 mb-5">{t.favorites}</h1>
            {favorites.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {favorites.map((r, i) => (<RecipeCard key={r.title + i} recipe={r} dietColor={activeDiet?.color} delay={i * 80} favorited={true} onToggleFavorite={toggleFavorite} t={t} />))}
              </div>
            ) : (
              <div className="rounded-2xl p-10 text-center" style={{ border: "2px dashed #E0D4BB" }}>
                <p className="serif text-2xl mb-1">{t.noFavoritesTitle}</p>
                <p className="text-sm" style={{ color: "#A08F76" }}>{t.noFavoritesSubtitle}</p>
              </div>
            )}
          </div>
        )}

        {page === "settings" && (
          <div className="card-in">
            <h1 className="serif text-3xl font-semibold mt-4 mb-1">{t.navSettings}</h1>
            <p className="hand text-xl mb-6" style={{ color: "#5F6F45" }}>{t.settingsIntro}</p>

            <div className="rounded-2xl p-5 mb-4" style={card}>
              <div className="text-xs font-bold uppercase tracking-wide mb-3" style={sectionLabel}>{t.chooseLanguage}</div>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => {
                  const active = lang === l.code;
                  return (
                    <button key={l.code} onClick={() => setLang(l.code)} className="px-4 py-2 rounded-full text-sm font-bold transition-colors" style={{ background: active ? "#5F6F45" : "rgba(95,111,69,0.1)", color: active ? "#FBF6E9" : "#5F6F45" }}>
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={card}>
              <div className="text-xs font-bold uppercase tracking-wide mb-3" style={sectionLabel}>{t.howYouEat}</div>
              <div className="flex gap-2" role="radiogroup" aria-label="Dietary preference">
                {DIETS.map((d) => {
                  const Icon = d.icon;
                  const active = diet === d.key;
                  return (
                    <button key={d.key} role="radio" aria-checked={active} onClick={() => setDiet(d.key)} className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2" style={{ background: active ? d.color : "#F5EDDA", color: active ? "#FBF6E9" : "#7C6F5C" }}>
                      <Icon size={17} strokeWidth={2} />
                      {t.dietLabels[d.key]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50" style={{ background: "#FFFDF6", borderTop: "1px solid #EAE0C9", boxShadow: "0 -8px 24px -16px rgba(59,48,36,0.35)" }}>
        <div className="max-w-3xl mx-auto flex" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = page === n.key;
            return (
              <button key={n.key} onClick={() => setPage(n.key)} aria-label={n.label} className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors" style={{ color: active ? "#B04A2F" : "#A08F76" }}>
                <span className="flex items-center justify-center w-11 h-6 rounded-full transition-colors" style={{ background: active ? "rgba(176,74,47,0.12)" : "transparent" }}>
                  <Icon size={19} strokeWidth={active ? 2.4 : 2} fill={n.key === "favorites" && active ? "#B04A2F" : "none"} />
                </span>
                <span className="text-[10px] font-bold">{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
