module.exports = {
    moduleFileExtensions: [
        'js',
        'json',
        'ts'
    ],
    rootDir: 'src',
    testRegex: '.(spec|e2e-spec).ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    collectCoverageFrom: [
        '**/*.(t|j)s'
    ],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/$1',
        "^@modules/(.*)$": "<rootDir>/modules/$1",
        "^@helpers/(.*)$": ["<rootDir>/helpers/$1"],
        "^@common/(.*)$": ["<rootDir>/common/$1"],
        "^@auth/(.*)$": ["<rootDir>/auth/$1"],
        "^@config/(.*)$": ["<rootDir>/config/$1"],
    }
};