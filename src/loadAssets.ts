export type Assets = HTMLImageElement[];

export const loadAssets = async (
  [character, background]: Assets,
  context: CanvasRenderingContext2D
) => {
  try {
    console.debug("Loading assets...");
    const bgPromise = new Promise((resolve, reject) => {
      background.onload = resolve;
      background.onerror = reject;
    });

    const characterPromise = new Promise((resolve, reject) => {
      character.onload = resolve;
      character.onerror = reject;
    });

    const promises = await Promise.all([bgPromise, characterPromise]);

    context.drawImage(
      background,
      0,
      0,
      background.width,
      background.height,
      0,
      0,
      background.width,
      window.innerHeight
    );

    context.drawImage(
      character,
      0,
      0,
      character.width / 3,
      character.height / 4,
      0,
      380,
      character.width / 8,
      character.height / 10
    );

    console.debug("Assets Loaded successfully.");

    return promises;
  } catch (error) {
    console.error("Error loading images:", error);
    return error;
  }
};
