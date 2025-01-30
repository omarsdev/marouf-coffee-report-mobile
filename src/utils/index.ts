import {Dimensions, Platform, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('window');

// Figma design dimensions
const FIGMA_WIDTH = 1280;
const FIGMA_HEIGHT = 800;

// Calculate scale factors
const scaleWidth = width / FIGMA_WIDTH;
const scaleHeight = height / FIGMA_HEIGHT;

// Use the **larger** scale factor to prevent excessive shrinking
const scale = Math.min(scaleWidth, scaleHeight);

/**
 * Normalize font sizes while ensuring they are readable
 * @param {number} size - The original size from Figma
 * @param {number} factor - Scaling factor (default: 0.5 for balanced scaling)
 * @returns {number} - Scaled size for the device
 */
export function normalize(size: number, factor: number = 0.5) {
  const newSize = size * (scale + factor); // Add a factor to boost size slightly
  const roundedSize = PixelRatio.roundToNearestPixel(newSize);

  return Platform.OS === 'ios' ? roundedSize : roundedSize - 2;
}
