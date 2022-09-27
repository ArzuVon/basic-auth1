'use strict';

require('dotenv').config();
const DATABASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'sqlite::memory:'
    : process.env.DATABASE_URL;
const { Sequelize, DataTypes } = require('sequelize');

const Collection = require('./data-collection.js');
const foodSchema = require('./food/model.js');
const clothesSchema = require('./clothes/model.js');
const recipeSchema = require('./recipe/model.js');
const foodRecipeSchema = require('./foodRecipe/model.js');
const userSchema = require('./users/model.js');

const baseOptions =
  process.env.NODE_ENV === 'dev'
    ? {
      logQueryParameters: true,
      logging: (...args) => console.log(...args),
    }
    : {
      logging: () => {},
    };

const sequelizeOptions = {
  ...baseOptions,
  ...(process.env.NODE_ENV === 'production'
    ? {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }
    : {}),
};

// turn schemas into Sequelize models
const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);
const FoodModel = foodSchema(sequelize, DataTypes);
const ClothesModel = clothesSchema(sequelize, DataTypes);
const RecipeModel = recipeSchema(sequelize, DataTypes);
const FoodRecipeModel = foodRecipeSchema(sequelize, DataTypes);
const UserModel = userSchema(sequelize, DataTypes);

// create our Collections and associations
const FoodCollection = new Collection(FoodModel);
const ClothesCollection = new Collection(ClothesModel);
const RecipeCollection = new Collection(RecipeModel);
FoodCollection.belongsToManyThrough(RecipeCollection, FoodRecipeModel);
RecipeCollection.belongsToManyThrough(FoodCollection, FoodRecipeModel);

const UsersCollection = new Collection(UserModel);

module.exports = {
  db: sequelize,
  Food: FoodCollection,
  Clothes: ClothesCollection,
  Recipe: RecipeCollection,
  Users: UsersCollection,
};
