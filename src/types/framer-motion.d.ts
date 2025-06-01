declare module "framer-motion" {
  export const motion: any;
  export interface AnimationProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
    onMouseLeave?: () => void;
    whileHover?: any;
    whileTap?: any;
  }
  export type Variants = any; // Add this if needed by your usage of variants
  export type TargetAndTransition = any; // Add this if needed
  export type MotionValue<T = any> = any; // Add this if needed
  // Add other types from framer-motion that you use if necessary
} 