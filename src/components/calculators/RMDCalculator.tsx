import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

function fmtMoney(n: number, opts: { decimals?: number; compact?: boolean } = {}) {
  const { decimals = 0, compact = false } = opts;
  if (compact && Math.abs(n) >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 1 : 2) + 'M';
  if (compact && Math.abs(n) >= 10000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export const DISTRIBUTION_YEAR = 2026;

/**
 * IRS Uniform Lifetime Table (Table III, IRS Publication 590-B).
 * Effective for distribution years 2022 and later (86 FR 72472, Nov 12 2020).
 * Divisor = distribution period in years; RMD = prior Dec 31 balance ÷ divisor.
 * Verified Aug 2026 against IRS Pub 590-B / Fidelity's published table.
 */
export const UNIFORM_LIFETIME: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
  80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4,
  88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9,
  96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4,
};

/**
 * IRS Joint Life and Last Survivor Expectancy Table (Table II, IRS Pub 590-B),
 * post-2022 version. Applies only when your spouse is your SOLE primary
 * beneficiary AND is more than 10 years younger than you.
 * JOINT_LIFE[ownerAge] is the divisor array for spouse ages starting at
 * JOINT_SPOUSE_MIN_AGE (20), running up to ownerAge - 11.
 * Extracted programmatically from the published table (Collin W. Fritz &
 * Associates reproduction of 26 CFR 1.401(a)(9)-9) and cross-checked cell-by-
 * cell against TIAA's published copy; every value >= the Uniform divisor.
 */
export const JOINT_SPOUSE_MIN_AGE = 20;
export const JOINT_LIFE: Record<number, number[]> = {
  72: [65.1, 64.2, 63.2, 62.2, 61.3, 60.3, 59.3, 58.4, 57.4, 56.5, 55.5, 54.5, 53.6, 52.6, 51.7, 50.8, 49.8, 48.9, 47.9, 47.0, 46.0, 45.1, 44.2, 43.2, 42.3, 41.4, 40.5, 39.6, 38.7, 37.8, 36.9, 36.0, 35.2, 34.3, 33.5, 32.7, 31.9, 31.1, 30.3, 29.5, 28.8, 28.1],
  73: [65.1, 64.2, 63.2, 62.2, 61.2, 60.3, 59.3, 58.4, 57.4, 56.4, 55.5, 54.5, 53.6, 52.6, 51.7, 50.7, 49.8, 48.8, 47.9, 46.9, 46.0, 45.1, 44.1, 43.2, 42.3, 41.4, 40.4, 39.5, 38.6, 37.7, 36.8, 36.0, 35.1, 34.2, 33.4, 32.6, 31.7, 30.9, 30.1, 29.4, 28.6, 27.9, 27.2],
  74: [65.1, 64.1, 63.2, 62.2, 61.2, 60.3, 59.3, 58.3, 57.4, 56.4, 55.5, 54.5, 53.6, 52.6, 51.7, 50.7, 49.8, 48.8, 47.9, 46.9, 46.0, 45.0, 44.1, 43.2, 42.2, 41.3, 40.4, 39.5, 38.6, 37.7, 36.8, 35.9, 35.0, 34.1, 33.3, 32.4, 31.6, 30.8, 30.0, 29.2, 28.4, 27.7, 27.0, 26.2],
  75: [65.1, 64.1, 63.2, 62.2, 61.2, 60.3, 59.3, 58.3, 57.4, 56.4, 55.5, 54.5, 53.5, 52.6, 51.6, 50.7, 49.8, 48.8, 47.8, 46.9, 45.9, 45.0, 44.1, 43.1, 42.2, 41.3, 40.3, 39.4, 38.5, 37.6, 36.7, 35.8, 34.9, 34.1, 33.2, 32.4, 31.5, 30.7, 29.9, 29.1, 28.3, 27.5, 26.8, 26.1, 25.3],
  76: [65.1, 64.1, 63.2, 62.2, 61.2, 60.2, 59.3, 58.3, 57.4, 56.4, 55.4, 54.5, 53.5, 52.6, 51.6, 50.7, 49.7, 48.8, 47.8, 46.9, 45.9, 45.0, 44.0, 43.1, 42.2, 41.2, 40.3, 39.4, 38.5, 37.5, 36.6, 35.7, 34.9, 34.0, 33.1, 32.3, 31.4, 30.6, 29.8, 29.0, 28.2, 27.4, 26.6, 25.9, 25.2, 24.4],
  77: [65.1, 64.1, 63.1, 62.2, 61.2, 60.2, 59.3, 58.3, 57.3, 56.4, 55.4, 54.5, 53.5, 52.6, 51.6, 50.7, 49.7, 48.8, 47.8, 46.9, 45.9, 45.0, 44.0, 43.1, 42.1, 41.2, 40.3, 39.3, 38.4, 37.5, 36.6, 35.7, 34.8, 33.9, 33.0, 32.2, 31.3, 30.5, 29.7, 28.8, 28.0, 27.3, 26.5, 25.7, 25.0, 24.3, 23.5],
  78: [65.1, 64.1, 63.1, 62.2, 61.2, 60.2, 59.3, 58.3, 57.3, 56.4, 55.4, 54.5, 53.5, 52.6, 51.6, 50.6, 49.7, 48.7, 47.8, 46.8, 45.9, 44.9, 44.0, 43.0, 42.1, 41.2, 40.2, 39.3, 38.4, 37.5, 36.5, 35.6, 34.7, 33.9, 33.0, 32.1, 31.2, 30.4, 29.6, 28.7, 27.9, 27.1, 26.4, 25.6, 24.8, 24.1, 23.4, 22.7],
  79: [65.1, 64.1, 63.1, 62.2, 61.2, 60.2, 59.3, 58.3, 57.3, 56.4, 55.4, 54.5, 53.5, 52.5, 51.6, 50.6, 49.7, 48.7, 47.8, 46.8, 45.9, 44.9, 44.0, 43.0, 42.1, 41.1, 40.2, 39.3, 38.3, 37.4, 36.4, 35.6, 34.7, 33.8, 32.9, 32.0, 31.2, 30.3, 29.5, 28.7, 27.8, 27.0, 26.2, 25.5, 24.7, 23.9, 23.2, 22.5, 21.8],
  80: [65.1, 64.1, 63.1, 62.1, 61.2, 60.2, 59.2, 58.3, 57.3, 56.4, 55.4, 54.4, 53.5, 52.5, 51.6, 50.6, 49.7, 48.7, 47.8, 46.8, 45.9, 44.9, 43.9, 43.0, 42.1, 41.1, 40.2, 39.2, 38.3, 37.4, 36.4, 35.5, 34.6, 33.7, 32.9, 32.0, 31.1, 30.3, 29.4, 28.6, 27.8, 26.9, 26.1, 25.3, 24.6, 23.8, 23.1, 22.3, 21.6, 20.7],
  81: [65.1, 64.1, 63.1, 62.1, 61.2, 60.2, 59.2, 58.3, 57.3, 56.4, 55.4, 54.4, 53.5, 52.5, 51.6, 50.6, 49.7, 48.7, 47.7, 46.8, 45.8, 44.9, 43.9, 43.0, 42.0, 41.1, 40.1, 39.2, 38.3, 37.3, 36.4, 35.5, 34.6, 33.7, 32.8, 31.9, 31.1, 30.2, 29.3, 28.5, 27.7, 26.9, 26.0, 25.2, 24.5, 23.7, 22.9, 22.2, 21.5, 20.6, 20.0],
  82: [65.1, 64.1, 63.1, 62.1, 61.2, 60.2, 59.2, 58.3, 57.3, 56.3, 55.4, 54.4, 53.5, 52.5, 51.6, 50.6, 49.7, 48.7, 47.7, 46.8, 45.8, 44.9, 43.9, 43.0, 42.0, 41.1, 40.1, 39.2, 38.3, 37.3, 36.4, 35.5, 34.6, 33.7, 32.8, 31.9, 31.0, 30.1, 29.3, 28.4, 27.6, 26.8, 26.0, 25.2, 24.4, 23.6, 22.8, 22.1, 21.3, 20.5, 19.9, 19.2],
  83: [65.1, 64.1, 63.1, 62.1, 61.2, 60.2, 59.2, 58.3, 57.3, 56.3, 55.4, 54.4, 53.5, 52.5, 51.6, 50.6, 49.7, 48.7, 47.7, 46.8, 45.8, 44.9, 43.9, 43.0, 42.0, 41.1, 40.1, 39.2, 38.2, 37.3, 36.4, 35.4, 34.5, 33.6, 32.7, 31.8, 31.0, 30.1, 29.2, 28.3, 27.5, 26.7, 25.9, 25.1, 24.3, 23.5, 22.7, 22.0, 21.2, 20.4, 19.7, 19.0, 18.3],
  84: [65.1, 64.1, 63.1, 62.1, 61.2, 60.2, 59.2, 58.3, 57.3, 56.3, 55.4, 54.4, 53.5, 52.5, 51.5, 50.6, 49.6, 48.7, 47.7, 46.8, 45.8, 44.9, 43.9, 42.9, 42.0, 41.0, 40.1, 39.2, 38.2, 37.3, 36.3, 35.4, 34.5, 33.6, 32.7, 31.8, 30.9, 30.0, 29.2, 28.3, 27.5, 26.7, 25.8, 25.0, 24.2, 23.4, 22.6, 21.9, 21.1, 20.3, 19.6, 18.9, 18.2, 17.5],
  85: [65.1, 64.1, 63.1, 62.1, 61.2, 60.2, 59.2, 58.3, 57.3, 56.3, 55.4, 54.4, 53.5, 52.5, 51.5, 50.6, 49.6, 48.7, 47.7, 46.7, 45.8, 44.8, 43.9, 42.9, 42.0, 41.0, 40.1, 39.1, 38.2, 37.3, 36.3, 35.4, 34.5, 33.6, 32.7, 31.8, 30.9, 30.0, 29.1, 28.2, 27.4, 26.6, 25.8, 25.0, 24.1, 23.3, 22.6, 21.8, 21.0, 20.2, 19.5, 18.8, 18.1, 17.4, 16.7],
  86: [65.1, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.4, 54.4, 53.5, 52.5, 51.5, 50.6, 49.6, 48.7, 47.7, 46.7, 45.8, 44.8, 43.9, 42.9, 42.0, 41.0, 40.1, 39.1, 38.2, 37.2, 36.3, 35.4, 34.5, 33.5, 32.6, 31.7, 30.9, 30.0, 29.1, 28.2, 27.4, 26.6, 25.7, 24.9, 24.1, 23.3, 22.5, 21.7, 20.9, 20.1, 19.4, 18.7, 17.9, 17.2, 16.5, 15.9],
  87: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.4, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.7, 47.7, 46.7, 45.8, 44.8, 43.9, 42.9, 42.0, 41.0, 40.1, 39.1, 38.2, 37.2, 36.3, 35.4, 34.4, 33.5, 32.6, 31.7, 30.8, 29.9, 29.1, 28.2, 27.4, 26.5, 25.7, 24.9, 24.0, 23.2, 22.4, 21.6, 20.9, 20.0, 19.3, 18.6, 17.8, 17.1, 16.4, 15.7, 15.1],
  88: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.4, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.7, 47.7, 46.7, 45.8, 44.8, 43.9, 42.9, 42.0, 41.0, 40.0, 39.1, 38.2, 37.2, 36.3, 35.3, 34.4, 33.5, 32.6, 31.7, 30.8, 29.9, 29.0, 28.2, 27.3, 26.5, 25.6, 24.8, 24.0, 23.2, 22.4, 21.6, 20.8, 20.0, 19.2, 18.5, 17.7, 17.0, 16.3, 15.6, 14.9, 14.3],
  89: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.4, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.7, 47.7, 46.7, 45.8, 44.8, 43.9, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.3, 35.3, 34.4, 33.5, 32.6, 31.7, 30.8, 29.9, 29.0, 28.2, 27.3, 26.4, 25.6, 24.8, 24.0, 23.1, 22.3, 21.5, 20.7, 19.9, 19.2, 18.4, 17.7, 16.9, 16.2, 15.5, 14.8, 14.2, 13.5],
  90: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.4, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.9, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.3, 35.3, 34.4, 33.5, 32.6, 31.7, 30.8, 29.9, 29.0, 28.1, 27.3, 26.4, 25.6, 24.7, 23.9, 23.1, 22.3, 21.5, 20.7, 19.9, 19.1, 18.4, 17.6, 16.9, 16.1, 15.4, 14.7, 14.1, 13.4, 12.8],
  91: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.3, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.9, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.2, 35.3, 34.4, 33.5, 32.5, 31.6, 30.7, 29.9, 29.0, 28.1, 27.3, 26.4, 25.5, 24.7, 23.9, 23.1, 22.3, 21.5, 20.7, 19.8, 19.1, 18.3, 17.5, 16.8, 16.1, 15.3, 14.6, 14.0, 13.3, 12.7, 12.1],
  92: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.3, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.8, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.2, 35.3, 34.4, 33.5, 32.5, 31.6, 30.7, 29.8, 29.0, 28.1, 27.2, 26.4, 25.5, 24.7, 23.9, 23.0, 22.2, 21.4, 20.6, 19.8, 19.0, 18.3, 17.5, 16.7, 16.0, 15.3, 14.6, 13.9, 13.2, 12.6, 11.9, 11.4],
  93: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.3, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.8, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.2, 35.3, 34.4, 33.4, 32.5, 31.6, 30.7, 29.8, 29.0, 28.1, 27.2, 26.4, 25.5, 24.7, 23.8, 23.0, 22.2, 21.4, 20.6, 19.8, 19.0, 18.2, 17.4, 16.7, 15.9, 15.2, 14.5, 13.8, 13.1, 12.5, 11.9, 11.3, 10.7],
  94: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.3, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.8, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.2, 35.3, 34.4, 33.4, 32.5, 31.6, 30.7, 29.8, 28.9, 28.1, 27.2, 26.3, 25.5, 24.7, 23.8, 23.0, 22.2, 21.4, 20.6, 19.7, 19.0, 18.2, 17.4, 16.6, 15.9, 15.2, 14.4, 13.7, 13.1, 12.4, 11.8, 11.2, 10.6, 10.0],
  95: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.3, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.8, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.2, 35.3, 34.3, 33.4, 32.5, 31.6, 30.7, 29.8, 28.9, 28.1, 27.2, 26.3, 25.5, 24.6, 23.8, 23.0, 22.2, 21.4, 20.6, 19.7, 18.9, 18.2, 17.4, 16.6, 15.9, 15.1, 14.4, 13.7, 13.0, 12.3, 11.7, 11.1, 10.5, 9.9, 9.4],
  96: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.3, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.8, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.2, 35.3, 34.3, 33.4, 32.5, 31.6, 30.7, 29.8, 28.9, 28.0, 27.2, 26.3, 25.5, 24.6, 23.8, 23.0, 22.2, 21.3, 20.5, 19.7, 18.9, 18.1, 17.4, 16.6, 15.8, 15.1, 14.3, 13.6, 12.9, 12.3, 11.6, 11.0, 10.4, 9.9, 9.3, 8.8],
  97: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.3, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.8, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.2, 35.3, 34.3, 33.4, 32.5, 31.6, 30.7, 29.8, 28.9, 28.0, 27.2, 26.3, 25.5, 24.6, 23.8, 23.0, 22.1, 21.3, 20.5, 19.7, 18.9, 18.1, 17.3, 16.6, 15.8, 15.0, 14.3, 13.6, 12.9, 12.2, 11.6, 11.0, 10.4, 9.8, 9.2, 8.7, 8.3],
  98: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.3, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.8, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.2, 35.3, 34.3, 33.4, 32.5, 31.6, 30.7, 29.8, 28.9, 28.0, 27.2, 26.3, 25.5, 24.6, 23.8, 22.9, 22.1, 21.3, 20.5, 19.7, 18.9, 18.1, 17.3, 16.5, 15.8, 15.0, 14.3, 13.5, 12.9, 12.2, 11.5, 10.9, 10.3, 9.7, 9.2, 8.7, 8.2, 7.7],
  99: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.3, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.8, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.2, 35.3, 34.3, 33.4, 32.5, 31.6, 30.7, 29.8, 28.9, 28.0, 27.2, 26.3, 25.4, 24.6, 23.8, 22.9, 22.1, 21.3, 20.5, 19.7, 18.9, 18.1, 17.3, 16.5, 15.7, 15.0, 14.3, 13.5, 12.8, 12.2, 11.5, 10.9, 10.2, 9.7, 9.1, 8.6, 8.1, 7.6, 7.2],
  100: [65.0, 64.1, 63.1, 62.1, 61.1, 60.2, 59.2, 58.2, 57.3, 56.3, 55.3, 54.4, 53.4, 52.5, 51.5, 50.6, 49.6, 48.6, 47.7, 46.7, 45.8, 44.8, 43.8, 42.9, 41.9, 41.0, 40.0, 39.1, 38.1, 37.2, 36.2, 35.3, 34.3, 33.4, 32.5, 31.6, 30.7, 29.8, 28.9, 28.0, 27.1, 26.3, 25.4, 24.6, 23.8, 22.9, 22.1, 21.3, 20.5, 19.7, 18.9, 18.1, 17.3, 16.5, 15.7, 15.0, 14.2, 13.5, 12.8, 12.1, 11.5, 10.8, 10.2, 9.6, 9.1, 8.5, 8.0, 7.6, 7.2, 6.8],
};

/** SECURE 2.0 Act: RMDs start at 73 for those born 1951-1959, 75 for born 1960+. */
export function rmdStartAge(birthYear: number): number {
  return birthYear >= 1960 ? 75 : 73;
}

function jointDivisor(ownerAge: number, spouseAge: number): number | null {
  const row = JOINT_LIFE[Math.min(Math.max(ownerAge, 72), 100)];
  if (!row) return null;
  const idx = Math.round(spouseAge) - JOINT_SPOUSE_MIN_AGE;
  if (idx < 0) return row[0]; // spouse younger than 20: clamp (divisor only grows)
  if (idx >= row.length) return null; // gap of 10 or less: joint table does not apply
  return row[idx];
}

function divisorFor(ownerAge: number, useJoint: boolean, spouseAge: number): { d: number; table: 'uniform' | 'joint' } {
  const clamped = Math.min(Math.max(ownerAge, 72), 100);
  if (useJoint && ownerAge - spouseAge >= 11) {
    const j = jointDivisor(ownerAge, spouseAge);
    if (j != null) return { d: j, table: 'joint' };
  }
  return { d: UNIFORM_LIFETIME[clamped], table: 'uniform' };
}

interface ProjRow { year: number; age: number; balance: number; rmd: number; cumulative: number }

export function RMDCalculator() {
  const [birthYear, setBirthYear] = useState(1951);
  const [balance, setBalance] = useState(500000);
  const [growth, setGrowth] = useState(5);
  const [useJoint, setUseJoint] = useState(false);
  const [spouseAge, setSpouseAge] = useState(60);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const age = DISTRIBUTION_YEAR - birthYear;
  const startAge = rmdStartAge(birthYear);
  const firstRmdAge = Math.max(age, startAge);
  const firstRmdYear = birthYear + firstRmdAge;
  const notYetRequired = age < startAge;
  const spouseGap = age - spouseAge;
  const jointApplies = useJoint && spouseGap >= 11;

  const projection: ProjRow[] = useMemo(() => {
    const g = growth / 100;
    // If RMDs have not started yet, grow the balance until the Dec 31 before the first RMD year.
    let b = balance * Math.pow(1 + g, Math.max(0, firstRmdAge - age));
    const rows: ProjRow[] = [];
    let cumulative = 0;
    for (let a = firstRmdAge; a <= 100; a++) {
      const sAge = spouseAge + (a - age);
      const { d } = divisorFor(a, useJoint, sAge);
      const rmd = b / d;
      cumulative += rmd;
      rows.push({ year: birthYear + a, age: a, balance: b, rmd, cumulative });
      b = Math.max(0, (b - rmd) * (1 + g));
    }
    return rows;
  }, [balance, growth, birthYear, age, firstRmdAge, useJoint, spouseAge]);

  const current = projection[0];
  const currentDivisor = divisorFor(firstRmdAge, useJoint, spouseAge + (firstRmdAge - age));

  useEffect(() => {
    const seed: ProjRow = { year: firstRmdYear - 1, age: firstRmdAge - 1, balance: current ? current.balance : balance, rmd: 0, cumulative: 0 };
    const broadcastSchedule = [seed, ...projection];
    const detail = { schedule: broadcastSchedule };
    (window as any).__finCalcSchedule = broadcastSchedule;
    const emit = () => window.dispatchEvent(new CustomEvent('calc:schedule', { detail }));
    emit();
    setTimeout(emit, 0);
  }, [projection, firstRmdYear, firstRmdAge, balance, current]);

  // Chart: RMD amount by age
  const W = 560, H = 220, padL = 8, padR = 8, padT = 8, padB = 28;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const barCount = projection.length;
  const gap = Math.max(2, (innerW / Math.max(barCount, 1)) * 0.18);
  const barW = barCount > 0 ? (innerW - gap * (barCount - 1)) / barCount : 0;
  const chartMax = Math.max(...projection.map(r => r.rmd), 1);

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W - padL;
    setHover(Math.max(0, Math.min(barCount - 1, Math.floor(x / (barW + gap)))));
  }, [barCount, barW, gap]);

  const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;
  const ticks = projection.filter(r => r.age % 5 === 0);

  return (
    <div className="calc">
      <div className="calc-head">
        <div className="calc-title"><span className="dot" /><span><b>RMD</b> · required minimum distribution</span></div>
      </div>

      <div className="calc-result">
        <div>
          <div className="label">{notYetRequired ? `First RMD · ${firstRmdYear} (age ${firstRmdAge})` : `${DISTRIBUTION_YEAR} RMD · age ${age}`}</div>
          <div className="value"><span className="currency">$</span><span className="tnum">{fmtMoney(current ? current.rmd : 0)}</span></div>
        </div>
        <div className="delta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v18M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Divisor {currentDivisor.d.toFixed(1)} · {currentDivisor.table === 'joint' ? 'Joint Life table (spouse >10 yr younger)' : 'Uniform Lifetime table'}
        </div>
      </div>

      {notYetRequired && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.35)', fontSize: 13, color: 'var(--ink-on-dark-2)' }}>
          Born in {birthYear}, your RMDs don't begin until age {startAge} (SECURE 2.0). The figure above estimates your first RMD in {firstRmdYear}, assuming your balance grows {growth.toFixed(1)}%/yr until then.
        </div>
      )}
      {useJoint && !jointApplies && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.35)', fontSize: 13, color: 'var(--ink-on-dark-2)' }}>
          The Joint Life table only applies when your sole spouse beneficiary is more than 10 years younger. With a {Math.max(0, spouseGap)}-year gap, the Uniform Lifetime table is used.
        </div>
      )}

      <div className="chart" style={{ position: 'relative' }}>
        <svg ref={svgRef} className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
          {[0.25, 0.5, 0.75, 1].map((g, i) => (
            <line key={i} x1={padL} x2={W - padR} y1={padT + innerH * (1 - g)} y2={padT + innerH * (1 - g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

          {projection.map((row, i) => {
            const h = (row.rmd / chartMax) * innerH;
            const x = padL + i * (barW + gap);
            const yBase = padT + innerH;
            const isActive = hover === i;
            return (
              <g key={i} opacity={hover === null || isActive ? 1 : 0.55}>
                <rect x={x} y={yBase - h} width={barW} height={Math.max(0.5, h)} rx={Math.min(2, barW / 4)} fill="var(--ft-accent)" />
                {isActive && <rect x={x - 1} y={padT} width={barW + 2} height={innerH} fill="rgba(217,119,6,0.06)" rx={2} />}
              </g>
            );
          })}

          {ticks.map(r => {
            const i = projection.indexOf(r);
            const x = padL + i * (barW + gap) + barW / 2;
            return <text key={r.age} x={x} y={H - 8} fontSize={10} textAnchor="middle" fill="rgba(245,247,243,0.45)" fontFamily="var(--ff-mono)">{r.age}</text>;
          })}
        </svg>

        {hover !== null && projection[hover] && (
          <div className="tip show" style={{
            left: `${((padL + hover * (barW + gap) + barW / 2) / W) * 100}%`,
            top: `${((padT + (innerH - (projection[hover].rmd / chartMax) * innerH)) / H) * 100}%`,
          }}>
            <div className="row" style={{ fontWeight: 500, marginBottom: 4 }}>{projection[hover].year} · age {projection[hover].age}</div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>RMD</span><b className="tnum" style={{ color: 'var(--ft-accent)' }}>${fmtMoney(projection[hover].rmd)}</b></div>
            <div className="row"><span style={{ color: 'var(--ink-3)' }}>Balance</span><b className="tnum">${fmtMoney(projection[hover].balance)}</b></div>
          </div>
        )}

        <div className="chart-legend">
          <span><span className="swatch" style={{ background: 'var(--ft-accent)' }} />Annual RMD, projected to age 100 at {growth.toFixed(1)}% growth</span>
        </div>
      </div>

      <div className="calc-inputs">
        <div className="field">
          <div className="field-row"><span>Birth year</span><span className="v">{birthYear} · age {age} in {DISTRIBUTION_YEAR}</span></div>
          <input type="range" min={1926} max={1962} step={1} value={birthYear} onChange={e => setBirthYear(+e.target.value)} style={{ '--p': pct(birthYear, 1926, 1962) + '%' } as React.CSSProperties} />
        </div>

        <div className="field">
          <div className="field-row"><span>Expected growth</span><span className="v">{growth.toFixed(1)}%/yr</span></div>
          <input type="range" min={0} max={10} step={0.5} value={growth} onChange={e => setGrowth(+e.target.value)} style={{ '--p': pct(growth, 0, 10) + '%' } as React.CSSProperties} />
        </div>

        <div className="field" style={{ gridColumn: 'span 2' }}>
          <div className="field-row"><span>Account balance · Dec 31, {DISTRIBUTION_YEAR - 1}</span><span className="v">${fmtMoney(balance)}</span></div>
          <div className="amount-input"><span>$</span><input type="number" value={balance} min={0} max={20000000} step={10000} onChange={e => setBalance(Math.max(0, +e.target.value || 0))} /></div>
          <input type="range" min={10000} max={3000000} step={10000} value={Math.min(balance, 3000000)} onChange={e => setBalance(+e.target.value)} style={{ '--p': pct(Math.min(balance, 3000000), 10000, 3000000) + '%' } as React.CSSProperties} />
        </div>

        <div className="field" style={{ gridColumn: 'span 2' }}>
          <div className="field-row"><span>Beneficiary</span><span className="v">{jointApplies ? 'Joint Life table' : 'Uniform Lifetime table'}</span></div>
          <div className="freq-row">
            <button type="button" aria-pressed={!useJoint} onClick={() => setUseJoint(false)}>Standard</button>
            <button type="button" aria-pressed={useJoint} onClick={() => setUseJoint(true)}>Sole spouse beneficiary &gt;10 yr younger</button>
          </div>
        </div>

        {useJoint && (
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <div className="field-row"><span>Spouse age in {DISTRIBUTION_YEAR}</span><span className="v">{spouseAge} · {Math.max(0, spouseGap)} yr younger</span></div>
            <input type="range" min={30} max={90} step={1} value={spouseAge} onChange={e => setSpouseAge(+e.target.value)} style={{ '--p': pct(spouseAge, 30, 90) + '%' } as React.CSSProperties} />
          </div>
        )}
      </div>

      <div className="calc-foot">
        <span>Educational estimate only — not tax advice. Confirm your RMD with your custodian or a tax professional.</span>
        <span>Missed RMDs face a 25% excise tax (10% if corrected promptly).</span>
      </div>
    </div>
  );
}
