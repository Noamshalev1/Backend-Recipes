const axios = require("axios");
const { response } = require("express");
const api_domain = "https://api.spoonacular.com/recipes";
require('dotenv').config();



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: 'b1a72f1616ff413e984ea8dc1377d964'//change to env parameter <----------------
        }
    });
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
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        analyzedInstructions: analyzedInstructions || [], // Provide default empty array if undefined
        extendedIngredients: extendedIngredients || [],
        
    }
}

async function searchRecipe(params)
{
    console.log("searchRecipe")
    params.apiKey='b1a72f1616ff413e984ea8dc1377d964'//change to env parameter <----------------
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



