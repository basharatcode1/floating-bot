"use client";

import Highcharts from "highcharts";

// In Highcharts 13.x, sub-modules like highcharts-more, solid-gauge,
// funnel, and treemap use a factory pattern that expects the core
// Highcharts object to be available as `_Highcharts` on the global
// scope (`window` / `globalThis`).  When bundled via Turbopack / webpack
// as ESM the global is empty, so the factory silently produces
// `undefined`, leaving chart types like `solidgauge` or `areaspline`
// without their Pane dependency and causing
//   "Cannot read properties of undefined (reading 'hasSeriesType')"
//
// The fix: expose the core object on `globalThis` *before* the
// sub-modules are evaluated, then import them normally.

if (typeof globalThis !== "undefined") {
  (globalThis as any)._Highcharts = Highcharts;
}

// Now the sub-modules will self-register when imported.
// We use dynamic `require` wrapped in try/catch for resilience.
let modulesInitialized = false;

export function initHighchartsModules(): boolean {
  if (modulesInitialized) return true;

  try {
    // highcharts-more adds Pane, polar support, areaspline fixes, etc.
    require("highcharts/highcharts-more");
  } catch (e) {
    console.warn("Failed to load highcharts-more:", e);
  }

  try {
    require("highcharts/modules/solid-gauge");
  } catch (e) {
    console.warn("Failed to load solid-gauge:", e);
  }

  try {
    require("highcharts/modules/funnel");
  } catch (e) {
    console.warn("Failed to load funnel:", e);
  }

  try {
    require("highcharts/modules/treemap");
  } catch (e) {
    console.warn("Failed to load treemap:", e);
  }

  modulesInitialized = true;
  return true;
}

// Eagerly initialize on import
initHighchartsModules();

export default Highcharts;
