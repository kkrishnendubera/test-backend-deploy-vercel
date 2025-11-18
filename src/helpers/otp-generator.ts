import { randomInt } from 'crypto'

const digits = '0123456789'
const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz'
const upperCaseAlphabets = lowerCaseAlphabets.toUpperCase()
const specialChars = '#!&@'

type GenerateOptions = {
    digits?: boolean;
    lowerCaseAlphabets?: boolean;
    upperCaseAlphabets?: boolean;
    specialChars?: boolean;
};

const generate = (length: number = 10, options: GenerateOptions = {}): string => {
    const generateOptions: GenerateOptions = {
        digits: options.digits ?? true,
        lowerCaseAlphabets: options.lowerCaseAlphabets ?? true,
        upperCaseAlphabets: options.upperCaseAlphabets ?? true,
        specialChars: options.specialChars ?? true,
    };

    const allowsChars =
        (generateOptions.digits ? digits : '') +
        (generateOptions.lowerCaseAlphabets ? lowerCaseAlphabets : '') +
        (generateOptions.upperCaseAlphabets ? upperCaseAlphabets : '') +
        (generateOptions.specialChars ? specialChars : '');

    let password = '';
    while (password.length < length) {
        const charIndex = randomInt(0, allowsChars.length);
        if (password.length === 0 && generateOptions.digits === true && allowsChars[charIndex] === '0') {
            continue;
        }
        password += allowsChars[charIndex];
    }

    return password;
};

export default {
    generate
};
