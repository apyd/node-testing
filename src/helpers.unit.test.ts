import { SUPPORTED_COUNTRIES } from './config';
import { validateInput, shortenPublicHoliday } from './helpers';
import { PublicHoliday } from './types';

describe('validateInput fn', () => {
  let props: Record<string, number | string> = {}

  beforeEach(() => {
    props = { 
      year: new Date().getFullYear(),
      country: SUPPORTED_COUNTRIES[0]
    }
  })
  it('should return true if year and country are provided and both are valid', () => {
    const result = validateInput({...props})
    expect(result).toBe(true)
  })
  it('should throw error if country is provided but not supported', () => {
    props = {
      country: '  '
    }
    expect(() => validateInput({...props})).toThrowError(`Country provided is not supported, received: ${props.country}`)
  })
  it('should throw error if year is provided but not current', () => {
    props = {
      year: Number(props.year) - 1
    }
    expect(() => validateInput({...props})).toThrowError()
  })

  it('should return true if year and country are not provided', () => {
    props = {}
    const result = validateInput({...props})
    expect(result).toBe(true)
  })
})

describe('shortenPublicHoliday fn', () => {
  let publicHoliday: PublicHoliday

  beforeEach(() => {
    publicHoliday = {
      date: '2022-10-22',
      localName: 'LocalName',
      name: 'Test',
      countryCode: 'PL',
      fixed: true,
      global: false,
      counties: ['PL', 'DK'],
      launchYear: 1920,
      types: ['Public holiday']
    }
  })

  it('should return object with name, localName and date', () => {
    const { name, date, localName } = publicHoliday
    const result = shortenPublicHoliday({...publicHoliday})
    expect(result).toMatchObject({name, date, localName})
  })
})