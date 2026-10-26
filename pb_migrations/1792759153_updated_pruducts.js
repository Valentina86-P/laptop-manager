/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1371087806")

  // update collection data
  unmarshal({
    "name": "products"
  }, collection)

  // remove field
  collection.fields.removeById("text3402113753")

  // add field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "number2526027604",
    "max": null,
    "min": null,
    "name": "number",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1371087806")

  // update collection data
  unmarshal({
    "name": "pruducts"
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3402113753",
    "max": 0,
    "min": 0,
    "name": "price",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("number2526027604")

  return app.save(collection)
})
