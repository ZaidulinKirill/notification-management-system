import smsSender from './shared/smsSender'
import emailSender from './shared/emailSender'
import telegramSender from './shared/telegramSender'

export default ({ events }) => {
  return (value, oldValue) => Promise.all(events
    .filter(event => event.condition(value, oldValue))
    .map(async event => {
      event.context = await event.preSend ? event.preSend(value, oldValue) || {} : {}

      return (event.channels || []).map(channel => {
        switch(channel.type) {
          case 'sms': {
            return smsSender(
              channel.message({ item: value, ...event.context }), 
              channel.recipients({ item: value, ...event.context })
            )
          }
          case 'email': {
            return emailSender({
              subject: channel.subject({ item: value, ...event.context }), 
              emails: channel.recipients({ item: value, ...event.context }),
              html: channel.message({ item: value, ...event.context }),
            })
          }
          case 'telegram': {
            return telegramSender({
              ids: channel.recipients({ item: value, ...event.context }),
              message: channel.message({ item: value, ...event.context }),
            })
          }
          default: {
            throw new Error('Not implemented')
          }
        }
      })
    })
  )
}

/**
 * 
 
 */