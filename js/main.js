/**
 * Main Entry Point
 * Sets up Scrollama and initializes animations
 */

// Import animation modules (will create these next)
import { initPunchCard } from "./animations/punch-card.js";
import { initMagneticTape } from "./animations/magnetic-tape.js";
import { initHDDPlatter } from "./animations/hdd-platter.js";
import { initSSDNand } from "./animations/ssd-nand.js";
import { initCloudNodes } from "./animations/cloud-nodes.js";

// Animation registry - maps era to animation instance
const animations = {};

/**
 * Initialize all visualizations
 */
function initVisualizations() {
  animations.punch = initPunchCard("#viz-punch");
  animations.tape = initMagneticTape("#viz-tape");
  animations.hdd = initHDDPlatter("#viz-hdd");
  animations.ssd = initSSDNand("#viz-ssd");
  animations.cloud = initCloudNodes("#viz-cloud");
}

/**
 * Initialize Scrollama
 */
function initScrollama() {
  const scroller = scrollama();

  scroller
    .setup({
      step: ".strata",
      offset: 0.5, // Trigger when section is 50% visible
      debug: false, // Set to true to see trigger lines
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);

  // Handle window resize
  window.addEventListener("resize", scroller.resize);

  return scroller;
}

/**
 * Handle entering a strata section
 */
function handleStepEnter(response) {
  const { element, index, direction } = response;
  const era = element.dataset.era;

  // Add active class for styling
  element.classList.add("is-active");

  // Play the animation for this era
  if (animations[era] && animations[era].play) {
    animations[era].play();
  }

  console.log(`Entered: ${era} (direction: ${direction})`);
}

/**
 * Handle exiting a strata section
 */
function handleStepExit(response) {
  const { element, index, direction } = response;

  // Remove active class
  element.classList.remove("is-active");

  // Optionally reset animation
  const era = element.dataset.era;
  if (animations[era] && animations[era].reset) {
    // Only reset if scrolling away (not just passing through)
    // animations[era].reset();
  }
}

/**
 * Main initialization
 */
function init() {
  console.log("Database History Scrollytelling - Initializing...");

  // Initialize visualizations first
  initVisualizations();

  // Then set up scroll triggers
  initScrollama();

  console.log("Initialization complete!");
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
