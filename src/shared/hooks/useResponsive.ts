import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  return {
    width,
    height,
    isLandscape,
    isTablet,
    isDesktop,
    isMobile,
    sidebarWidth: isDesktop ? 340 : isTablet ? 300 : width,
  };
}
