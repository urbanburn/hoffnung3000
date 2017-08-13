import dateFns from 'date-fns'
import httpStatus from 'http-status'

import {
  ConversationBelongsToManyAnimal,
  MeetingBelongsToConversation,
  PlaceBelongsToAnimal,
} from '../database/associations'

import Animal from '../models/animal'
import Conversation from '../models/conversation'
import Meeting from '../models/meeting'
import Message from '../models/message'
import Place from '../models/place'
import Slot from '../models/slot'

import {
  addCreateMeetingActivity,
  addJoinMeetingActivity,
} from '../services/activity'

import { APIError } from '../helpers/errors'
import { formatEventTime } from '../../common/utils/dateFormat'
import { isInFestivalRange } from '../../common/utils/slots'
import { translate } from '../../common/services/i18n'

const DURATION_HOURS = 1
const DATE_MINIMUM_TO_NOW_HOURS = 1
const ANY_DATE_FROM_NOW_MIN_HOURS = 2

function createConversation(place, from, to, userId) {
  return new Promise((resolve, reject) => {
    Animal.create({
      userId,
    }, {
      returning: true,
    })
      .then(sendingAnimal => {
        const animalId = sendingAnimal.id
        const date = formatEventTime(from, to)
        const placeTitle = place.title

        const title = translate('api.meeting.createMessageTitle', {
          date,
          placeTitle,
        })

        const text = translate('api.meeting.createMessageText', {
          date,
          name: sendingAnimal.name,
          placeTitle,
        })

        // create the new conversation
        return Conversation.create({
          title,
          animalId,
        })
          .then(conversation => {
            return conversation.setAnimals([sendingAnimal])
              .then(() => {
                // create first message in conversation
                return Message.create({
                  animalId,
                  conversationId: conversation.id,
                  text,
                })
              })
              .then(() => {
                resolve({
                  conversation,
                  animalId,
                })
              })
          })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function getRandomPlace(from, to) {
  return new Promise((resolve, reject) => {
    Place.findAll({
      where: {
        isPublic: true,
      },
      include: [
        PlaceBelongsToAnimal, {
          model: Slot,
          as: 'slots',
          required: false,
          where: {
            $and: [{
              isDisabled: true,
            }, {
              from: {
                $lt: to,
              },
            }, {
              to: {
                $gt: from,
              },
            }],
          },
        },
      ],
    })
      .then(places => {
        const usablePlaces = places.filter(place => {
          return place.slots.length === 0
        })

        if (usablePlaces.length === 0) {
          reject(
            new APIError(
              translate('api.errors.meeting.noPlaceFound'),
              httpStatus.PRECONDITION_FAILED
            )
          )
        } else {
          resolve(usablePlaces[Math.floor(Math.random() * usablePlaces.length)])
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

function createMeeting(userId, from, to) {
  return getRandomPlace(from, to)
    .then(place => {
      const placeId = place.id

      return createConversation(place, from, to, userId)
        .then(data => {
          const { conversation, animalId } = data
          const conversationId = conversation.id

          return Meeting.create({
            conversationId,
            from,
            placeId,
            to,
          })
            .then(() => {
              return addCreateMeetingActivity({
                animalId,
                place,
                userId,
              })
            })
        })
    })
}

function joinMeeting(conversation, userId) {
  return Animal.create({
    userId,
  }, {
    returning: true,
  })
    .then(joiningAnimal => {
      const text = translate('api.meeting.joinMessageText', {
        name: joiningAnimal.name,
      })

      return conversation.addAnimal(joiningAnimal)
        .then(() => {
          // create message in conversation
          return Message.create({
            animalId: joiningAnimal.id,
            conversationId: conversation.id,
            text,
          })
            .then(() => {
              return addJoinMeetingActivity({
                joiningAnimal,
                receivingAnimals: conversation.animals,
              })
            })
        })
    })
}

export default {
  requestRandomMeeting: (req, res, next) => {
    const date = req.body.date
    const where = {}
    let from

    if (date) {
      // meeting was requested with a date
      const isValidDate = (
        process.env.NODE_ENV === 'production' ? isInFestivalRange(date) : true
      )

      const tresholdDate = dateFns.startOfHour(
        dateFns.addHours(new Date(), DATE_MINIMUM_TO_NOW_HOURS)
      )

      if (!isValidDate || dateFns.isBefore(date, tresholdDate)) {
        next(
          new APIError(
            translate('api.errors.meeting.invalidDate'),
            httpStatus.BAD_REQUEST
          )
        )
        return null
      }

      from = dateFns.startOfHour(date)
      where.from = from
    } else {
      // meeting was requested with any date
      from = dateFns.startOfHour(
        dateFns.addHours(new Date(), ANY_DATE_FROM_NOW_MIN_HOURS)
      )
      where.from = {
        $gte: from,
      }
    }

    const to = dateFns.addHours(from, DURATION_HOURS)

    return Meeting.findOne({
      where,
      include: [{
        association: MeetingBelongsToConversation,
        include: [{
          association: ConversationBelongsToManyAnimal,
        }],
      }],
    })
      .then(meeting => {
        if (!meeting) {
          return createMeeting(req.user.id, from, to)
        }

        const isAlreadyExisting = meeting.conversation.animals.find(animal => {
          return animal.userId === req.user.id
        })

        if (isAlreadyExisting) {
          throw new APIError(
            translate('api.errors.meeting.alreadyJoined'),
            httpStatus.BAD_REQUEST
          )
        }

        return joinMeeting(meeting.conversation, req.user.id)
      })
      .then(() => res.json({ status: 'ok' }))
      .catch(err => next(err))
  },
}
