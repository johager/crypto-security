const bcrypt = require('bcryptjs')

const users = []

/*
let user = {
  username: username.value,
  email: email.value,
  firstName: firstName.value,
  lastName: lastName.value,
  passHash: asdfadfD
}
*/

module.exports = {
    login: (req, res) => {
      console.log('Logging In User')
      // console.log(req.body)
      const { username, password } = req.body
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
          if (bcrypt.compareSync(password, users[i].passHash)) {
            const userObjCopy = {...users[i]}
            delete userObjCopy.passHash
            res.status(200).send(userObjCopy)
          } else {
            res.status(400).send("Your information is invalid.")
          }
          return
        }
      }
      res.status(400).send("Your information is invalid.")
    },
    register: (req, res) => {
        console.log('Registering User')
        // console.log("init: ", req.body)
        const salt = bcrypt.genSaltSync(5)
        req.body.passHash = bcrypt.hashSync(req.body.password, salt)
        delete req.body.password
        // console.log("finl: ", req.body)
        users.push(req.body)
        res.status(200).send(req.body)
    }
}