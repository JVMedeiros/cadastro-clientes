export const RAINBOW_COLORS = [
  "Vermelho",
  "Laranja",
  "Amarelo",
  "Verde",
  "Azul",
  "Anil",
  "Violeta",
] as const;

export type RainbowColor = (typeof RAINBOW_COLORS)[number];
