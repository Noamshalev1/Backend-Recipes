var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * Applay search - by query and insert to DB (for last search)
 */
router.post("/search", async (req, res, next) => {
  try {
    const username = req.session.username;
    console.log("Hi I'm POST")
    let recipes = await recipes_utils.searchRecipe(req.body);
    const searchQuery = req.query.query;
    const results = await DButils.execQuery(`SELECT * FROM lastsearch WHERE username ='${username}'`);
    if (results.length > 0) {
        // User exists, so update the search query
        console.log("Update " + searchQuery)
        await DButils.execQuery(`UPDATE lastsearch SET searchQuery='${searchQuery}' WHERE username='${username}'`);

    } else {
        // User does not exist, so insert a new record
        console.log("Insert " + searchQuery)
        await DButils.execQuery(`INSERT INTO lastsearch VALUES ('${searchQuery}', '${username}')`);
    }
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
