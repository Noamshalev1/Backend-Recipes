const DButils = require("./DButils");

async function markAsFavorite(username, recipeId){
    const query = `INSERT INTO favoriterecipes VALUES (${recipeId},'${username}')`;
    await DButils.execQuery(query);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipeId from favoriterecipes where username='${user_id}'`);
    return recipes_id;
}

async function removeFromFavorites(username, recipe_id) {
    await DButils.execQuery(`DELETE FROM favoriterecipes WHERE recipeId= ${recipe_id} AND username= '${username}'`);
}

async function getFamilyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT * FROM userfamilyrecipes AS uf INNER JOIN familyrecipe AS fr ON uf.id = fr.id WHERE uf.username='${user_id}'`);
    return recipes_id;
}

async function addNewRecipe(username,new_recipe){
    console.log(new_recipe.ingredients);
    const ingredients = JSON.stringify(new_recipe.ingredients);
    console.log(ingredients)
    const instructions = JSON.stringify(new_recipe.instructions);
    await DButils.execQuery(`INSERT INTO myrecipes VALUES (${new_recipe.id},'${new_recipe.title}', '${new_recipe.summary}', ${new_recipe.readyInMinutes},${new_recipe.servings}, '${ingredients}', '${instructions}','${username}')`);
}

async function getMyRecipes(username){
    const recipe = await DButils.execQuery(`SELECT * FROM myrecipes WHERE username='${username}'`);
    return recipe;
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.removeFromFavorites = removeFromFavorites;
exports.getFamilyRecipes = getFamilyRecipes;
exports.addNewRecipe = addNewRecipe;
exports.getMyRecipes = getMyRecipes;
