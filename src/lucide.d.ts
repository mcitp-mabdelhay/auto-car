declare module 'lucide-react-native/dist/esm/icons/*' {
  import type { ForwardRefExoticComponent } from 'react';
  import type { SvgProps } from 'react-native-svg';

  export interface LucideProps extends SvgProps {
    size?: string | number;
    color?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
    'data-testid'?: string;
  }
  export type LucideIcon = ForwardRefExoticComponent<LucideProps>;
  const Icon: LucideIcon;
  export default Icon;
}
