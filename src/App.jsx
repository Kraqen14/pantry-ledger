import React, { useState, useRef, useEffect } from "react";
import { Plus, X, ChefHat, Loader2, Beef, Leaf, Sprout, AlertCircle, Clock, Users2, Carrot, Apple, Drumstick, Milk, Wheat, Heart, Star, Flame, ArrowRight } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "it", label: "IT" },
];

const LANGUAGE_NAMES = { en: "English", pt: "Portuguese", es: "Spanish", fr: "French", it: "Italian" };

const DIETS = [
  { key: "carnivorous", icon: Beef, color: "#FF5A4E" },
  { key: "vegetarian", icon: Leaf, color: "#FFB238" },
  { key: "vegan", icon: Sprout, color: "#3FA34D" },
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
  { key: "vegetables", icon: Carrot, defaultUnit: "g", color: "#3FA34D", items: ["Tomato", "Onion", "Garlic", "Carrot", "Potato", "Spinach", "Broccoli", "Bell pepper", "Zucchini", "Mushroom", "Cucumber", "Lettuce"] },
  { key: "fruits", icon: Apple, defaultUnit: "piece", color: "#FF6F91", items: ["Apple", "Banana", "Lemon", "Lime", "Orange", "Avocado", "Berries", "Mango", "Grapes", "Pineapple"] },
  { key: "proteins", icon: Drumstick, defaultUnit: "g", color: "#E8483A", items: ["Chicken breast", "Beef", "Pork", "Salmon", "Shrimp", "Tofu", "Eggs", "Chickpeas", "Lentils", "Black beans"] },
  { key: "dairy", icon: Milk, defaultUnit: "ml", color: "#4FB8E8", items: ["Milk", "Butter", "Cheese", "Yogurt", "Cream", "Eggs"] },
  { key: "grains", icon: Wheat, defaultUnit: "g", color: "#D9A441", items: ["Rice", "Pasta", "Bread", "Flour", "Oats", "Quinoa"] },
  { key: "spices", icon: Flame, defaultUnit: "tsp", color: "#FF8C42", items: ["Salt", "Black pepper", "Paprika", "Cumin", "Cinnamon", "Oregano", "Basil", "Chili powder", "Turmeric", "Ginger", "Nutmeg", "Bay leaf"] },
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
  en: { brand: "Pantry Ledger", heroLine1: "What's in the kitchen,", heroLine2: "what's on the table.", subtitle: "List what you've got, set how you eat, and let the ledger turn it into supper.", navFeatures: "Features", navTry: "Try it", ctaPrimary: "Try it now", ctaSecondary: "See how it works", featureCategoriesTitle: "Six categories. Color-coded.", featureCategoriesBody: "Vegetables, fruits, proteins, dairy, grains, spices — tap to add, each one its own color.", featureLanguageTitle: "Cook in your language.", featureLanguageBody: "English, Portuguese, Spanish, French, or Italian — every label and every recipe.", featureMacrosTitle: "Know what you're eating.", featureMacrosBody: "Calories, protein, carbs, and fat, estimated for every recipe.", featureFavoritesTitle: "Save what you love.", featureFavoritesBody: "Tap the heart on any recipe to keep it close for next time.", tryItTitle: "Your pantry, right here.", tryItSubtitle: "No sign-up. Just add what you have.", footerTagline: "Made for whatever's in the fridge.", chooseLanguage: "Language", favorites: "Favorites", yourPantry: "Your pantry", emptyPantry: "Nothing listed yet — add an ingredient below.", quickAdd: "Quick add", orAddOwn: "Or add your own", ingredientPlaceholder: "Ingredient, e.g. courgette", qtyPlaceholder: "Qty", howYouEat: "How you eat", findRecipes: "Find recipes", workingItOut: "Working it out…", loadMore: "Load more recipes", kcal: "kcal", protein: "protein", carbs: "carbs", fat: "fat", ledgerWaitingTitle: "The ledger is waiting.", ledgerWaitingSubtitle: 'Add what\'s in your kitchen and press "Find recipes."', noFavoritesTitle: "No favorites yet.", noFavoritesSubtitle: "Tap the heart on any recipe to save it here.", addAtLeastOne: "Add at least one ingredient to your pantry first.", couldntGenerate: "Couldn't generate recipes just now. Try again in a moment.", noRecipesBack: "No recipes came back — try adjusting your pantry and try again.", min: "min", servings: "servings", alsoNeeds: "Also needs:", categoryLabels: { vegetables: "Vegetables", fruits: "Fruits", proteins: "Proteins", dairy: "Dairy & Eggs", grains: "Grains & Pantry", spices: "Spices" }, dietLabels: { carnivorous: "Carnivorous", vegetarian: "Vegetarian", vegan: "Vegan" } },
  pt: { brand: "Livro da Despensa", heroLine1: "O que há na cozinha,", heroLine2: "o que vai à mesa.", subtitle: "Liste o que tem, defina como come, e deixe o livro transformar isso em jantar.", navFeatures: "Funcionalidades", navTry: "Experimentar", ctaPrimary: "Experimentar agora", ctaSecondary: "Ver como funciona", featureCategoriesTitle: "Seis categorias. Coloridas.", featureCategoriesBody: "Vegetais, frutas, proteínas, laticínios, cereais, especiarias — toque para adicionar, cada uma com a sua cor.", featureLanguageTitle: "Cozinhe no seu idioma.", featureLanguageBody: "Inglês, português, espanhol, francês ou italiano — cada rótulo e cada receita.", featureMacrosTitle: "Saiba o que está a comer.", featureMacrosBody: "Calorias, proteína, carboidratos e gordura, estimados para cada receita.", featureFavoritesTitle: "Guarde o que adora.", featureFavoritesBody: "Toque no coração de qualquer receita para a guardar para a próxima.", tryItTitle: "A sua despensa, aqui mesmo.", tryItSubtitle: "Sem registo. Basta adicionar o que tem.", footerTagline: "Feito para o que houver no frigorífico.", chooseLanguage: "Idioma", favorites: "Favoritos", yourPantry: "Sua despensa", emptyPantry: "Nada listado ainda — adicione um ingrediente abaixo.", quickAdd: "Adicionar rápido", orAddOwn: "Ou adicione o seu", ingredientPlaceholder: "Ingrediente, ex. courgette", qtyPlaceholder: "Qtd", howYouEat: "Como você come", findRecipes: "Encontrar receitas", workingItOut: "Preparando…", loadMore: "Carregar mais receitas", kcal: "kcal", protein: "proteína", carbs: "carboidratos", fat: "gordura", ledgerWaitingTitle: "O livro está à espera.", ledgerWaitingSubtitle: 'Adicione o que tem na cozinha e clique em "Encontrar receitas."', noFavoritesTitle: "Ainda sem favoritos.", noFavoritesSubtitle: "Toque no coração de qualquer receita para guardá-la aqui.", addAtLeastOne: "Adicione pelo menos um ingrediente à sua despensa primeiro.", couldntGenerate: "Não foi possível gerar receitas agora. Tente novamente em instantes.", noRecipesBack: "Nenhuma receita foi encontrada — ajuste sua despensa e tente novamente.", min: "min", servings: "porções", alsoNeeds: "Também precisa de:", categoryLabels: { vegetables: "Vegetais", fruits: "Frutas", proteins: "Proteínas", dairy: "Laticínios e Ovos", grains: "Cereais e Despensa", spices: "Especiarias" }, dietLabels: { carnivorous: "Carnívoro", vegetarian: "Vegetariano", vegan: "Vegano" } },
  es: { brand: "Libro de la Despensa", heroLine1: "Lo que hay en la cocina,", heroLine2: "lo que va a la mesa.", subtitle: "Enumera lo que tienes, define cómo comes, y deja que el libro lo convierta en cena.", navFeatures: "Funciones", navTry: "Probar", ctaPrimary: "Probar ahora", ctaSecondary: "Ver cómo funciona", featureCategoriesTitle: "Seis categorías. A todo color.", featureCategoriesBody: "Verduras, frutas, proteínas, lácteos, cereales, especias — toca para añadir, cada una con su color.", featureLanguageTitle: "Cocina en tu idioma.", featureLanguageBody: "Inglés, portugués, español, francés o italiano — cada etiqueta y cada receta.", featureMacrosTitle: "Sabe lo que comes.", featureMacrosBody: "Calorías, proteína, carbohidratos y grasa, estimados para cada receta.", featureFavoritesTitle: "Guarda lo que te gusta.", featureFavoritesBody: "Toca el corazón de cualquier receta para guardarla para la próxima vez.", tryItTitle: "Tu despensa, aquí mismo.", tryItSubtitle: "Sin registro. Solo añade lo que tienes.", footerTagline: "Hecho para lo que haya en la nevera.", chooseLanguage: "Idioma", favorites: "Favoritos", yourPantry: "Tu despensa", emptyPantry: "Nada listado todavía — añade un ingrediente abajo.", quickAdd: "Añadir rápido", orAddOwn: "O añade el tuyo", ingredientPlaceholder: "Ingrediente, ej. calabacín", qtyPlaceholder: "Cant", howYouEat: "Cómo comes", findRecipes: "Buscar recetas", workingItOut: "Preparando…", loadMore: "Cargar más recetas", kcal: "kcal", protein: "proteína", carbs: "carbohidratos", fat: "grasa", ledgerWaitingTitle: "El libro está esperando.", ledgerWaitingSubtitle: 'Añade lo que tienes en la cocina y pulsa "Buscar recetas."', noFavoritesTitle: "Aún no hay favoritos.", noFavoritesSubtitle: "Toca el corazón de cualquier receta para guardarla aquí.", addAtLeastOne: "Añade al menos un ingrediente a tu despensa primero.", couldntGenerate: "No se pudieron generar recetas ahora. Inténtalo de nuevo en un momento.", noRecipesBack: "No se encontraron recetas — ajusta tu despensa e inténtalo de nuevo.", min: "min", servings: "porciones", alsoNeeds: "También necesita:", categoryLabels: { vegetables: "Verduras", fruits: "Frutas", proteins: "Proteínas", dairy: "Lácteos y Huevos", grains: "Cereales y Despensa", spices: "Especias" }, dietLabels: { carnivorous: "Carnívoro", vegetarian: "Vegetariano", vegan: "Vegano" } },
  fr: { brand: "Carnet du Garde-Manger", heroLine1: "Ce qu'il y a dans la cuisine,", heroLine2: "ce qu'il y a sur la table.", subtitle: "Listez ce que vous avez, définissez votre régime, et laissez le carnet le transformer en dîner.", navFeatures: "Fonctionnalités", navTry: "Essayer", ctaPrimary: "Essayer maintenant", ctaSecondary: "Voir comment ça marche", featureCategoriesTitle: "Six catégories. En couleur.", featureCategoriesBody: "Légumes, fruits, protéines, produits laitiers, céréales, épices — touchez pour ajouter, chacune sa couleur.", featureLanguageTitle: "Cuisinez dans votre langue.", featureLanguageBody: "Anglais, portugais, espagnol, français ou italien — chaque libellé et chaque recette.", featureMacrosTitle: "Sachez ce que vous mangez.", featureMacrosBody: "Calories, protéines, glucides et lipides, estimés pour chaque recette.", featureFavoritesTitle: "Gardez ce que vous aimez.", featureFavoritesBody: "Touchez le cœur d'une recette pour la garder sous la main.", tryItTitle: "Votre garde-manger, ici même.", tryItSubtitle: "Aucune inscription. Ajoutez simplement ce que vous avez.", footerTagline: "Conçu pour ce qu'il y a dans le frigo.", chooseLanguage: "Langue", favorites: "Favoris", yourPantry: "Votre garde-manger", emptyPantry: "Rien n'est encore listé — ajoutez un ingrédient ci-dessous.", quickAdd: "Ajout rapide", orAddOwn: "Ou ajoutez le vôtre", ingredientPlaceholder: "Ingrédient, ex. courgette", qtyPlaceholder: "Qté", howYouEat: "Votre régime", findRecipes: "Trouver des recettes", workingItOut: "Ça mijote…", loadMore: "Charger plus de recettes", kcal: "kcal", protein: "protéines", carbs: "glucides", fat: "lipides", ledgerWaitingTitle: "Le carnet attend.", ledgerWaitingSubtitle: 'Ajoutez ce qu\'il y a dans votre cuisine et appuyez sur "Trouver des recettes."', noFavoritesTitle: "Pas encore de favoris.", noFavoritesSubtitle: "Appuyez sur le cœur d'une recette pour l'enregistrer ici.", addAtLeastOne: "Ajoutez d'abord au moins un ingrédient à votre garde-manger.", couldntGenerate: "Impossible de générer des recettes pour le moment. Réessayez dans un instant.", noRecipesBack: "Aucune recette trouvée — ajustez votre garde-manger et réessayez.", min: "min", servings: "portions", alsoNeeds: "Il faut aussi :", categoryLabels: { vegetables: "Légumes", fruits: "Fruits", proteins: "Protéines", dairy: "Laitages et Œufs", grains: "Céréales et Épicerie", spices: "Épices" }, dietLabels: { carnivorous: "Carnivore", vegetarian: "Végétarien", vegan: "Végane" } },
  it: { brand: "Quaderno della Dispensa", heroLine1: "Quello che c'è in cucina,", heroLine2: "quello che c'è in tavola.", subtitle: "Elenca quello che hai, imposta come mangi, e lascia che il quaderno lo trasformi in cena.", navFeatures: "Funzionalità", navTry: "Prova", ctaPrimary: "Prova ora", ctaSecondary: "Scopri come funziona", featureCategoriesTitle: "Sei categorie. A colori.", featureCategoriesBody: "Verdure, frutta, proteine, latticini, cereali, spezie — tocca per aggiungere, ognuna con il suo colore.", featureLanguageTitle: "Cucina nella tua lingua.", featureLanguageBody: "Inglese, portoghese, spagnolo, francese o italiano — ogni etichetta e ogni ricetta.", featureMacrosTitle: "Sai cosa stai mangiando.", featureMacrosBody: "Calorie, proteine, carboidrati e grassi, stimati per ogni ricetta.", featureFavoritesTitle: "Salva quello che ami.", featureFavoritesBody: "Tocca il cuore su una ricetta per tenerla a portata di mano.", tryItTitle: "La tua dispensa, proprio qui.", tryItSubtitle: "Nessuna registrazione. Aggiungi solo quello che hai.", footerTagline: "Pensato per quello che c'è in frigo.", chooseLanguage: "Lingua", favorites: "Preferiti", yourPantry: "La tua dispensa", emptyPantry: "Ancora nulla in elenco — aggiungi un ingrediente qui sotto.", quickAdd: "Aggiunta rapida", orAddOwn: "O aggiungi il tuo", ingredientPlaceholder: "Ingrediente, es. zucchina", qtyPlaceholder: "Qtà", howYouEat: "Come mangi", findRecipes: "Trova ricette", workingItOut: "Sto preparando…", loadMore: "Carica altre ricette", kcal: "kcal", protein: "proteine", carbs: "carboidrati", fat: "grassi", ledgerWaitingTitle: "Il quaderno sta aspettando.", ledgerWaitingSubtitle: 'Aggiungi quello che hai in cucina e premi "Trova ricette."', noFavoritesTitle: "Ancora nessun preferito.", noFavoritesSubtitle: "Tocca il cuore di una ricetta per salvarla qui.", addAtLeastOne: "Aggiungi prima almeno un ingrediente alla tua dispensa.", couldntGenerate: "Impossibile generare ricette al momento. Riprova tra poco.", noRecipesBack: "Nessuna ricetta trovata — modifica la tua dispensa e riprova.", min: "min", servings: "porzioni", alsoNeeds: "Serve anche:", categoryLabels: { vegetables: "Verdure", fruits: "Frutta", proteins: "Proteine", dairy: "Latticini e Uova", grains: "Cereali e Dispensa", spices: "Spezie" }, dietLabels: { carnivorous: "Carnivoro", vegetarian: "Vegetariano", vegan: "Vegano" } },
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

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  );
}

function RecipeCard({ recipe: r, dietColor, delay, favorited, onToggleFavorite, t }) {
  return (
    <div className="card-in rounded-2xl overflow-hidden bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 12px 28px -14px rgba(0,0,0,0.14)", animationDelay: `${delay}ms` }}>
      <div style={{ height: 4, background: dietColor }} />
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-lg font-semibold leading-snug tracking-tight" style={{ color: "#1D1D1F" }}>{r.title}</h3>
          <button onClick={() => onToggleFavorite(r)} aria-label={favorited ? `Remove ${r.title} from favorites` : `Save ${r.title} to favorites`} className="transition-transform active:scale-90 shrink-0 mt-0.5" style={{ color: favorited ? "#FF6B4A" : "#D2D2D7" }}>
            <Heart size={18} fill={favorited ? "#FF6B4A" : "none"} strokeWidth={1.75} />
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: "#6E6E73" }}>{r.description}</p>
        <div className="flex items-center gap-4 mb-4 text-xs font-medium tabular-nums" style={{ color: "#86868B" }}>
          {r.time_minutes != null && (<span className="flex items-center gap-1"><Clock size={13} /> {r.time_minutes} {t.min}</span>)}
          {r.servings != null && (<span className="flex items-center gap-1"><Users2 size={13} /> {r.servings} {t.servings}</span>)}
        </div>
        {r.macros && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
            {[
              { key: "calories", label: t.kcal, value: r.macros.calories },
              { key: "protein_g", label: t.protein, value: r.macros.protein_g },
              { key: "carbs_g", label: t.carbs, value: r.macros.carbs_g },
              { key: "fat_g", label: t.fat, value: r.macros.fat_g },
            ].map((m) =>
              m.value != null ? (
                <div key={m.key} className="rounded-xl py-2 text-center" style={{ background: "#F5F5F7" }}>
                  <div className="text-sm font-semibold tabular-nums" style={{ color: "#1D1D1F" }}>
                    {m.value}{m.key !== "calories" ? "g" : ""}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide font-medium" style={{ color: "#86868B" }}>{m.label}</div>
                </div>
              ) : null
            )}
          </div>
        )}
        {r.used_ingredients?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {r.used_ingredients.map((u, ui) => (
              <span key={ui} className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "#EAF7EC", color: "#2E7D3E" }}>{u}</span>
            ))}
          </div>
        )}
        {r.extra_ingredients?.length > 0 && (
          <p className="text-xs mb-3" style={{ color: "#86868B" }}><span className="font-semibold">{t.alsoNeeds}</span> {r.extra_ingredients.join(", ")}</p>
        )}
        {r.steps?.length > 0 && (
          <ol className="text-sm flex flex-col gap-1.5 mt-2 pt-4" style={{ borderTop: "1px solid #EDEDED", color: "#1D1D1F" }}>
            {r.steps.map((s, si) => (
              <li key={si} className="flex gap-2"><span className="shrink-0 font-semibold tabular-nums" style={{ color: "#FF6B4A" }}>{si + 1}.</span><span>{s}</span></li>
            ))}
          </ol>
        )}
      </div>
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
  const activeCategory = CATEGORIES.find((c) => c.key === quickCategory);

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "#FFFFFF", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: "#1D1D1F" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .card-in { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .card-in { animation: none; }
        }
      `}</style>

      {/* Fixed frosted nav */}
      <nav className="fixed top-0 inset-x-0 z-50" style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid #E5E5E7" }}>
        <div className="max-w-6xl mx-auto px-5 h-12 flex items-center justify-between">
          <button onClick={() => scrollToId("top")} className="flex items-center gap-1.5">
            <ChefHat size={17} strokeWidth={2} style={{ color: "#FF6B4A" }} />
            <span className="text-[13px] font-semibold tracking-tight">{t.brand}</span>
          </button>
          <div className="hidden sm:flex items-center gap-6 text-[13px] font-medium" style={{ color: "#424245" }}>
            <button onClick={() => scrollToId("features")} className="hover:opacity-60 transition-opacity">{t.navFeatures}</button>
            <button onClick={() => scrollToId("app")} className="hover:opacity-60 transition-opacity">{t.navTry}</button>
          </div>
          <div className="flex gap-1">
            {LANGUAGES.map((l) => {
              const active = lang === l.code;
              return (
                <button key={l.code} onClick={() => setLang(l.code)} className="w-7 h-7 rounded-full text-[11px] font-semibold transition-colors flex items-center justify-center" style={{ background: active ? "#1D1D1F" : "transparent", color: active ? "#FFFFFF" : "#86868B" }}>
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div id="top" />
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-5 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 mb-5 text-xs font-semibold tracking-wide uppercase" style={{ color: "#FF6B4A" }}>
            <ChefHat size={14} strokeWidth={2} /> {t.brand}
          </div>
          <h1 className="text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl font-bold tracking-tight" style={{ color: "#1D1D1F" }}>
            {t.heroLine1}<br />{t.heroLine2}
          </h1>
          <p className="mt-6 text-lg sm:text-xl max-w-xl mx-auto" style={{ color: "#6E6E73" }}>{t.subtitle}</p>
          <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => scrollToId("app")} className="px-7 py-3.5 rounded-full text-[15px] font-semibold transition-transform active:scale-95" style={{ background: "#FF6B4A", color: "#FFFFFF", boxShadow: "0 10px 24px -8px rgba(255,107,74,0.5)" }}>
              {t.ctaPrimary}
            </button>
            <button onClick={() => scrollToId("features")} className="flex items-center gap-1 px-5 py-3.5 rounded-full text-[15px] font-semibold transition-colors hover:opacity-70" style={{ color: "#1D1D1F" }}>
              {t.ctaSecondary} <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Decorative hero preview card */}
        <Reveal className="mt-16 sm:mt-20 max-w-3xl mx-auto">
          <div className="rounded-[2rem] p-6 sm:p-8 text-left" style={{ background: "#F5F5F7", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.25)" }}>
            <div className="flex flex-wrap gap-2 mb-5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <span key={cat.key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: `${cat.color}1A`, color: cat.color }}>
                    <Icon size={13} strokeWidth={2} /> {t.categoryLabels[cat.key]}
                  </span>
                );
              })}
            </div>
            <div className="rounded-2xl bg-white p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ height: 4, background: "#3FA34D", marginTop: -20, marginInline: -20, marginBottom: 16, borderRadius: "16px 16px 0 0" }} />
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="text-base font-semibold" style={{ color: "#1D1D1F" }}>Spinach &amp; Egg Skillet</h3>
                <Heart size={16} fill="#FF6B4A" color="#FF6B4A" />
              </div>
              <p className="text-sm mb-3" style={{ color: "#6E6E73" }}>A quick, protein-packed breakfast in one pan.</p>
              <div className="grid grid-cols-4 gap-1.5">
                {[["320", t.kcal], ["18g", t.protein], ["9g", t.carbs], ["22g", t.fat]].map(([v, l], i) => (
                  <div key={i} className="rounded-lg py-1.5 text-center" style={{ background: "#F5F5F7" }}>
                    <div className="text-xs font-semibold tabular-nums" style={{ color: "#1D1D1F" }}>{v}</div>
                    <div className="text-[9px] uppercase tracking-wide" style={{ color: "#86868B" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Feature sections */}
      <section id="features" className="py-20 sm:py-28 px-5" style={{ background: "#FFFFFF" }}>
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#1D1D1F" }}>{t.featureCategoriesTitle}</h2>
          <p className="mt-4 text-lg" style={{ color: "#6E6E73" }}>{t.featureCategoriesBody}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <span key={cat.key} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: `${cat.color}1A`, color: cat.color }}>
                  <Icon size={15} strokeWidth={2} /> {t.categoryLabels[cat.key]}
                </span>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section className="py-20 sm:py-28 px-5" style={{ background: "#F5F5F7" }}>
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#1D1D1F" }}>{t.featureLanguageTitle}</h2>
          <p className="mt-4 text-lg" style={{ color: "#6E6E73" }}>{t.featureLanguageBody}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-2.5">
            {LANGUAGES.map((l) => (
              <span key={l.code} className="px-4 py-2 rounded-full text-sm font-semibold bg-white" style={{ color: "#1D1D1F", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                {LANGUAGE_NAMES[l.code]}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-20 sm:py-28 px-5" style={{ background: "#FFFFFF" }}>
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#1D1D1F" }}>{t.featureMacrosTitle}</h2>
          <p className="mt-4 text-lg" style={{ color: "#6E6E73" }}>{t.featureMacrosBody}</p>
          <div className="mt-9 grid grid-cols-4 gap-3 max-w-md mx-auto">
            {[["420", t.kcal], ["24g", t.protein], ["38g", t.carbs], ["16g", t.fat]].map(([v, l], i) => (
              <div key={i} className="rounded-2xl py-4 text-center" style={{ background: "#F5F5F7" }}>
                <div className="text-lg font-bold tabular-nums" style={{ color: "#1D1D1F" }}>{v}</div>
                <div className="text-[10px] uppercase tracking-wide font-medium mt-0.5" style={{ color: "#86868B" }}>{l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-20 sm:py-28 px-5" style={{ background: "#F5F5F7" }}>
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#1D1D1F" }}>{t.featureFavoritesTitle}</h2>
          <p className="mt-4 text-lg" style={{ color: "#6E6E73" }}>{t.featureFavoritesBody}</p>
          <div className="mt-9 max-w-sm mx-auto flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <span className="text-sm font-medium" style={{ color: "#1D1D1F" }}>Lemon Herb Roast Chicken</span>
            <Heart size={18} fill="#FF6B4A" color="#FF6B4A" />
          </div>
        </Reveal>
      </section>

      {/* Try it — the actual app */}
      <section id="app" className="py-20 sm:py-28 px-5" style={{ background: "#FFFFFF" }}>
        <Reveal className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#1D1D1F" }}>{t.tryItTitle}</h2>
          <p className="mt-4 text-lg" style={{ color: "#6E6E73" }}>{t.tryItSubtitle}</p>
        </Reveal>

        <div className="max-w-6xl mx-auto rounded-[2rem] p-4 sm:p-8" style={{ background: "#F5F5F7" }}>
          <div className="grid md:grid-cols-[360px_1fr] gap-6">
            <div>
              <div className="rounded-3xl p-5 md:p-6 md:sticky md:top-16 bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 16px 34px -18px rgba(0,0,0,0.18)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold tracking-tight" style={{ color: "#1D1D1F" }}>{t.yourPantry}</h3>
                  <button onClick={() => setShowFavorites((v) => !v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors" style={{ background: showFavorites ? "#FFC93C" : "#F5F5F7", color: "#1D1D1F" }}>
                    <Star size={13} fill={showFavorites ? "#1D1D1F" : "none"} /> {favorites.length > 0 && favorites.length}
                  </button>
                </div>

                <ul className="mb-4 flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                  {pantry.length === 0 && (<li className="text-sm italic" style={{ color: "#B0A28D" }}>{t.emptyPantry}</li>)}
                  {pantry.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-xl" style={{ background: "#F5F5F7" }}>
                      <span className="text-sm truncate font-medium" style={{ color: "#1D1D1F" }}>{translateItem(item.name, lang)}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => updateQty(idx, -1)} aria-label={`Decrease ${item.name} quantity`} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#EDEDED", color: "#1D1D1F" }}>−</button>
                        <input value={item.qty} onChange={(e) => setQtyValue(idx, e.target.value)} className="w-10 text-center text-xs tabular-nums rounded-lg py-0.5 outline-none" style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", color: "#1D1D1F" }} />
                        <button onClick={() => updateQty(idx, 1)} aria-label={`Increase ${item.name} quantity`} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#EDEDED", color: "#1D1D1F" }}>+</button>
                        <select value={item.unit} onChange={(e) => setUnitValue(idx, e.target.value)} className="text-xs rounded-lg py-0.5 outline-none" style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", color: "#1D1D1F" }}>
                          {UNITS.map((u) => (<option key={u} value={u}>{UNIT_LABELS[u][lang]}</option>))}
                        </select>
                        <button onClick={() => removeIngredient(idx)} aria-label={`Remove ${item.name}`} className="opacity-50 hover:opacity-100 transition-opacity ml-0.5" style={{ color: "#E8483A" }}><X size={15} /></button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mb-4 pt-4" style={{ borderTop: "1px solid #EDEDED" }}>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#B0A28D" }}>{t.quickAdd}</div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const active = quickCategory === cat.key;
                      return (
                        <button key={cat.key} onClick={() => setQuickCategory(cat.key)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all" style={{ background: active ? cat.color : `${cat.color}14`, color: active ? "#FFFFFF" : cat.color }}>
                          <Icon size={13} strokeWidth={2} />
                          {t.categoryLabels[cat.key]}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCategory?.items.map((item) => {
                      const added = isInPantry(item);
                      return (
                        <button key={item} onClick={() => quickAdd(item, activeCategory.defaultUnit)} disabled={added} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all disabled:cursor-default" style={{
                          background: added ? "#EAF7EC" : "#FFFFFF",
                          border: added ? "1px solid #BFE3C6" : "1px solid #E5E5E7",
                          color: added ? "#2E7D3E" : "#1D1D1F",
                          transform: justAdded === item ? "scale(1.08)" : "scale(1)",
                        }}>
                          {added ? "✓" : "+"} {translateItem(item, lang)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-5 pt-4" style={{ borderTop: "1px solid #EDEDED" }}>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#B0A28D" }}>{t.orAddOwn}</div>
                  <input ref={nameInputRef} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.ingredientPlaceholder} className="w-full px-3.5 py-2.5 rounded-2xl text-sm outline-none" style={{ background: "#F5F5F7", border: "1px solid #E5E5E7", color: "#1D1D1F" }} />
                  <div className="flex gap-2">
                    <input value={qty} onChange={(e) => setQty(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.qtyPlaceholder} className="w-20 px-3 py-2.5 rounded-2xl text-sm outline-none tabular-nums" style={{ background: "#F5F5F7", border: "1px solid #E5E5E7", color: "#1D1D1F" }} />
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="flex-1 px-2 py-2.5 rounded-2xl text-sm outline-none" style={{ background: "#F5F5F7", border: "1px solid #E5E5E7", color: "#1D1D1F" }}>
                      {UNITS.map((u) => (<option key={u} value={u}>{UNIT_LABELS[u][lang]}</option>))}
                    </select>
                    <button onClick={addIngredient} aria-label="Add ingredient" className="px-3.5 rounded-2xl flex items-center justify-center transition-transform active:scale-90" style={{ background: "#1D1D1F", color: "#FFFFFF" }}><Plus size={16} /></button>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#B0A28D" }}>{t.howYouEat}</div>
                  <div className="flex rounded-2xl overflow-hidden gap-1.5" role="radiogroup" aria-label="Dietary preference">
                    {DIETS.map((d) => {
                      const Icon = d.icon;
                      const active = diet === d.key;
                      return (
                        <button key={d.key} role="radio" aria-checked={active} onClick={() => setDiet(d.key)} className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl text-xs font-semibold transition-all focus-visible:outline focus-visible:outline-2" style={{ background: active ? d.color : "#F5F5F7", color: active ? "#FFFFFF" : "#6E6E73" }}>
                          <Icon size={16} strokeWidth={2} />
                          {t.dietLabels[d.key]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button onClick={() => generateRecipes(false)} disabled={loading} className="w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.97] disabled:opacity-70" style={{ background: "#FF6B4A", color: "#FFFFFF", boxShadow: "0 10px 22px -8px rgba(255,107,74,0.5)" }}>
                  {loading ? (<><Loader2 size={16} className="animate-spin" /> {t.workingItOut}</>) : t.findRecipes}
                </button>
              </div>

              {favorites.length > 0 && (
                <div className="rounded-3xl p-5 mt-6 bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 16px 34px -18px rgba(0,0,0,0.18)" }}>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star size={15} fill="#FFC93C" color="#FFC93C" />
                    <h3 className="text-base font-semibold tracking-tight" style={{ color: "#1D1D1F" }}>{t.favorites}</h3>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {favorites.map((r, i) => (
                      <li key={r.title + i} className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-xl" style={{ background: "#F5F5F7" }}>
                        <span className="text-sm truncate font-medium" style={{ color: "#1D1D1F" }}>{r.title}</span>
                        <button
                          onClick={() => toggleFavorite(r)}
                          aria-label={`Remove ${r.title} from favorites`}
                          className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
                          style={{ color: "#FF6B4A" }}
                        >
                          <Heart size={14} fill="#FF6B4A" strokeWidth={1.75} />
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
                  <div className="rounded-3xl p-10 text-center bg-white" style={{ border: "2px dashed #E5E5E7" }}>
                    <p className="text-xl font-semibold tracking-tight mb-1" style={{ color: "#1D1D1F" }}>{t.noFavoritesTitle}</p>
                    <p className="text-sm" style={{ color: "#6E6E73" }}>{t.noFavoritesSubtitle}</p>
                  </div>
                )
              ) : (
                <>
                  {error && (<div className="mb-5 px-4 py-3 rounded-2xl text-sm flex items-center gap-2 font-medium" style={{ background: "#FFE9E5", color: "#D8402F" }}><AlertCircle size={16} /> {error}</div>)}
                  {!hasSearched && !loading && (
                    <div className="rounded-3xl p-10 text-center bg-white" style={{ border: "2px dashed #E5E5E7" }}>
                      <p className="text-xl font-semibold tracking-tight mb-1" style={{ color: "#1D1D1F" }}>{t.ledgerWaitingTitle}</p>
                      <p className="text-sm" style={{ color: "#6E6E73" }}>{t.ledgerWaitingSubtitle}</p>
                    </div>
                  )}
                  {loading && (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {[0, 1, 2, 3].map((i) => (<div key={i} className="rounded-2xl h-64 animate-pulse bg-white" />))}
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
                          className="px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-70 bg-white"
                          style={{ color: "#FF6B4A", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                        >
                          {loadingMore ? (<><Loader2 size={15} className="animate-spin" /> {t.workingItOut}</>) : t.loadMore}
                        </button>
                      </div>
                    </>
                  )}
                  {!loading && hasSearched && !error && recipes.length === 0 && (
                    <div className="rounded-3xl p-10 text-center bg-white" style={{ border: "2px dashed #E5E5E7" }}>
                      <p style={{ color: "#6E6E73" }}>{t.noRecipesBack}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-5 text-center" style={{ background: "#F5F5F7", borderTop: "1px solid #E5E5E7" }}>
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <ChefHat size={15} strokeWidth={2} style={{ color: "#86868B" }} />
          <span className="text-sm font-semibold" style={{ color: "#1D1D1F" }}>{t.brand}</span>
        </div>
        <p className="text-xs" style={{ color: "#86868B" }}>{t.footerTagline}</p>
      </footer>
    </div>
  );
}
