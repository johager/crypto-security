const alpha  = `abcdefghijklmenopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,'"!?`
const cypher = ` .,'"!?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmenopqrstuvwxyz`

function encrypt(str) {
    let output = ''
    for(let char of str){
        // console.log("char:", char, " index:", alpha.indexOf(char))
        output += cypher[alpha.indexOf(char)]
    }
    return output
}

function decrypt(str) {
    let output = ''
    for(let char of str){
        output += alpha[cypher.indexOf(char)]
    }
    return output
}

let str = 'I love cryptography!'
console.log(`str: '${str}'`)

let encrypted = encrypt('I love cryptography!')
console.log(`enc: '${encrypted}'`)

let decrypted = decrypt(encrypted)
console.log(`dec: '${decrypted}'`)