import { fontParams } from './zodParams';

const baseUrl = process.env.OG_URL ?? 'http://localhost:4200';

export const fetchFont = (family: string, weight?: number, text?: string) =>
  fetch(
    `${baseUrl}/api/font?${fontParams.toSearchString({
      family,
      weight,
      text,
    })}`,
  ).then((res) => res.arrayBuffer());
