import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  prepareAnimalResponse,
} from './base'

import {
  ActivityBelongsToAnimal,
  ActivityBelongsToEvent,
  ActivityBelongsToPlace,
  ActivityBelongsToResource,
} from '../database/associations'

import Activity from '../models/activity'

function prepareResponse(conversation) {
  const response = conversation.toJSON()

  if (response.animal) {
    response.animal = prepareAnimalResponse(response.animal)
  }

  let item
  let itemType

  if (response.resource) {
    item = response.resource
    itemType = 'resource'
  } else if (response.event) {
    item = response.event
    itemType = 'event'
  } else if (response.place) {
    item = response.place
    itemType = 'place'
  }

  const object = item ? Object.assign({}, {
    id: item.id,
    slug: item.slug,
    title: item.title,
    type: itemType,
  }) : null

  const { id, createdAt, type, animal, objectTitle } = response

  return Object.assign({}, {
    animal,
    createdAt,
    id,
    object,
    objectTitle,
    type,
  })
}

function prepareResponseAll(rows) {
  return rows.map(row => prepareResponse(row))
}

export default {
  findAll: (req, res, next) => {
    const {
      limit = DEFAULT_LIMIT,
      offset = DEFAULT_OFFSET,
    } = req.query

    return Activity.findAndCountAll({
      include: [
        ActivityBelongsToAnimal,
        ActivityBelongsToEvent,
        ActivityBelongsToPlace,
        ActivityBelongsToResource,
      ],
      limit,
      offset,
      order: [
        ['createdAt', 'DESC'],
      ],
    })
      .then(result => {
        res.json({
          data: prepareResponseAll(result.rows),
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          total: result.count,
        })
      })
      .catch(err => next(err))
  },
}
