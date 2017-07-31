import { prepareAnimalResponse } from '../controllers/base'

import {
  ActivityBelongsToAnimal,
  ActivityBelongsToEvent,
  ActivityBelongsToPlace,
  ActivityBelongsToResource,
  ActivityRequestBelongsToEvent,
} from '../database/associations'

import Activity from '../models/activity'

function prepareResponse(conversation) {
  const response = conversation.toJSON()

  if (response.animal) {
    response.animal = prepareAnimalResponse(response.animal)
  }

  let item

  if (response.resource) {
    item = response.resource
  } else if (response.event) {
    item = response.event
  } else if (response.place) {
    item = response.place
  }

  const object = item ? Object.assign({}, {
    id: item.id,
    slug: item.slug,
    title: item.title,
  }) : null

  const event = response.requestedEvent ? Object.assign({}, {
    id: response.requestedEvent.id,
    slug: response.requestedEvent.slug,
    title: response.requestedEvent.title,
  }) : null

  const { id, createdAt, type, animal, objectTitle, objectType } = response

  return Object.assign({}, {
    animal,
    createdAt,
    event,
    id,
    object,
    objectTitle,
    objectType,
    type,
  })
}

function prepareResponseAll(rows) {
  return rows.map(row => prepareResponse(row))
}

export function getMyActivities(limit, offset) {
  return new Promise((resolve, reject) => {
    Activity.findAndCountAll({
      include: [
        ActivityBelongsToAnimal,
        ActivityBelongsToEvent,
        ActivityBelongsToPlace,
        ActivityBelongsToResource,
        ActivityRequestBelongsToEvent,
      ],
      limit,
      offset,
      order: [
        ['createdAt', 'DESC'],
      ],
    })
      .then(result => {
        resolve({
          data: prepareResponseAll(result.rows),
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          total: result.count,
        })
      })
      .catch(err => reject(err))
  })
}
