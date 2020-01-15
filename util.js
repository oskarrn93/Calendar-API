import { default as iCalGenerator } from 'ical-generator'

const ONE_HOUR_IN_MS = 3600000
const TWO_HOURS_IN_MS = 7200000
const THREE_HOURS_IN_MS = 10800000

export const getCollectionFromDatabase = async (db, collectionName) => {
  const collection = db.handler.collection(collectionName)
  try {
    const result = await collection.find({}).toArray()
    return result
  } catch (error) {
    logger.log(error)
    next(error)
  }
}

export const getNBA = async db => {
  try {
    const listOfGames = await getCollectionFromDatabase(db, 'nba')
    console.log('listOfGames', listOfGames)

    const iCal = iCalGenerator({
      domain: 'calendar.oskarrosen.com',
      name: 'NBA Games',
      url: 'https://calendar.oskarrosen.com/nba',
      prodId: '//Oskar Rosen//NBA Games//EN',
      ttl: 3600,
      timezone: 'Europe/Berlin',
    })

    listOfGames.forEach(element => {
      const startTime = new Date(element.timestamp)
      iCal.createEvent({
        start: startTime,
        end: new Date(startTime.getTime() + THREE_HOURS_IN_MS),
        summary: element.away_team + ' - ' + element.home_team,
        description: element.away_team + ' - ' + element.home_team,
        location: element.location,
        url: 'http://stats.nba.com/schedule/',
        uid: 'nba-games-' + element._id,
      })
    })

    return iCal
  } catch (error) {
    throw new Error(error)
  }
}

export const getFootball = async db => {
  try {
    const listOfGames = await getCollectionFromDatabase(db, 'football')
    console.log('listOfGames', listOfGames)

    const iCal = iCalGenerator({
      domain: 'calendar.oskarrosen.com',
      name: 'Football Games',
      url: 'https://calendar.oskarrosen.com/football',
      prodId: '//Oskar Rosen//Football Games//EN',
      ttl: 3600,
      timezone: 'Europe/Berlin',
    })

    listOfGames.forEach(element => {
      if (isNaN(element.date)) return

      const start = new Date(element.date)
      const end = new Date(start.getTime() + TWO_HOURS_IN_MS)

      iCal.createEvent({
        start: start,
        end: end,
        summary: element.title,
        description: element.channels,
        uid: 'football-games-' + element._id,
      })
    })

    return iCal
  } catch (error) {
    throw new Error(error)
  }
}
