const { filter, orderBy, values } = require('lodash')

const Pizza = require('../models/pizza')
const ImageStore = require('../lib/imageStore')
const PizzaStore = require('./pizzaStore')

const pizzas = {}

async function create (name, toppings, img, username) {
  const imgUrl = await ImageStore.save(name.replace(/ /g, '-'), img)
  const pizza = new Pizza(name, toppings, imgUrl, username)
  return PizzaStore.create(prepPizzaForDb(pizza));
  //pizzas[pizza.id] = pizza
  //return pizza
}

// for mocks that don't need pizza images saved
function batchImport (name, toppings, imgUrl, username) {
  const pizza = new Pizza(name, toppings, imgUrl, username)
  return PizzaStore.create(prepPizzaForDb(pizza));
  //pizzas[pizza.id] = pizza
}

async function getForUser (username) {
  return PizzaStore.findAll({
    where: {
      username: username
    },
    raw: true
  }).then(debriefPizzaFromDb)

  // const userPizzas = filter(pizzas, pizza =>
  //   pizza.username === username
  // )
  // return userPizzas
}

async function getRecent () {
  return PizzaStore.findAll({
    order: [['created', 'DESC']],
    limit: 4,
    raw: true
  }).then(debriefPizzaFromDb)

  // const recentPizzas = orderBy(pizzas, ['created'], ['desc'])
  // return values(recentPizzas).splice(0, 5)
}

async function get (pizzaId) {
  return PizzaStore.findOne({
    where: {
      id: pizzaId
    },
    raw: true
  }).then(debriefPizzaFromDb)

  // if (!pizzas[pizzaId]) throw new Error('Pizza not found')
  // return pizzas[pizzaId]
}

function prepPizzaForDb (pizza) {
  return {
    ...pizza,
    toppings: JSON.stringify(pizza.toppings)
  }
}

function debriefPizzaFromDb (pizza) {
  return {
    ...pizza,
    toppings: JSON.parse(pizza.toppings)
  }
}

function debriefPizzasFromDb (pizzas) {
  return pizzas.map(debriefPizzaFromDb)
}

module.exports = {
  batchImport,
  create,
  get,
  getForUser,
  getRecent
}
