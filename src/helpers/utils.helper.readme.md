# Utility Functions

This module provides a collection of utility functions for various tasks, including file manipulation, asynchronous operations, data validation, string manipulation, and cryptography.

## Description

This module contains a set of helper functions designed to simplify common tasks in JavaScript/TypeScript development.  These functions cover a range of functionalities, making them useful in various parts of an application.

## Functions

### `normalizeFilename(str: string): string`

Normalizes a filename by replacing spaces with underscores, truncating the name to a maximum of 20 characters (excluding the extension), and prepending a timestamp to ensure uniqueness.

*   **`str`:** The original filename.
*   **Returns:** The normalized filename (e.g., `1678886400000_truncated_name.txt`).
*   **Throws:** An error if the file extension cannot be determined.

### `safeAsync<T>(promise: Promise<T>): Promise<[Error | null, T | null]>`

A utility function to safely handle asynchronous operations using a `try...catch` block.  It returns a tuple where the first element is an error (or `null` if successful) and the second element is the result (or `null` if an error occurred).

*   **`promise`:** The promise to be handled.
*   **Returns:** A promise that resolves to a tuple `[Error | null, T | null]`.

### `isNumber(value: any): boolean`

Checks if a value is a number.  It handles `NaN` and other non-numeric values.

*   **`value`:** The value to check.
*   **Returns:** `true` if the value is a number, `false` otherwise.

### `sleep(ms: number): Promise<void>`

Pauses execution for a specified number of milliseconds.

*   **`ms`:** The number of milliseconds to sleep.
*   **Returns:** A promise that resolves after the specified time.

### `capitalizeFirstLetter(str: string): string`

Capitalizes the first letter of a string.

*   **`str`:** The input string.
*   **Returns:** The string with the first letter capitalized.

### `throttle(func: (...args) => void, limit: number): Function`

Creates a throttled version of a function, limiting its execution rate.

*   **`func`:** The function to throttle.
*   **`limit`:** The time limit in milliseconds.
*   **Returns:** The throttled function.

### `debounce(func: (...args) => void, delay: number): Function`

Creates a debounced version of a function, preventing it from being called too frequently.

*   **`func`:** The function to debounce.
*   **`delay`:** The debounce delay in milliseconds.
*   **Returns:** The debounced function.

### `safeJsonParse(jsonString: string): any | null`

Parses a JSON string safely, returning `null` if parsing fails instead of throwing an error.

*   **`jsonString`:** The JSON string to parse.
*   **Returns:** The parsed JSON object or `null` if parsing fails.

### `generateSlug(text: string): string`

Generates a URL-friendly slug from a string.  Converts the string to lowercase, trims whitespace, replaces non-alphanumeric characters with hyphens, and removes leading/trailing hyphens.

*   **`text`:** The input string.
*   **Returns:** The generated slug.

### `encryptText(text: string, secretKey: string): string`

Encrypts text using AES-256-CBC encryption.  The secret key *must* be 32 bytes long.

*   **`text`:** The text to encrypt.
*   **`secretKey`:** The encryption key (32 bytes).
*   **Returns:** The encrypted text (base64 encoded, including the IV).

### `decryptText(encryptedText: string, secretKey: string): string`

Decrypts text encrypted with `encryptText`.

*   **`encryptedText`:** The encrypted text (in `iv:data` format).
*   **`secretKey`:** The decryption key (32 bytes).
*   **Returns:** The decrypted text.
