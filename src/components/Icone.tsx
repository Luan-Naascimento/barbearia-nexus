// Ícones simples desenhados com SVG
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type NomeIcone =
  | 'inicio' | 'agenda' | 'perfil' | 'painel' | 'equipe' | 'relogio' | 'seta'
  | 'voltar' | 'check' | 'tesoura' | 'qr' | 'maisUsuario' | 'mais' | 'menos';

export function Icone({ nome, cor = '#0E0E0F', tamanho = 22, espessura = 2 }: {
  nome: NomeIcone; cor?: string; tamanho?: number; espessura?: number;
}) {
  const p = {
    stroke: cor,
    strokeWidth: espessura,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  let miolo: React.ReactNode = null;
  switch (nome) {
    case 'inicio':
      miolo = <Path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" {...p} />;
      break;
    case 'agenda':
      miolo = (<>
        <Rect x="3" y="4" width="18" height="17" rx="3" {...p} />
        <Path d="M16 2v4M8 2v4M3 10h18" {...p} />
      </>);
      break;
    case 'perfil':
      miolo = (<>
        <Circle cx="12" cy="8" r="4" {...p} />
        <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" {...p} />
      </>);
      break;
    case 'painel':
      miolo = (<>
        <Rect x="3" y="3" width="7" height="7" rx="2" {...p} />
        <Rect x="14" y="3" width="7" height="7" rx="2" {...p} />
        <Rect x="3" y="14" width="7" height="7" rx="2" {...p} />
        <Rect x="14" y="14" width="7" height="7" rx="2" {...p} />
      </>);
      break;
    case 'equipe':
      miolo = (<>
        <Circle cx="9" cy="8" r="4" {...p} />
        <Path d="M2 21c0-4 3-6 7-6s7 2 7 6" {...p} />
        <Path d="M17 4a4 4 0 0 1 0 8M22 21c0-3-2-5-5-5.5" {...p} />
      </>);
      break;
    case 'relogio':
      miolo = (<>
        <Circle cx="12" cy="12" r="9" {...p} />
        <Path d="M12 7v5l3 2" {...p} />
      </>);
      break;
    case 'seta':
      miolo = <Path d="M9 5l7 7-7 7" {...p} />;
      break;
    case 'voltar':
      miolo = <Path d="M15 5l-7 7 7 7" {...p} />;
      break;
    case 'check':
      miolo = <Path d="M5 12l5 5 9-10" {...p} />;
      break;
    case 'tesoura':
      miolo = (<>
        <Circle cx="6" cy="6" r="3" {...p} />
        <Circle cx="6" cy="18" r="3" {...p} />
        <Path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" {...p} />
      </>);
      break;
    case 'qr':
      miolo = (<>
        <Rect x="3" y="3" width="7" height="7" rx="1" {...p} />
        <Rect x="14" y="3" width="7" height="7" rx="1" {...p} />
        <Rect x="3" y="14" width="7" height="7" rx="1" {...p} />
        <Path d="M14 14h3v3h-3zM20 14v1M14 20h1M18 18h3v3h-3z" {...p} />
      </>);
      break;
    case 'maisUsuario':
      miolo = (<>
        <Circle cx="9" cy="8" r="4" {...p} />
        <Path d="M2 21c0-4 3-6 7-6s7 2 7 6" {...p} />
        <Path d="M19 8v6M16 11h6" {...p} />
      </>);
      break;
    case 'mais':
      miolo = <Path d="M12 5v14M5 12h14" {...p} />;
      break;
    case 'menos':
      miolo = <Path d="M5 12h14" {...p} />;
      break;
  }
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24">
      {miolo}
    </Svg>
  );
}
