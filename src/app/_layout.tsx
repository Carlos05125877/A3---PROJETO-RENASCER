import { Stack } from 'expo-router';
import { useEffect } from 'react';

// Mapeamento de rotas com case correto
const routeMapping: Record<string, string> = {
  '/screens/blogdicas': '/screens/blogDicas',
  '/screens/blogansiedade': '/screens/blogAnsiedade',
  '/screens/blogdepressao': '/screens/blogDepressao',
  '/screens/blogestresse': '/screens/blogEstresse',
  '/screens/pagamentosucesso': '/screens/pagamentoSucesso',
  '/screens/cadastrousuarios': '/screens/cadastroUsuarios',
  '/screens/cadastroprofissional': '/screens/cadastroProfissional',
  '/screens/quemsomos': '/screens/quemSomos',
  '/screens/emdesenvolvimento': '/screens/emDesenvolvimento',
  '/screens/listaprofissionais': '/screens/listaProfissionais',
  '/screens/agendadorusuario': '/screens/agendadorUsuario',
  '/screens/agendadorprofissional': '/screens/agendadorProfissional',
  '/admin/loginadmin': '/admin/loginAdmin',
  '/admin/dashboard': '/admin/dashboard',
};

/**
 * Normaliza a URL para o case correto
 * Resolve o problema do Netlify que converte URLs para minúsculas
 */
function normalizeUrl(path: string): string | null {
  const lowerPath = path.toLowerCase();
  
  // Verificar se há uma correspondência exata no mapeamento
  if (routeMapping[lowerPath]) {
    return routeMapping[lowerPath];
  }
  
  // Verificar rotas que começam com /screens/ e têm case incorreto
  if (lowerPath.startsWith('/screens/')) {
    const parts = lowerPath.split('/');
    if (parts.length >= 3) {
      const screenName = parts[2];
      // Tentar encontrar correspondência parcial
      for (const [lowerRoute, correctRoute] of Object.entries(routeMapping)) {
        if (lowerRoute.includes(screenName)) {
          return correctRoute;
        }
      }
    }
  }
  
  // Verificar rotas que começam com /admin/ e têm case incorreto
  if (lowerPath.startsWith('/admin/')) {
    // Primeiro, tentar correspondência exata
    for (const [lowerRoute, correctRoute] of Object.entries(routeMapping)) {
      if (lowerRoute.toLowerCase() === lowerPath) {
        return correctRoute;
      }
    }
    
    // Se não encontrou, tentar correspondência parcial
    const parts = lowerPath.split('/');
    if (parts.length >= 3) {
      const adminPage = parts[2];
      for (const [lowerRoute, correctRoute] of Object.entries(routeMapping)) {
        const routeParts = lowerRoute.toLowerCase().split('/');
        if (routeParts.length >= 3 && routeParts[2] === adminPage) {
          return correctRoute;
        }
      }
    }
  }
  
  return null;
}

export default function RootLayout() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let isNormalizing = false;
    
    const normalizeCurrentUrl = () => {
      // Evitar loops infinitos
      if (isNormalizing) return;
      
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      
      // Normalizar a URL se necessário
      const normalizedPath = normalizeUrl(path);
      
      if (normalizedPath && normalizedPath !== path) {
        isNormalizing = true;
        console.log('🔧 Normalizando URL:', path, '→', normalizedPath);
        
        // Usar replace para não adicionar ao histórico
        window.location.replace(`${normalizedPath}${search}${hash}`);
      }
    };
    
    // Normalizar na montagem
    normalizeCurrentUrl();
    
    // Normalizar quando a URL mudar (popstate, hashchange, etc)
    window.addEventListener('popstate', normalizeCurrentUrl);
    window.addEventListener('hashchange', normalizeCurrentUrl);
    
    return () => {
      window.removeEventListener('popstate', normalizeCurrentUrl);
      window.removeEventListener('hashchange', normalizeCurrentUrl);
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

