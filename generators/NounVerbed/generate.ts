import { GeneratorFunction } from '../../types/GeneratorTypes';
import { loadImage } from '../../utils/loadImage';

import { TARGET_SIZE, MAX_FONT_SIZE } from './constants';
import { NounVerbedSettings } from './types';

export const generate: GeneratorFunction<NounVerbedSettings> = async (
  canvas,
  settings
) => {
  const { text = '', colour, image, textPosition } = settings;

  if (!image.src) {
    return {
      success: false,
    };
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      success: false,
    };
  }

  const loadedImage = await loadImage(image.src);
  const { width, height } = loadedImage;

  const ratio = width / height;

  const newWidth = width > height ? TARGET_SIZE : TARGET_SIZE * ratio;
  const newHeight = height > width ? TARGET_SIZE : TARGET_SIZE / ratio;

  canvas.width = newWidth;
  canvas.height = newHeight;
  ctx.drawImage(loadedImage, 0, 0, newWidth, newHeight);

  const uppercaseText = text.toUpperCase();
  const x = newWidth / 2;
  const y = (newHeight / 100) * textPosition;
  const maxWidth = newWidth - 64;

  let fontSize = MAX_FONT_SIZE + 1;
  do {
    fontSize -= 1;
    ctx.font = `${fontSize}px 'Optimus Princeps'`;
  } while (ctx.measureText(text).width > maxWidth);

  const bannerHeight = fontSize * 2;
  const bannerTop = y - bannerHeight / 2;
  const bannerBottom = y + bannerHeight / 2;

  const gradient = ctx.createLinearGradient(0, bannerTop, 0, bannerBottom);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.7)');
  gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.7)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, bannerTop, newWidth, bannerHeight);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = colour.hex;

  ctx.globalAlpha = 0.07;
  for (let i = 1.15; i > 1; i -= 0.01) {
    ctx.font = `${fontSize * i}px 'Optimus Princeps'`;
    ctx.fillText(uppercaseText, x, y);
  }
  ctx.globalAlpha = 1;

  ctx.font = `${fontSize} 'Optimus Princeps'`;
  ctx.fillText(uppercaseText, newWidth / 2, (newHeight / 100) * textPosition);

  return {
    suggestedAltText:
      `{{userImage}} with the text "${uppercaseText}" on top in a ` +
      `${colour.name.toLowerCase()} serif font, to look like a dark souls "you died" screenshot.`,
  };
};
