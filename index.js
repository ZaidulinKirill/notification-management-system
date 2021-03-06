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
              sender: channel.sender 
                ? channel.sender({ item: value,  oldItem: oldValue, ...event.context })
                : null,
              login: channel.login 
                ? channel.login({ item: value,  oldItem: oldValue, ...event.context })
                : null,
              password: channel.password 
                ? channel.password({ item: value,  oldItem: oldValue, ...event.context })
                : null,
              files: channel.files 
                ? channel.files({ item: value,  oldItem: oldValue, ...event.context })
                : null
            })
          }
          case 'telegram': {
            return telegramSender({
              ids: channel.recipients({ item: value,  oldItem: oldValue, ...event.context }),
              message: channel.message({ item: value,  oldItem: oldValue, ...event.context }),
              photo: channel.photo
                ? channel.photo({ item: value,  oldItem: oldValue, ...event.context }) 
                : null,
              document: channel.document 
                ? channel.document({ item: value,  oldItem: oldValue, ...event.context })
                : null,
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