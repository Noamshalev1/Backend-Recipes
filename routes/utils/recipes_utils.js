const axios = require("axios");
const { response } = require("express");
const api_domain = "https://api.spoonacular.com/recipes";
require('dotenv').config();
const apiKey = process.env.spooncular_apiKey;

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: apiKey
        }
    });
}

async function getRecipesPreview(recipe_array){
    const results = [];
    // Use a for loop to iterate over each recipe ID in the recipe_array
    for (let recipe_id of recipe_array) {
        // Fetch the recipe details for each recipe ID
        const recipe_details = await getRecipeDetails(recipe_id.recipeId);
        // Push the fetched details to the results array
        results.push(recipe_details);
    }
    // Return the array containing all the recipe previews
    return results;
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { 
        id, 
        title, 
        readyInMinutes, 
        image, 
        aggregateLikes, 
        vegan, 
        vegetarian, 
        glutenFree, 
        analyzedInstructions, 
        extendedIngredients 
    } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        aggregateLikes: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        analyzedInstructions: analyzedInstructions || [], // Provide default empty array if undefined
        extendedIngredients: extendedIngredients || [],
        
    }
}

async function getFamilyRecipesPreview(recipe_array){
    const results = [];
    // Use a for loop to iterate over each recipe ID in the recipe_array
    for (let recipe_id of recipe_array) {
        // Fetch the recipe details for each recipe ID
        const recipe_details = await getFamilyRecipeDetails(recipe_id);
        // Push the fetched details to the results array
        results.push(recipe_details);
    }
    // Return the array containing all the recipe previews
    return results;
}

async function getFamilyRecipeDetails(recipe_id) {
    const {
        id,
        title,
        image,
        ingredients,
        preparation,
        owner,
        when,
        servings
      } = recipe_id;
    
      return {
        id,
        title,
        image,
        ingredients,
        preparation,
        owner,
        when,
        servings
      };
}


async function getMyRecipesPreview(recipe_array){
    const results = [];
    // Use a for loop to iterate over each recipe ID in the recipe_array
    for (let recipe_id of recipe_array) {
        // Fetch the recipe details for each recipe ID
        const recipe_details = await getMyRecipeDetails(recipe_id);
        // Push the fetched details to the results array
        results.push(recipe_details);
    }
    // Return the array containing all the recipe previews
    return results;
}
async function getMyRecipeDetails(recipe_id) {
    const {
        id,
        title,
        summary,
        readyInMinutes,
        servings,
        ingredients,
        instructions,
      } = recipe_id;
    
      return {
        id,
        title,
        summary,
        readyInMinutes,
        servings,
        ingredients: JSON.parse(ingredients), // check if works
        instructions: JSON.parse(instructions),
      };
}
async function searchRecipe(params)
{
    params.apiKey=apiKey;
    try {
        const response = await axios.get(`${api_domain}/complexSearch`, { params });
        return response.data; // Return the data from the response
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw new Error('Error fetching recipes'); // Throw an error to handle it higher up in the call stack
    }
}


exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipe = searchRecipe;
exports.getRecipesPreview=getRecipesPreview;
exports.getFamilyRecipesPreview=getFamilyRecipesPreview;
exports.getMyRecipesPreview = getMyRecipesPreview;



