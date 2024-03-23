import axios from "axios";
import { getListOfPublicHolidays, checkIfTodayIsPublicHoliday, getNextPublicHolidays } from "./public-holidays.service";
import { PublicHoliday, PublicHolidayShort } from "../types";
import { PUBLIC_HOLIDAYS_API_URL, SUPPORTED_COUNTRIES } from "../config";
import { publicHolidayInGB } from "../mock/public-holidays-GB-mock";
import { shortenPublicHoliday } from "../helpers";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getListOfPublicHolidays", () => {
  let year: number;
  let country: string;
  let mockHolidays: PublicHoliday[];

  beforeEach(() => {
    year = new Date().getFullYear();
    country = SUPPORTED_COUNTRIES[0];
    mockHolidays = [...publicHolidayInGB];
  });

  it("should return a list of public holidays", async () => {
    expect.assertions(2);
    mockedAxios.get.mockResolvedValueOnce({ data: mockHolidays });

    const result = await getListOfPublicHolidays(year, country);
    const shortenedHoliday = mockHolidays.map(holiday => shortenPublicHoliday(holiday));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/${year}/${country}`
    );
    expect(result).toEqual(shortenedHoliday);
  });

  it("should throw an error when the year is not current", async () => {
    expect.assertions(1);
    year = year - 1;

    expect(() => getListOfPublicHolidays(year, country))
      .rejects
      .toThrow(`Year provided not the current, received: ${year}`)
  });

  it("should throw an error when the country is provided but not supported", async () => {
    expect.assertions(1);
    country = "XY";

    expect(() => getListOfPublicHolidays(year, country))
      .rejects
      .toThrow(`Country provided is not supported, received: ${country}`)
  });

  it("should return an empty array when the axios call fails", async () => {
    expect.assertions(1);
    mockedAxios.get.mockRejectedValueOnce(new Error());

    const result = await getListOfPublicHolidays(year, country);

    expect(result).toEqual([]);
  });
});

describe("checkIfTodayIsPublicHoliday", () => {
  let country: string;

  beforeEach(() => {
    country = SUPPORTED_COUNTRIES[0];
  });

  it("should return true if public holiday exists", async () => {
    expect.assertions(2);
    mockedAxios.get.mockResolvedValueOnce({ status: 200 });

    const result = await checkIfTodayIsPublicHoliday(country);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/${country}`
    );
    expect(result).toBe(true);
  });

  it("should return false when the axios call fails", async () => {
    expect.assertions(1);
    mockedAxios.get.mockRejectedValueOnce(new Error());

    const result = await checkIfTodayIsPublicHoliday(country);

    expect(result).toBe(false);
  });

  it("should throw error if country is provided but not supported", async () => {
    expect.assertions(1);
    country = "XY";

    expect(() => checkIfTodayIsPublicHoliday(country))
      .rejects
      .toThrow(`Country provided is not supported, received: ${country}`
    )
  });
});

describe("getNextPublicHolidays", () => {
  let country: string;
  let mockHolidays: PublicHoliday[];
  let mockShortenHoliday: PublicHolidayShort[];

  beforeEach(() => {
    country = SUPPORTED_COUNTRIES[0];
    mockHolidays = [...publicHolidayInGB];
    mockShortenHoliday = mockHolidays.map((holiday) => {
      return {
        date: holiday.date,
        localName: holiday.localName,
        name: holiday.name,
      };
    });
  });

  it("should return a list of next public holidays", async () => {
    expect.assertions(2);
    mockedAxios.get.mockResolvedValueOnce({ data: mockHolidays });

    const result = await getNextPublicHolidays(country);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/${country}`
    );
    expect(result).toEqual(mockShortenHoliday);
  });

  it("should return an empty array when the axios call fails", async () => {
    expect.assertions(1);
    mockedAxios.get.mockRejectedValueOnce(new Error());

    const result = await getNextPublicHolidays(country);

    expect(result).toEqual([]);
  });

  it("should throw error if provided country is not supported", async () => {
    expect.assertions(1);
    country = "XY";

    expect(() => getNextPublicHolidays(country)).rejects.toThrow(`Country provided is not supported, received: ${country}`);
  });
});