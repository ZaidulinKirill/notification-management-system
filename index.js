import smsSender from './shared/smsSender'
import emailSender from './shared/emailSender'
import telegramSender from './shared/telegramSender'

export default ({events}) => {
  return (value, oldValue) => {
    await Promise.all(events
      .filter(event => event.condition(value, oldValue))
      .map(event => {
        return (event.channels || []).map(channel => {
          switch(channel.type) {
            case 'sms': {
              return smsSender(channel.message(value), channel.recipients)
            }
            case 'email': {
              return emailSender({
                subject: channel.subject, 
                emails: channel.recipients,
                html: channel.message(value),
              })
            }
            case 'telegram': {
              return telegramSender({
                ids: channel.recipients,
                message: channel.message(value),
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