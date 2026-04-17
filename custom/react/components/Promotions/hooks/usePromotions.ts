import { useState, useEffect } from 'react';
import type { ActivePromotion } from '../typings/promotions';
// import { PROMOTIONS_MOCK } from '../mocks/promotions.mock';

interface State {
  promotions: ActivePromotion[];
  loading: boolean;
  error: string | null;
}

export function usePromotions(): State {
  const [state, setState] = useState<State>({
    promotions: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    // TODO: substituir pelo fetch real quando o endpoint estiver disponível
    fetch('/_v/promotions/active')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ActivePromotion[]>;
      })
      .then((promotions) =>
        setState({ promotions, loading: false, error: null }),
      )
      .catch((err) =>
        setState({ promotions: [], loading: false, error: err.message }),
      );

    // setState({ promotions: PROMOTIONS_MOCK, loading: false, error: null });
  }, []);

  return state;
}
