import * as searchView from './views/searchView';
import Recipe from './models/Recipe';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
import Search from './models/Search';


/** Global state of the app
 * - search object
 * - current recipe object
 * - shopping list object
 * - liked recipes
 */
const state = {};

/***
 * Search Controller
 */

const controlSearch = async () => {
    //1. get query from view
    const query = searchView.getInput();
    if (query) {
        //2. new search object and add to state
        state.search = new Search(query);

        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            //4. search for recipes
            await state.search.getResults();

            //5. render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('something went wrong');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/***
 * Recipe Controller
 */

const controlRecipe = async () => {
    //get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //prepare UI for changes

        //create new recipe object
        state.recipe = new Recipe(id);

        try {
            //get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            console.log(state.recipe);
        } catch (err) {
            alert('error processing recipe');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));