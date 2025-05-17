import { DateTime } from 'luxon';
import { BadRequestException } from '@nestjs/common';
import * as path from 'path';

export const generatePassword = async (length: number): Promise<string> => {
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const DIGITS = '0123456789';
  const PUNCTUATION = '!@#$&*';
  const ALL = LOWER + UPPER + DIGITS + PUNCTUATION;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALL.length);
    password += ALL.charAt(randomIndex);
  }

  return password;
};

export const generateRandomNumberByLength = (length: number): number => {
  const end = Math.pow(10, length); // Calculate the upper limit
  const start = end / 10; // Calculate the lower limit
  // Generate a random number between start (inclusive) and end (exclusive)
  return Math.floor(Math.random() * (end - start)) + start;
};

export const getLongFromLocalDateTimeByZone = (
  localDateTime: Date,
  zoneId: string,
): number => {
  try {
    return DateTime.fromJSDate(localDateTime).setZone(zoneId).toMillis();
  } catch (error) {
    console.log(error);
    return 0; // Return 0 in case of an error
  }
};

export const safeStringify = (obj) => {
  return JSON.stringify(obj, (key, value) => {
    // Exclude undefined values
    if (value === undefined) {
      return null; // or omit this property by returning undefined
    }
    return value;
  });
};

export const validEmailChecker = (email: string): boolean => {
  // Check if the email is provided
  if (!email) {
    throw new BadRequestException('Please provide a valid email');
  }
  // Validate the email format using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestException('Invalid email format');
  }
  return true;
};

export const ddMMYYYFormat = (date: Date) => {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const isValidString = (value: string | undefined | null): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const pathBaseName = (folderPath: string): string => {
  return path.basename(folderPath);
};

export const stringToBigint = (value: string): bigint => {
  try {
    return BigInt(value);
  } catch {
    return 0n;
  }
};

export const getCurrentYear = (): number => {
  const currentDate = new Date(); // Create a Date instance
  return currentDate.getFullYear();
};

export const calculatePercentValue = (
  totalPrice: number,
  percent: number,
): number => {
  return (totalPrice * percent) / 100;
};

export const calculateDiscountPrice = (value: number, price: number) => {
  return (value * price) / 100;
};

export const truncateToTwoDecimals = (value: number): number => {
  const str = value.toString();
  const decimalIndex = str.indexOf('.');
  if (decimalIndex === -1) return value; // Integer, return as is
  return Number(str.slice(0, decimalIndex + 3)); // Take up to 2 decimal places
};

export const truncateToOneDecimals = (value: number): number => {
  const str = value.toString();
  const decimalIndex = str.indexOf('.');
  if (decimalIndex === -1) return value; // Integer, return as is
  return Number(str.slice(0, decimalIndex + 2)); // Take up to 2 decimal places
};

export const timestampDayRangeFromLocalDateUTC = (meetingDate: Date) => {
  const year = meetingDate.getUTCFullYear();
  const month = meetingDate.getUTCMonth();
  const date = meetingDate.getUTCDate();

  const startOfDayTimestamp = Date.UTC(year, month, date, 0, 0, 0, 0);

  const endOfDayTimestamp = Date.UTC(year, month, date, 23, 59, 59, 999);
  return { startOfDayTimestamp, endOfDayTimestamp };
};

export const toTitleCase = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getRandomUppercaseLetters = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
