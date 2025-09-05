/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Sage green as primary color - represents growth, healing, and nature
const tintColorLight = '#7C9A92';
// Soft lavender as dark mode primary - calming and peaceful
const tintColorDark = '#9F91CC';

export const Colors = {
  light: {
    // Soft charcoal for better readability while maintaining gentleness
    text: '#2F3B4C',
    // Soft cream background - warm and inviting
    background: '#F8F6F0',
    // Lighter sage for cards - maintains harmony with tint
    cardBackground: '#EDF1EF',
    tint: tintColorLight,
    // Muted blue-grey for inactive elements
    icon: '#8E9CAA',
    tabIconDefault: '#8E9CAA',
    tabIconSelected: tintColorLight,
  },
  dark: {
    // Soft white text for dark mode
    text: '#E8E6F0',
    // Deep indigo background - peaceful night sky feel
    background: '#2D2B3F',
    // Slightly lighter indigo for cards
    cardBackground: '#363450',
    tint: tintColorDark,
    // Muted lavender for inactive elements
    icon: '#8B85A9',
    tabIconDefault: '#8B85A9',
    tabIconSelected: tintColorDark,
  },
};
