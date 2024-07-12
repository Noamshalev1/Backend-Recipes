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
    // const now = new Date();
    // const id = now.getFullYear() + '-' +
    // ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
    // ('0' + now.getDate()).slice(-2) + ' ' +
    // ('0' + now.getHours()).slice(-2) + ':' +
    // ('0' + now.getMinutes()).slice(-2) + ':' +
    // ('0' + now.getSeconds()).slice(-2);
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const id = timestamp;
    const ingredients = JSON.stringify(new_recipe.ingredients);
    console.log(ingredients)
    const analyzedInstructions = JSON.stringify(new_recipe.analyzedInstructions);
    const instructions = new_recipe.instructions;
    await DButils.execQuery(`INSERT INTO myrecipes VALUES (${id},'${new_recipe.title}', '${new_recipe.summary}', ${new_recipe.readyInMinutes},${new_recipe.servings}, '${ingredients}', '${instructions}','${username}','${analyzedInstructions}')`);
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
