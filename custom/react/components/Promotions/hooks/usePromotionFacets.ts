import type { ActivePromotion, SelectedFacet } from '../typings/promotions';

export function usePromotionFacets(
  scope: ActivePromotion['scope'],
): SelectedFacet[] {
  const facets: SelectedFacet[] = [];

  scope.collections.forEach(({ id }) =>
    facets.push({ key: 'productClusterIds', value: id }),
  );
  scope.brands.forEach(({ name }) =>
    facets.push({ key: 'brand', value: name }),
  );
  scope.categories.forEach(({ id }) => facets.push({ key: 'c', value: id }));

  return facets;
}
