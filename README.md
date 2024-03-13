## Practical task for testing module (node-mentoring)

### Requirements:

1. Jest is used for unit and integration tests, supertest - for E2E tests.
2. The module is covered with tests following instructions below:
  - Unit tests are written for public-holidays.service.ts and helpers.ts files. Keep in mind that any external calls are mocked in unit tests.
  - Integration tests are written for public-holidays.service.ts. Do not forget that in this case you make real calls to the API.
  - E2E tests are written for any two endpoints from Nager.Date API.
3. Code coverage is calculated, it is not less than 85%. Any format for the coverage report can be used.
4. The following npm scripts are added to run tests:
  - npm test - to run unit and integration tests
  - npm test:e2e - to run E2E tests
  - npm test:coverage - to get code coverage