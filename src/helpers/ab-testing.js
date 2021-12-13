import { emitter } from '@marvelapp/react-ab-test';

// Specific A/B test constants.

// Recommendations.
export const AB_RECOMMEND_EXPERIMENT = 'recommend';
export const AB_RECOMMEND_NEW = 'new';
export const AB_RECOMMEND_CURRENT = 'current';

// Define A/B testing for Recommendations.
emitter.defineVariants(AB_RECOMMEND_EXPERIMENT, [AB_RECOMMEND_CURRENT, AB_RECOMMEND_NEW]);

// Selects ab testing variabnt by experiment and userId.
// Can be overriden by URL paramter ?ab=<experiment1>:<variant1>,<experiment2>:<variant2>,...
export const selectVariant = (experiment, userId) => {
  // SSR does not have window object.
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    if (url.searchParams.get('ab')) {
      const pair = url.searchParams.get('ab').split(',').find(pair => pair.split(':')[0] === experiment);
      const variant = pair && pair.split(':').slice(-1)[0];
      if (variant) {
        emitter.setActiveVariant(experiment, variant);
        return variant;
      }
    }
  }

  emitter.calculateActiveVariant(experiment, userId);
  const variant = emitter.getActiveVariant(experiment);
  console.log('Variant', variant);
  return variant;
}

export function CreateAbTesting(userId) {
  const abTesting = {
    [AB_RECOMMEND_EXPERIMENT]: selectVariant(AB_RECOMMEND_EXPERIMENT, userId),
    getVariant: experiment => abTesting[experiment] || '',
  };
  return Object.freeze(abTesting);
}
