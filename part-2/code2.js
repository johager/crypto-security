/*
This file includes code to encrypt and decrypt a string using a scheme inspired by the Enigma Machine.

It can encode and decode any string that's composed of printable ASCII characters (codes 32 through 126).

The first character is endocded based on the length of the string to encode. Subsequent characters are encoded based on the history of the encoding and the character to be encoded.
*/

let shouldEncode = true
let baseShift = 0
let shift = 0
let shouldAdd = true

function setScheme(str, mode) {
    shouldEncode = mode === 'encode'
    const shift0 = str.length % 7
    
    if (str.length % 2) {
        baseShift = shift0 + 5
        shift = shift0 + 3
        shouldAdd = shouldEncode
    } else {
        baseShift = shift0 + 3
        shift = shift0 + 5
        shouldAdd = !shouldEncode
    }

    // console.log("baseShift:", baseShift)
    // console.log("shouldAdd:", shouldAdd)
    // console.log("    shift:", shift)
}

function codeFor(codeIn, index) {
    let code = codeIn - 32  // shift to a zero-based reference of available ASCII codes

    if (index > 0 && index % baseShift === 0) {
        shift = baseShift
    } else {
        shift += 11
        shouldAdd = !shouldAdd
    }

    if (shouldAdd) {
        code += shift
        if (code > 93) {
            code -= 94
        }
    } else {
        code -= shift
        if (code < 0) {
            code += 94
        }
    }

    if (shouldEncode) {
        shift = code
    } else {
        shift = codeIn - 32
    }

    return code + 32  // return to ASCII code
}

function converted(str, mode) {
    setScheme(str, mode)

    let output = ''
    for (let index in str) {
        const codeIn = str[index].charCodeAt(0)  // get ASCII code
        const codeOut = codeFor(codeIn, index)
        const charOut = String.fromCharCode(codeOut)  // get character from ASCII code
        // console.log("char:", str[index], "  codeIn:", codeIn, "  codeOut:", codeOut, "  charOut:", charOut)
        output += charOut
    }
    return output
}

function encoded(str) {
    return converted(str, 'encode')
}

function decoded(str) {
    return converted(str, 'decode')
}

function test(str) {
    console.log("==================")
    console.log("  input:", str)
    // console.log("--- encode ---")
    const encodedStr = encoded(str)
    console.log("encoded:", encodedStr)
    // console.log("--- decode ---")
    const decodedStr = decoded(encodedStr)
    console.log("decoded:", decodedStr)
    console.log(" passed:", decodedStr === str)
}

test('a')
test('ab')
test('abc')
test('abcd')
test('abcde')
test('abcdef')
test('abcdefg')
test('abcdefgh')
console.log("==================")
test('12345')
test('54321')
test('123456')
test('654321')
test('1234567')
test('7654321')
console.log("==================")
test('a')
test('aa')
test('aaa')
test('aaaa')
test('aaaaa')
test('aaaaaa')
test('aaaaaaa')
test('aaaaaaaa')
test('aaaaaaaaa')
test('aaaaaaaaaa')
console.log("==================")
test('aabbccdd')
test('aaabbbcccddd')
console.log("==================")
test('Devmountain')
test('Glib jocks quiz nymph to vex dwarf.')
test('How vexingly quick daft zebras jump!')
test('The five boxing wizards jump quickly.')
test('Pack my box with five dozen liquor jugs.')
test('The quick brown fox jumps over the lazy dog.')
test('Someone must have slandered Josef K., for one morning, without having done anything truly wrong, he was arrested.')
test('It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.')
console.log("==================")