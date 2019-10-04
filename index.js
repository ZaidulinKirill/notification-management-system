import smsSender from './shared/smsSender'
import emailSender from './shared/emailSender'
import telegramSender from './shared/telegramSender'

export default ({ events }) => {
  return (value, oldValue) => Promise.all(events
    .map(async event => {
      event.context = event.preFilter 
        ? await event.preFilter({ item: value,  oldItem: oldValue }) || {} 
        : {}
      
      if (!event.condition({ item: value,  oldItem: oldValue, ...event.context })) {
        return null
      }

      event.context = event.preSend ? 
        await event.preSend({ item: value,  oldItem: oldValue, ...event.context }) 
        : event.context

      return (event.channels || []).map(channel => {
        switch(channel.type) {
          case 'sms': {
            return smsSender(
              channel.message({ item: value,  oldItem: oldValue, ...event.context }), 
              channel.recipients({ item: value,  oldItem: oldValue, ...event.context })
            )
          }
          case 'email': {
            return emailSender({
              subject: channel.subject({ item: value,  oldItem: oldValue, ...event.context }), 
              emails: channel.recipients({ item: value,  oldItem: oldValue, ...event.context }),
              html: channel.message({ item: value,  oldItem: oldValue, ...event.context }),
            })
          }
          case 'telegram': {
            return telegramSender({
              ids: channel.recipients({ item: value,  oldItem: oldValue, ...event.context }),
              message: channel.message({ item: value,  oldItem: oldValue, ...event.context }),
              photo: event.photo,
              document: event.document,
            })
          }
          default: {
            throw new Error('Not implemented')
          }
        }
      })
    })
    .filter(x => !!x)
  )
}