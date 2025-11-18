# Password Generator Utility

This utility provides a function to generate random passwords based on specified criteria.

## Description

The `generate` function allows you to create passwords of a given length, including or excluding different character sets (digits, lowercase alphabets, uppercase alphabets, and special characters).  It uses the `crypto` module's `randomInt` for generating cryptographically secure random numbers.

## Usage

```typescript
import passwordGenerator from './password-generator'; // Path to your utility file

// Generate a password with default options (digits, lowercase, uppercase, and special chars) and length 10
const password = passwordGenerator.generate(); 
console.log(password); // Output: e.g., "aB3!cD5hJk"

// Generate a password with only digits and lowercase alphabets, length 12
const numericPassword = passwordGenerator.generate(12, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: false, specialChars: false });
console.log(numericPassword); // Output: e.g., "7b3d9f1a2c5e"

// Generate a password with all character types, length 15
const strongPassword = passwordGenerator.generate(15, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: true });
console.log(strongPassword); // Output: e.g., "pA5#qW8!zX2&cD"