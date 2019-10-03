import smsSender from './shared/smsSender'
import emailSender from './shared/emailSender'
import telegramSender from './shared/telegramSender'

export default ({ events }) => {
  return (value, oldValue) => {
    const context = await event.preSend ? event.preSend(value, oldValue) || {} : {}

    return Promise.all(events
      .filter(event => event.condition(value, oldValue))
      .map(async event => {
        return (event.channels || []).map(channel => {
          switch(channel.type) {
            case 'sms': {
              return smsSender(
                channel.message({ item: value, ...context }), 
                channel.recipients({ item: value, ...context })
              )
            }
            case 'email': {
              return emailSender({
                subject: channel.subject({ item: value, ...context }), 
                emails: channel.recipients({ item: value, ...context }),
                html: channel.message({ item: value, ...context }),
              })
            }
            case 'telegram': {
              return telegramSender({
                ids: channel.recipients({ item: value, ...context }),
                message: channel.message({ item: value, ...context }),
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
}

/**
 * 
 
 */