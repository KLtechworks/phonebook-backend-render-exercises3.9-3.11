// 3.13: Phonebook database, step 1
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })

  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// 3.19*: Phonebook database, step 7
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 3
      },
      message: props => `Path ${props.value} is shorter than the minimum allowed length(3)`
    }
  },
  // 3.20*: Phonebook database, step 8
  number: {
    type: String,
    minLength: [8, 'Number must have length of 8 or more'],
    required: true,
    validate: {
      validator: function(phone) {
        let i = 0
        while (i < phone.length && phone[i] >= '0' && phone[i] <= '9') i++
        if (i !== 2 && i !== 3) return false
        if (phone[i] !== '-') return false
        i++
        while (i < phone.length) {
          if (phone[i] < '0' || phone[i] > '9') return false
          i++
        }
        return true
      },
      message: props => `'${props.value}' is not correct form,phone number must be like 09-123456.`
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)