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

// Executar normalização ANTES do componente renderizar
// Isso garante que a URL seja corrigida antes do Expo Router tentar processar
// IMPORTANTE: Usar sessionStorage para evitar loops infinitos
if (typeof window !== 'undefined') {
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
  
  const path = window.location.pathname;
  const lowerPath = path.toLowerCase();
  const normalizedPath = routeMapping[lowerPath];
  
  // Verificar se precisa normalizar
  if (normalizedPath && normalizedPath !== path) {
    // Verificar se já tentamos normalizar esta URL para evitar loops
    const normalizationKey = `normalized_${path}`;
    const alreadyNormalized = sessionStorage.getItem(normalizationKey);
    
    if (!alreadyNormalized) {
      // Marcar que estamos normalizando
      sessionStorage.setItem(normalizationKey, 'true');
      const search = window.location.search;
      const hash = window.location.hash;
      console.log('🔧 [PRE-RENDER] Normalizando URL:', path, '→', normalizedPath);
      window.location.replace(`${normalizedPath}${search}${hash}`);
    } else {
      // Se já tentamos normalizar, limpar a flag e deixar o Expo Router processar
      sessionStorage.removeItem(normalizationKey);
    }
  }
}

export default function RootLayout() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Verificar se já normalizamos nesta sessão para evitar loops
    const currentPath = window.location.pathname;
    const normalizationKey = `normalized_${currentPath}`;
    const alreadyNormalized = sessionStorage.getItem(normalizationKey);
    
    // Se já normalizamos, limpar a flag e não tentar novamente
    if (alreadyNormalized) {
      sessionStorage.removeItem(normalizationKey);
      return; // Não fazer mais normalizações
    }
    
    let isNormalizing = false;
    let hasNormalized = false;
    
    const normalizeCurrentUrl = () => {
      // Evitar loops infinitos
      if (isNormalizing) return;
      
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      
      // Normalizar a URL se necessário
      const normalizedPath = normalizeUrl(path);
      
      if (normalizedPath && normalizedPath !== path) {
        // Verificar se já tentamos normalizar para evitar loops
        const checkKey = `normalized_${path}`;
        if (sessionStorage.getItem(checkKey)) {
          return; // Já tentamos, não tentar novamente
        }
        
        isNormalizing = true;
        hasNormalized = true;
        sessionStorage.setItem(checkKey, 'true');
        console.log('🔧 Normalizando URL:', path, '→', normalizedPath);
        
        // Usar replace para não adicionar ao histórico
        window.location.replace(`${normalizedPath}${search}${hash}`);
        return;
      }
    };
    
    // Normalizar IMEDIATAMENTE na montagem apenas se necessário
    const path = window.location.pathname;
    const normalizedPath = normalizeUrl(path);
    if (normalizedPath && normalizedPath !== path) {
      // Verificar se já tentamos normalizar
      const checkKey = `normalized_${path}`;
      if (!sessionStorage.getItem(checkKey)) {
        sessionStorage.setItem(checkKey, 'true');
        console.log('🔧 Normalizando URL imediatamente:', path, '→', normalizedPath);
        const search = window.location.search;
        const hash = window.location.hash;
        window.location.replace(`${normalizedPath}${search}${hash}`);
        return; // Não continuar com a renderização se redirecionou
      }
    }
    
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

