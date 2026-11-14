// ============================================================================
// COFOCO Design 1 Effects Feature Flags & Configuration
// Allows dynamic toggling and optimization benchmarking
// ============================================================================

export interface EffectsConfig {
  dust: boolean;
  spotlight: boolean;
  knurl: boolean;
  grain: boolean;
  marquee: boolean;
  pageWipe: boolean;
  smoothScroll: boolean;
  tilt: boolean;
  flyToCart: boolean;
  pinnedStory: boolean;
  rosterAccordion: boolean;
  heroParallax: boolean;
}

export const DEFAULT_EFFECTS_CONFIG: EffectsConfig = {
  dust: true,
  spotlight: true,
  knurl: true,
  grain: true,
  marquee: true,
  pageWipe: true,
  smoothScroll: true,
  tilt: true,
  flyToCart: true,
  pinnedStory: true,
  rosterAccordion: true,
  heroParallax: true,
};
