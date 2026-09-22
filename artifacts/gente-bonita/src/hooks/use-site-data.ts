import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSiteConfig() {
  return useQuery({
    queryKey: ['configuracoes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('configuracoes').select('*');
      if (error) throw error;
      const configMap = data.reduce((acc, item) => ({ ...acc, [item.id]: item.valor }), {} as Record<string, string>);
      return configMap;
    }
  });
}

export function useServices() {
  return useQuery({
    queryKey: ['servicos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('servicos').select('*').order('ordem');
      if (error) throw error;
      return data;
    }
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ['galeria'],
    queryFn: async () => {
      const { data, error } = await supabase.from('galeria').select('*').order('ordem');
      if (error) throw error;
      return data;
    }
  });
}

export function useCombos() {
  return useQuery({
    queryKey: ['combos_promo'],
    queryFn: async () => {
      const { data, error } = await supabase.from('combos_promo').select('*').order('ordem');
      if (error) throw error;
      return data;
    }
  });
}
