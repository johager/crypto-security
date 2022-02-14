/*
This file includes code to encrypt and decrypt a string using a scheme inspired by the Enigma Machine.

It can encode and decode any string that's composed of printable ASCII characters (codes 32 through 126).

The first character is encoded based on the length of the string to encode. Subsequent characters are encoded based on the history of the encoding and the character to be encoded.

The plugboard is used to provide a simple cipher that's applied before the "rotors" during encoding and after the "rotors" during decoding. The plugboard provides two-way substitution:

plugA = 'abc'
plugB = 'xyz'

implies
'a' and 'x' are swapped both directions,
'b' and 'y' are swapped both directions, and
'c' and 'z' are swapped both directions,

or,
'a' -> 'x' and 'x' -> 'a',
'b' -> 'y' and 'y' -> 'b', and
'c' -> 'z' and 'z' -> 'c'.
*/

let shouldEncode = true
let baseShift = 0
let shift = 0
let shouldAdd = true

let plugboard = []
let usePlugboard = false

function setScheme(str, mode, plugA, plugB) {
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

    plugboard = []
    if (plugA && plugB && plugA.length > 0 && plugB.length > 0) {
        // set up a single plugboard to allow a one-way lookup
        // don't use a single-sided plug
        const length = Math.min(plugA.length, plugB.length)
        for (let i = 0; i < length; i++) {
            plugboard[plugA[i]] = plugB[i]
        }
        for (let i = 0; i < length; i++) {
            plugboard[plugB[i]] = plugA[i]
        }
        usePlugboard = true
    } else {
        usePlugboard = false
    }

    // console.log("baseShift:", baseShift)
    // console.log("shouldAdd:", shouldAdd)
    // console.log("    shift:", shift)
}

function charFromPlugboard(char) {
    const plugboardChar = plugboard[char]
    if (plugboardChar) {
        return String(plugboardChar)
    }
    return char
}

function charFromPlugboardPre(char) {
    if (shouldEncode && usePlugboard) {
        return charFromPlugboard(char)
    }
    return char
}

function charFromPlugboardPost(char) {
    if (!shouldEncode && usePlugboard) {
        return charFromPlugboard(char)
    }
    return char
}

// plugA = 'abc'
// plugB = 'xyz'

// function testCharFromPlugboardPre(inp, exp) {
//     const res = charFromPlugboardPre(inp)
//     console.log("testCharToEncode passed:", res === exp, "  inp:", inp, "  res:", res, "  exp:", exp)
// }

// setScheme('', 'encode', plugA, plugB)
// console.log("    plugA:", plugA, "  plugB:", plugB)
// console.log("plugboard:", plugboard)
// testCharFromPlugboardPre('a','x')
// testCharFromPlugboardPre('x','a')
// testCharFromPlugboardPre('m','m')

// function testCharFromPlugboardPost(inp, exp) {
//     shouldEncode = false
//     const res = charFromPlugboardPost(inp)
//     console.log("testCharAfterDecode passed:", res === exp, "  inp:", inp, "  res:", res, "  exp:", exp)
// }

// setScheme('', 'decode', plugA, plugB)
// console.log("    plugA:", plugA, "  plugB:", plugB)
// console.log("plugboard:", plugboard)
// testCharFromPlugboardPost('a','x')
// testCharFromPlugboardPost('x','a')
// testCharFromPlugboardPost('m','m')

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

    shift %= 7

    return code + 32  // return to ASCII code
}

function converted(str, mode, plugA, plugB) {
    setScheme(str, mode, plugA, plugB)

    let output = ''
    for (let index in str) {
        const charPre = charFromPlugboardPre(str[index])
        const codeIn = charPre.charCodeAt(0)  // get ASCII code
        const codeOut = codeFor(codeIn, index)
        const charOut = String.fromCharCode(codeOut)  // get character from ASCII code
        const charPost = charFromPlugboardPost(charOut)
        // console.log("char:", str[index], "  codeIn:", codeIn, "  codeOut:", codeOut, "  charOut:", charOut)
        // console.log("char:", str[index], "  charPre:", charPre, "  codeIn:", codeIn, "  codeOut:", codeOut, "  charOut:", charOut, "  charPost:", charPost)
        output += charPost
    }
    return output
}

function encoded(str, plugA, plugB) {
    return converted(str, 'encode', plugA, plugB)
}

function decoded(str, plugA, plugB) {
    return converted(str, 'decode', plugA, plugB)
}

function test(str, plugA, plugB) {
    console.log("==================")
    console.log("  plugA:", plugA, "  plugB:", plugB)
    console.log("  input:", str)
    // console.log("--- encode ---")
    const encodedStr = encoded(str, plugA, plugB)
    console.log("encoded:", encodedStr)
    // console.log("--- decode ---")
    const decodedStr = decoded(encodedStr, plugA, plugB)
    console.log("decoded:", decodedStr)
    console.log(" passed:", decodedStr === str)
}

// test('a')
// test('ab')
// test('abc')
// test('abcd')
// test('abcde')
// test('abcdef')
// test('abcdefg')
// test('abcdefgh')
// console.log("==================")
// test('12345')
// test('54321')
// test('123456')
// test('654321')
// test('1234567')
// test('7654321')
// console.log("==================")
// test('a')
// test('aa')
// test('aaa')
// test('aaaa')
// test('aaaaa')
// test('aaaaaa')
// test('aaaaaaa')
// test('aaaaaaaa')
// test('aaaaaaaaa')
// test('aaaaaaaaaa')
// console.log("==================")
// test('aabbccdd')
// test('aaabbbcccddd')
// console.log("==================")
// test('Devmountain')
// test('Glib jocks quiz nymph to vex dwarf.')
// test('How vexingly quick daft zebras jump!')
// test('The five boxing wizards jump quickly.')
// test('Pack my box with five dozen liquor jugs.')
// test('The quick brown fox jumps over the lazy dog.')
// test('Someone must have slandered Josef K., for one morning, without having done anything truly wrong, he was arrested.')
// test('It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.')
// console.log("==================")

// console.log("====================================")
// test('a')
// test('a','abcijk','xyzlmn')
// test('abcdefgh')
// test('abcdefgh','abcijk','xyzlmn')
// test('abcdexyz')
// test('abcdexyz','abcijk','xyzlmn')
test('The quick brown fox jumps over the lazy dog.')
test('The quick brown fox jumps over the lazy dog.','abcijk','xyzlmn')
test('The quick brown fox jumps over the lazy dog.','lmnstu','abcxyz')

// console.log("====================================")
// test('a','abcijk','xyzlmn')
// test('ab','abcijk','xyzlmn')
// test('abc','abcijk','xyzlmn')
// test('abcd','abcijk','xyzlmn')
// test('abcde','abcijk','xyzlmn')
// test('abcdef','abcijk','xyzlmn')
// test('abcdefg','abcijk','xyzlmn')
// test('abcdefgh','abcijk','xyzlmn')
// console.log("==================")
// test('12345','abcijk','xyzlmn')
// test('54321','abcijk','xyzlmn')
// test('123456','abcijk','xyzlmn')
// test('654321','abcijk','xyzlmn')
// test('1234567','abcijk','xyzlmn')
// test('7654321','abcijk','xyzlmn')
// console.log("==================")
// test('a','abcijk','xyzlmn')
// test('aa','abcijk','xyzlmn')
// test('aaa','abcijk','xyzlmn')
// test('aaaa','abcijk','xyzlmn')
// test('aaaaa','abcijk','xyzlmn')
// test('aaaaaa','abcijk','xyzlmn')
// test('aaaaaaa','abcijk','xyzlmn')
// test('aaaaaaaa','abcijk','xyzlmn')
// test('aaaaaaaaa','abcijk','xyzlmn')
// test('aaaaaaaaaa','abcijk','xyzlmn')
// console.log("==================")
// test('aabbccdd','abcijk','xyzlmn')
// test('aaabbbcccddd','abcijk','xyzlmn')
// console.log("==================")
// test('Devmountain','abcijk','xyzlmn')
// test('Glib jocks quiz nymph to vex dwarf.','abcijk','xyzlmn')
// test('How vexingly quick daft zebras jump!','abcijk','xyzlmn')
// test('The five boxing wizards jump quickly.','abcijk','xyzlmn')
// test('Pack my box with five dozen liquor jugs.','abcijk','xyzlmn')
// test('The quick brown fox jumps over the lazy dog.','abcijk','xyzlmn')
// test('Someone must have slandered Josef K., for one morning, without having done anything truly wrong, he was arrested.','abcijk','xyzlmn')
// test('It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.','abcijk','xyzlmn')
// console.log("==================")