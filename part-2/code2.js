/*
This file includes code to encrypt and decrypt a string using a scheme inspired by the Enigma Machine.

It can encode and decode any string that's composed of printable ASCII characters (codes 32 through 126).

The order that characters are encoded is based on the length of the string to encode.

The first character that's encoded always has the same encoding, and subsequent characters are encoded based on the history of the encoding and the character to be encoded.

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

let count = 1

function setScheme(str, mode, plugA, plugB) {
    shouldEncode = mode === 'encode'
    const shift0 = str.length % 7
    count = 1
    
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

function codeFor(codeIn) {
    let code = codeIn - 32  // shift to a zero-based reference of available ASCII codes

    if (count % baseShift === 0) {
        shift = baseShift
        // shouldAdd = !shouldAdd
    } else {
        shift += 3
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

function charFor(str, index) {
    const charPre = charFromPlugboardPre(str[index])
    const codeIn = charPre.charCodeAt(0)  // get ASCII code
    const codeOut = codeFor(codeIn)
    const charOut = String.fromCharCode(codeOut)  // get character from ASCII code
    const charPost = charFromPlugboardPost(charOut)
    // console.log("char:", str[index], "  codeIn:", codeIn, "  codeOut:", codeOut, "  charOut:", charOut)
    // console.log("char:", str[index], "  charPre:", charPre, "  codeIn:", codeIn, "  codeOut:", codeOut, "  charOut:", charOut, "  charPost:", charPost)
    return charPost
}

// function converted(str, mode, plugA, plugB) {
//     setScheme(str, mode, plugA, plugB)

//     let output = ''
//     for (let index in str) {
//         output += charFor(str, +index)
//         count++
//     }
//     return output
// }

function reverse(str) {
    return str.split('').reverse().join('')
}

function converted(str, mode, plugA, plugB) {
    setScheme(str, mode, plugA, plugB)

    let mod4 = 0  // this controls the order that the characters are converted

    switch (str.length) {
        case 0:
            return str
        case 1:
            // console.log('1: convert the single character')
            const index = 0
            // console.log('index:', index)
            return charFor(str, index)
        case 2:
            // do reverse
            // console.log('2: do mod4 = 1: first odd, reverse')
            mod4 = 1
            break
        default:
            mod4 = str.length % 4
    }

    let outputF = ''
    let outputR = ''

    switch (mod4) {
        case 0:
            // first even: forward from center, reverse from center
            // console.log('mod 0: first even: forward from center, reverse from center')
            for (let index = (str.length) / 2; index < str.length; index++) {
                // console.log('index:', index)
                outputF += charFor(str, index)
                count++
            }
            for (let index = (str.length) / 2 - 1; index > -1; index--) {
                // console.log('index:', index)
                outputR += charFor(str, index)
                count++
            }
            return reverse(outputR) + outputF
        case 1:
            // first odd: reverse
            // console.log('mod 1: first odd: reverse')
            for (let index = str.length - 1; index > -1; index--) {
                // console.log('index:', index)
                outputR += charFor(str, index)
                count++
            }
            return reverse(outputR)
        case 2:
            // second even: reverse from center, forward from center
            // console.log('mod 2: second even: reverse from center, forward from center')
            for (let index = (str.length) / 2 - 1; index > -1; index--) {
                // console.log('index:', index)
                outputR += charFor(str, index)
                count++
            }
            for (let index = (str.length) / 2; index < str.length; index++) {
                // console.log('index:', index)
                outputF += charFor(str, index)
                count++
            }
            return reverse(outputR) + outputF
        case 3:
            // second odd: forward
            // console.log('mod 3: second odd: forward')
            for (let index in str) {
                // console.log('index:', +index)
                outputF += charFor(str, +index)
                count++
            }
            return outputF
    }
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

// function mode(str) {
//     console.log(`=== ${str} ===`)
//     const onlyShowScheme = true
//     let mod4 = 0

//     switch (str.length) {
//         case 0:
//             return str
//         case 1:
//             console.log('1: convert the single character')
//             if (onlyShowScheme) {
//                 return
//             }
//             const index = 0
//             // console.log('index:', index)
//         case 2:
//             // do reverse
//             console.log('2: do mod4 = 1: first odd, reverse')
//             mod4 = 1
//             break
//         default:
//             mod4 = str.length % 4
//     }

//     switch (mod4) {
//         case 0:
//             console.log('mod 0: first even, forward from center, reverse from center')
//             if (onlyShowScheme) {
//                 return
//             }
//             for (let index = (str.length) / 2; index < str.length; index++) {
//                 console.log('index:', index)
//             }
//             for (let index = (str.length) / 2 - 1; index > -1; index--) {
//                 console.log('index:', index)
//             }
//             break
//         case 1:
//             console.log('mod 1: first odd, reverse')
//             if (onlyShowScheme) {
//                 return
//             }
//             for (let index = str.length - 1; index > -1; index--) {
//                 console.log('index:', index)
//             }
//             break
//         case 2:
//             console.log('mod 2: second even, reverse from center, forward from center')
//             if (onlyShowScheme) {
//                 return
//             }
//             for (let index = (str.length) / 2 - 1; index > -1; index--) {
//                 console.log('index:', index)
//             }
//             for (let index = (str.length) / 2; index < str.length; index++) {
//                 console.log('index:', index)
//             }
//             break
//         case 3:
//             console.log('mod 3: second odd, forward')
//             if (onlyShowScheme) {
//                 return
//             }
//             for (let index in str) {
//                 console.log('index:', +index)
//             }
//             break
//     }
// }

// mode('0')
// mode('01')
// mode('012')
// mode('0123')
// mode('01234')
// mode('012345')
// mode('0123456')
// mode('01234567')