import request from 'supertest';
import { PUBLIC_HOLIDAYS_API_URL, SUPPORTED_COUNTRIES } from './config';
import { PublicHoliday } from './types';

describe('Nager.Date API e2e tests', () => {
  let year: number;
  let country: string;

  beforeEach(() => {
    year = new Date().getFullYear();
    country = SUPPORTED_COUNTRIES[0]
  })

  describe('PublicHolidays API', () => {
    it('should get public holidays for a specific year and country', async () => {
      expect.hasAssertions();
      const { status, body } = await request(PUBLIC_HOLIDAYS_API_URL)
        .get(`/PublicHolidays/${year}/${country}`)

      expect(status).toBe(200);
      body.forEach((holiday: PublicHoliday) => {
        expect(holiday).toHaveProperty('date');
        expect(holiday).toHaveProperty('localName');
        expect(holiday).toHaveProperty('name');
        expect(holiday).toHaveProperty('countryCode');
        expect(holiday).toHaveProperty('fixed');
        expect(holiday).toHaveProperty('global');
        expect(holiday).toHaveProperty('counties');
        expect(holiday).toHaveProperty('launchYear');
        expect(holiday).toHaveProperty('types');
      });
    });

    it('should return 404 if country is invalid', async () => {
      expect.assertions(1);
      country = 'XY';
      const { status } = await request(PUBLIC_HOLIDAYS_API_URL)
        .get(`/PublicHolidays/${year}/${country}`)

      expect(status).toBe(404);
    });
  });

  describe('NextPublicHolidays API', () => {
    it('should get the next public holidays for a specific country', async () => {
      expect.hasAssertions();
      country = 'US';

      const { status, body } = await request(PUBLIC_HOLIDAYS_API_URL)
        .get(`/NextPublicHolidays/${country}`)

      expect(status).toBe(200);
      body.forEach((holiday: PublicHoliday) => {
        expect(holiday).toHaveProperty('date');
        expect(holiday).toHaveProperty('localName');
        expect(holiday).toHaveProperty('name');
        expect(holiday).toHaveProperty('countryCode');
        expect(holiday).toHaveProperty('fixed');
        expect(holiday).toHaveProperty('global');
        expect(holiday).toHaveProperty('counties');
        expect(holiday).toHaveProperty('launchYear');
        expect(holiday).toHaveProperty('types');
      });
    });

    it('should return 500 for next public holidays if country is invalid', async () => {
      expect.assertions(1);
      country = 'XY';
      const { status } = await request(PUBLIC_HOLIDAYS_API_URL)
        .get(`/NextPublicHolidays/${country}`)

      expect(status).toBe(500);
    });
  });
});