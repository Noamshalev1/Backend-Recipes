var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    console.log("first if")
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.username)) {
        req.username = req.session.username;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});



/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  console.log("hi")
  try{
    const user_id = req.session.username;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
});

/**
 * This path returns the favorite recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req, res, next) => {
  try {
    const username = req.session.username; // Get username from query parameters
    if (!username) {
      return res.status(400).send({ message: 'Username is required', success: false });
    }
    const recipes_id = await user_utils.getFavoriteRecipes(username);
    if (recipes_id.length === 0){
      return res.status(404).send("No favorites");
    }
    // const recipes_id_array = recipes_id.map(element => element.recipe_id); // Extracting the recipe ids into an array
    // console.log(recipes_id_array)
    const results = await recipe_utils.getRecipesPreview(recipes_id);
    res.status(200).send(results);
  } catch (error) {
    // next(error);
  }
});

/**
 * This route removes a favorite recipe for the specified user.
 */
router.delete('/favorites', async (req, res, next) => {
  try {
    const recipeId = req.body.recipeId;
    const username = req.session.username;
    await user_utils.removeFromFavorites(username, recipeId);
    res.status(200).send({ success: true, message: 'Recipe removed from favorites' });
  } catch (error) {
    next(error);
  }
});

router.get('/familyrecipes', async (req, res, next) => {
  try {
    const username = req.session.username; // Get username from query parameters
    if (!username) {
      return res.status(400).send({ message: 'Username is required', success: false });
    }

    const recipes_id = await user_utils.getFamilyRecipes(username);
    console.log(recipes_id)
    // const recipes_id_array = recipes_id.map(element => element.recipe_id); // Extracting the recipe ids into an array
    // console.log(recipes_id_array)
    const results = await recipe_utils.getFamilyRecipesPreview(recipes_id);

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.post('/myrecipes', async (req,res,next) => {
  try{
    const user_id = req.session.username;
    // check if it's uniqe recipe id
    DButils.execQuery(`SELECT id FROM myrecipes WHERE username='${user_id}'`).then((myrecipes) => {
      if (myrecipes.find((x) => x.id === req.body.recipe.id)) {
        res.status(401).send("Duplicate recipes id");
      }
      next();
    }).catch(err => next(err));
    const recipe = req.body.recipe;
    await user_utils.addNewRecipe(user_id,recipe)
    res.status(200).send("The Recipe successfully saved as myrecipe");
    } catch(error){
    next(error);
  }
});

router.get('/myrecipes', async (req,res,next) => {
  try{
    const user_id = req.session.username;
    const recipes = await user_utils.getMyRecipes(user_id);
    const results = await recipe_utils.getMyRecipesPreview(recipes)
    res.status(200).send(results);
    } catch(error){
    next(error);
  }
})

// Get the last search from DB - by username
router.get("/search", async (req, res, next) => {
  try {
    const username = req.session.username;
    const response = await DButils.execQuery(`SELECT searchQuery FROM lastsearch WHERE username='${username}'`);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

// Post the last views to DB - by username
router.post("/lastviewed", async (req, res, next) => {
  try {
    const username = req.session.username;
    const response = await DButils.execQuery(`SELECT recipeId FROM lastviewed WHERE username='${username}' AND recipeId=${req.body.recipeId}`);
    if (response.length > 0) {
        // User exists, so update the search query
        console.log("Delete " + req.body.recipeId)
        await DButils.execQuery(`DELETE FROM lastviewed WHERE recipeId=${req.body.recipeId} AND username='${username}'`);

    } 
    // User does not exist, so insert a new record
    console.log("Insert " + req.body.recipeId)
    await DButils.execQuery(`INSERT INTO lastviewed VALUES (${req.body.recipeId}, '${username}')`);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// Get the last views from DB - by username
router.get("/lastviewed", async (req, res, next) => {
  try {
    const username = req.session.username;
    const response = await DButils.execQuery(`SELECT recipeId FROM lastviewed WHERE username='${username}'`);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
