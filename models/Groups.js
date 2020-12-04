const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupsSchema = new Schema({
  leidos: {type: [String]},
  leyendo: {type: [String]},
  porLeer: {type: [String]},
})

const Groups = mongoose.model('Groups', groupsSchema)

module.exports = Groups