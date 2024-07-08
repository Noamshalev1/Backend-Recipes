var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
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
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorite recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req, res, next) => {
  try {
    const username = req.query.username; // Get username from query parameters
    if (!username) {
      return res.status(400).send({ message: 'Username is required', success: false });
    }

    const recipes_id = await user_utils.getFavoriteRecipes(username);
    const recipes_id_array = recipes_id.map(element => element.recipe_id); // Extracting the recipe ids into an array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This route removes a favorite recipe for the specified user.
 */
router.delete('/favorites', async (req, res, next) => {
  try {
    const { username, recipeId } = req.body;
    await user_utils.removeFromFavorites(username, recipeId);
    res.status(200).send({ success: true, message: 'Recipe removed from favorites' });
  } catch (error) {
    next(error);
  }
});




module.exports = router;
