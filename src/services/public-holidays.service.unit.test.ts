import axios from "axios";
import { getListOfPublicHolidays, checkIfTodayIsPublicHoliday, getNextPublicHolidays } from "./public-holidays.service";
import { PublicHoliday, PublicHolidayShort } from "../types";
import * as helpers from "../helpers";
import { PUBLIC_HOLIDAYS_API_URL, SUPPORTED_COUNTRIES } from "../config";
import { publicHolidayInGB } from "../mock/public-holidays-GB-mock";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../helpers");
const mockedValidateInput = jest.spyOn(helpers, "validateInput");
jest.spyOn(helpers, "shortenPublicHoliday").mockImplementation((holiday) => {
  return {
    date: holiday.date,
    localName: holiday.localName,
    name: holiday.name,
}});

describe("getListOfPublicHolidays", () => {
  let year: number;
  let country: string;
  let mockHolidays: PublicHoliday[];
  let mockShortenHoliday: PublicHolidayShort[];

  beforeEach(() => {
    year = new Date().getFullYear();
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

  it("should return a list of public holidays", async () => {
    expect.assertions(3);
    mockedAxios.get.mockResolvedValueOnce({ data: mockHolidays });

    const result = await getListOfPublicHolidays(year, country);

    expect(mockedValidateInput).toHaveBeenCalledWith({ year, country });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/${year}/${country}`
    );
    expect(result).toEqual(mockShortenHoliday);
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
    expect.assertions(3);
    mockedAxios.get.mockResolvedValueOnce({ status: 200 });

    const result = await checkIfTodayIsPublicHoliday(country);

    expect(mockedValidateInput).toHaveBeenCalledWith({ country });
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

  it("should return false when status response is different than 200", async () => {
    expect.assertions(1);
    mockedAxios.get.mockResolvedValueOnce({ status: 404 });

    const result = await checkIfTodayIsPublicHoliday(country);

    expect(result).toBe(false);
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
    expect.assertions(3);
    mockedAxios.get.mockResolvedValueOnce({ data: mockHolidays });

    const result = await getNextPublicHolidays(country);

    expect(mockedValidateInput).toHaveBeenCalledWith({ country });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/${country}`
    );
    expect(result).toEqual(mockShortenHoliday);
  });

  it("should return an empty array when the axios call fails", async () => {
    expect.assertions(2);
    mockedAxios.get.mockRejectedValueOnce(new Error());

    const result = await getNextPublicHolidays(country);

    expect(mockedValidateInput).toHaveBeenCalledWith({ country });
    expect(result).toEqual([]);
  });
});