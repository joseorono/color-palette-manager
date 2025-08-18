
ideas for generateHarmoniousHexCsv():

# Current Code

```ts
export function generateHarmoniousHexCsv(
  baseColor?: string,
  count: number = 5
): string[] {
  const base = baseColor ? chroma(baseColor) : chroma.random();
  const colors: HexColorString[] = [base.hex()];

  // Generate complementary, triadic, and analogous colors
  const schemes = [
    // Analogous colors
    base.set("hsl.h", "+30").hex(),
    base.set("hsl.h", "-30").hex(),
    // Complementary
    base.set("hsl.h", "+180").hex(),
    // Triadic
    base.set("hsl.h", "+120").hex(),
    base.set("hsl.h", "-120").hex(),
    // Variations
    base.set("hsl.l", "*0.8").hex(),
    base.set("hsl.l", "*1.2").hex(),
    base.set("hsl.s", "*0.7").hex(),
    base.set("hsl.s", "*1.3").hex(),
  ];

  // Shuffle and take required count
  const shuffled = schemes.sort(() => Math.random() - 0.5);
  console.log(count, shuffled.length);
  colors.push(...shuffled.slice(0, count - 1));
  console.log(colors);
  return colors.slice(0, count);
}

```

# Fuzzy Checking

fuzzy-check = Verify based on perceptual difference or Euclidean distance between colors. Functions are needed for this.
https://culorijs.org/api/#differenceEuclidean

https://chatgpt.com/share/6897a72e-9080-8000-9806-bbe295eb819e

If you want perceptual accuracy → Use LAB + ΔE (via culori, color-difference, or color-diff).

If you want perceptual accuracy → Use LAB + ΔE (via culori, color-difference, or color-diff).

# Assumptions

- We're currently assuming that we're putting together a complementary palette.
- To break this assumption, We would need to create priority lists for all the different types of palettes:
    - Analogous
    - Monochromatic
    - Complementary
    - Triadic
    - Tetradic
    - Split Complementary
    - Square
    - Compound

# Algorithm

- Create paletteUtil.getBaseColor(Color[] colors): Color[],
    - it gets the primary color, or the first color.

- Add function argument existingColors: Color[]
- If no baseColorArg, generate random color.
- Calculate colorsToGenerate
    - Check if baseColor is in existingColors
        - If it isn't, add it to existingColors
    - Check count is equal than existingColors.length
        - If count == existingColors.length, return existingColors early
        - if count < existingColors.length, return existingColors.slice(0, count) early

- By this Point, we know count is greater than existingColors.length

- Convert existingColors to RBG colors using .map() for easier fuzzy checking

- Calculate how many more colors are needed to reach count, save it in countToGenerate

- Declare priorityColorsDuringGeneration: string[] = ["white", "black", "complementary", "analogous", "variations"]

Do all the follow inside a loop that iterates through priorityColorsDuringGeneration, using a switch case.
Break whenever we reach countToGenerate == 0.

- Check if existingColors already has a variant of white within a threshold
    - If it does, skip it
- Check if existingColors already has a variant of black within a threshold
    - If it does, skip it
- Generate the complementary color, fuzzy-check if it's in existingColors
    - If it is, skip it
- Generate the analogous color, fuzzy-check if it's in existingColors
    - If it is, skip it
- Generate the variations color, fuzzy-check if it's in existingColors
    - If it is, skip it

Then, if countToGenerate is still greater than 0, generate variations of baseColor until we reach countToGenerate.

