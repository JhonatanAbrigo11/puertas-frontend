import React from 'react';
import { View, StyleSheet, Text, Image, Platform } from 'react-native';
import Svg, {
  Rect,
  Line,
  Polygon,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import { colors } from '../theme/colors';

interface TechnicalIllustrationProps {
  type: string;
  imageUri?: string;
  width?: number | string;
  height?: number;
  widthDimension?: number;
  heightDimension?: number;
  showDimensions?: boolean;
  isThumbnail?: boolean;
}

export const TechnicalIllustration: React.FC<TechnicalIllustrationProps> = ({
  type,
  imageUri,
  width = '100%',
  height = 240,
  widthDimension,
  heightDimension,
  showDimensions = false,
  isThumbnail = false,
}) => {
  const isCustomImage =
    Boolean(imageUri) ||
    Boolean(
      type &&
        (type.startsWith('data:image') ||
          type.startsWith('http://') ||
          type.startsWith('https://') ||
          type.startsWith('blob:') ||
          type.startsWith('file://'))
    );

  if (isCustomImage) {
    const srcUri = imageUri || type;
    return (
      <View
        style={[
          styles.container,
          {
            width: width as any,
            height,
            backgroundColor: isThumbnail ? 'transparent' : '#FFFFFF',
          },
        ]}
      >
        <Image
          source={{ uri: srcUri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* Center Dimension Labels */}
        {showDimensions && widthDimension && heightDimension && (
          <View style={styles.dimensionOverlay} pointerEvents="none">
            {/* Width guideline (bottom) */}
            <View style={styles.widthGuidelineRow}>
              <View style={styles.guidelineDot} />
              <View style={styles.guidelineLine} />
              <View style={styles.dimensionPill}>
                <Text style={styles.dimensionPillText}>
                  Ancho: {widthDimension} cm
                </Text>
              </View>
              <View style={styles.guidelineLine} />
              <View style={styles.guidelineDot} />
            </View>

            {/* Height guideline (right) */}
            <View style={styles.heightGuidelineCol}>
              <View style={styles.guidelineDot} />
              <View style={styles.guidelineLineVertical} />
              <View style={styles.dimensionPill}>
                <Text style={styles.dimensionPillText}>
                  Alto: {heightDimension} cm
                </Text>
              </View>
              <View style={styles.guidelineLineVertical} />
              <View style={styles.guidelineDot} />
            </View>
          </View>
        )}
      </View>
    );
  }

  const strokeColor = '#1E293B';
  const frameColor = '#334155';
  const aluminumFill = '#E2E8F0';
  const aluminumLight = '#F1F5F9';
  const glassFill = 'url(#glassGrad)';
  const frostedGlassFill = 'url(#frostedGlassGrad)';
  const acmFill = 'url(#acmGrad)';
  const polyFill = 'url(#polyGrad)';

  const renderGraphic = () => {
    switch (type) {
      // 1. VENTANA CORREDIZA 2 HOJAS
      case 'window_sliding_2h':
        return (
          <G>
            {/* Outer Frame */}
            <Rect
              x="20"
              y="20"
              width="260"
              height="180"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="4"
              rx="2"
            />
            {/* Left Sash (Behind) */}
            <Rect
              x="28"
              y="28"
              width="128"
              height="164"
              fill={aluminumLight}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            <Rect
              x="40"
              y="40"
              width="104"
              height="140"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Glass Reflection */}
            <Line
              x1="50"
              y1="160"
              x2="120"
              y2="50"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.6"
            />

            {/* Right Sash (Front) */}
            <Rect
              x="144"
              y="28"
              width="128"
              height="164"
              fill={aluminumLight}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            <Rect
              x="156"
              y="40"
              width="104"
              height="140"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Glass Reflection */}
            <Line
              x1="166"
              y1="160"
              x2="236"
              y2="50"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.6"
            />

            {/* Center Overlap Lock & Handles */}
            <Rect
              x="144"
              y="28"
              width="8"
              height="164"
              fill="#CBD5E1"
              stroke={strokeColor}
              strokeWidth="1"
            />
            <Rect
              x="147"
              y="100"
              width="3"
              height="20"
              fill="#0F4C81"
              rx="1.5"
            />
            <Rect
              x="152"
              y="100"
              width="3"
              height="20"
              fill="#0F4C81"
              rx="1.5"
            />
          </G>
        );

      // 2. VENTANA CORREDIZA 3 HOJAS
      case 'window_sliding_3h':
        return (
          <G>
            <Rect
              x="15"
              y="25"
              width="270"
              height="170"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="4"
              rx="2"
            />
            {/* Sash 1 */}
            <Rect
              x="23"
              y="33"
              width="86"
              height="154"
              fill={aluminumLight}
              stroke={strokeColor}
              strokeWidth="2"
            />
            <Rect
              x="31"
              y="41"
              width="70"
              height="138"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Sash 2 */}
            <Rect
              x="107"
              y="33"
              width="86"
              height="154"
              fill={aluminumLight}
              stroke={strokeColor}
              strokeWidth="2"
            />
            <Rect
              x="115"
              y="41"
              width="70"
              height="138"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Sash 3 */}
            <Rect
              x="191"
              y="33"
              width="86"
              height="154"
              fill={aluminumLight}
              stroke={strokeColor}
              strokeWidth="2"
            />
            <Rect
              x="199"
              y="41"
              width="70"
              height="138"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Subtle arrows */}
            <Path
              d="M 50 110 L 80 110 M 70 105 L 80 110 L 70 115"
              stroke="#0F4C81"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <Path
              d="M 240 110 L 210 110 M 220 105 L 210 110 L 220 115"
              stroke="#0F4C81"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </G>
        );

      // 3. VENTANA BATIENTE
      case 'window_casement':
        return (
          <G>
            <Rect
              x="30"
              y="20"
              width="240"
              height="180"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="4"
              rx="2"
            />
            <Rect
              x="42"
              y="32"
              width="216"
              height="156"
              fill={aluminumLight}
              stroke={strokeColor}
              strokeWidth="3"
            />
            <Rect
              x="56"
              y="46"
              width="188"
              height="128"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Hinges */}
            <Rect x="38" y="45" width="6" height="18" fill="#475569" rx="1" />
            <Rect x="38" y="155" width="6" height="18" fill="#475569" rx="1" />
            {/* Handle */}
            <Rect
              x="244"
              y="102"
              width="6"
              height="20"
              fill="#0F4C81"
              rx="1.5"
            />
            <Line
              x1="240"
              y1="112"
              x2="246"
              y2="112"
              stroke="#0F4C81"
              strokeWidth="3"
            />
            {/* Swing lines (dashed) */}
            <Line
              x1="42"
              y1="32"
              x2="258"
              y2="110"
              stroke="#0F4C81"
              strokeWidth="1.2"
              strokeDasharray="4,4"
            />
            <Line
              x1="42"
              y1="188"
              x2="258"
              y2="110"
              stroke="#0F4C81"
              strokeWidth="1.2"
              strokeDasharray="4,4"
            />
          </G>
        );

      // 4. VENTANA PROYECTABLE
      case 'window_projecting':
        return (
          <G>
            <Rect
              x="30"
              y="20"
              width="240"
              height="180"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="4"
              rx="2"
            />
            <Rect
              x="42"
              y="32"
              width="216"
              height="156"
              fill={aluminumLight}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            <Rect
              x="56"
              y="46"
              width="188"
              height="128"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Scissor friction arms indicators */}
            <Line
              x1="44"
              y1="34"
              x2="150"
              y2="186"
              stroke="#0F4C81"
              strokeWidth="1.2"
              strokeDasharray="4,4"
            />
            <Line
              x1="256"
              y1="34"
              x2="150"
              y2="186"
              stroke="#0F4C81"
              strokeWidth="1.2"
              strokeDasharray="4,4"
            />
            {/* Bottom handle */}
            <Rect
              x="140"
              y="172"
              width="20"
              height="6"
              fill="#0F4C81"
              rx="1.5"
            />
          </G>
        );

      // 5. MAMPARA FIJA
      case 'partition_fixed':
        return (
          <G>
            {/* Top & Bottom U Channels */}
            <Rect
              x="40"
              y="18"
              width="220"
              height="10"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="2"
            />
            <Rect
              x="40"
              y="192"
              width="220"
              height="10"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="2"
            />
            <Rect
              x="40"
              y="28"
              width="8"
              height="164"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="2"
            />
            {/* Big Glass Panel */}
            <Rect
              x="48"
              y="28"
              width="210"
              height="164"
              fill={glassFill}
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            {/* Glass polish bevels */}
            <Line
              x1="65"
              y1="180"
              x2="230"
              y2="40"
              stroke="white"
              strokeWidth="3"
              strokeOpacity="0.7"
            />
            <Line
              x1="85"
              y1="185"
              x2="245"
              y2="50"
              stroke="white"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
          </G>
        );

      // 6. MAMPARA CORREDIZA
      case 'partition_sliding':
        return (
          <G>
            {/* Top Inox Track */}
            <Rect
              x="20"
              y="18"
              width="260"
              height="12"
              fill="#CBD5E1"
              stroke="#475569"
              strokeWidth="2"
            />
            <Circle cx="80" cy="24" r="7" fill="#0F4C81" />
            <Circle cx="130" cy="24" r="7" fill="#0F4C81" />
            <Circle cx="190" cy="24" r="7" fill="#0F4C81" />
            <Circle cx="240" cy="24" r="7" fill="#0F4C81" />

            {/* Fixed Glass Panel (Left) */}
            <Rect
              x="30"
              y="32"
              width="115"
              height="160"
              fill={glassFill}
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            {/* Sliding Glass Panel (Right) */}
            <Rect
              x="145"
              y="32"
              width="125"
              height="160"
              fill={glassFill}
              stroke="#0284C7"
              strokeWidth="2"
            />
            {/* Inox Handles */}
            <Rect
              x="160"
              y="85"
              width="6"
              height="60"
              fill="#0F4C81"
              rx="3"
            />
            <Line
              x1="163"
              y1="95"
              x2="163"
              y2="135"
              stroke="white"
              strokeWidth="2"
            />
            {/* Bottom Guide */}
            <Rect
              x="20"
              y="194"
              width="260"
              height="8"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="1.5"
            />
          </G>
        );

      // 7. DIVISIÓN DE OFICINA
      case 'office_partition':
        return (
          <G>
            <Rect
              x="20"
              y="20"
              width="260"
              height="180"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="3.5"
            />
            {/* Grid Mullions */}
            <Rect
              x="100"
              y="20"
              width="8"
              height="180"
              fill={frameColor}
            />
            <Rect
              x="190"
              y="20"
              width="8"
              height="180"
              fill={frameColor}
            />
            <Rect
              x="20"
              y="70"
              width="260"
              height="6"
              fill={frameColor}
            />
            {/* Top Panels (Clear Glass) */}
            <Rect
              x="24"
              y="24"
              width="74"
              height="44"
              fill={glassFill}
            />
            <Rect
              x="110"
              y="24"
              width="78"
              height="44"
              fill={glassFill}
            />
            <Rect
              x="200"
              y="24"
              width="76"
              height="44"
              fill={glassFill}
            />
            {/* Bottom Panels (Frosted / Satin) */}
            <Rect
              x="24"
              y="78"
              width="74"
              height="118"
              fill={frostedGlassFill}
              stroke="#BAE6FD"
              strokeWidth="1"
            />
            <Rect
              x="110"
              y="78"
              width="78"
              height="118"
              fill={frostedGlassFill}
              stroke="#BAE6FD"
              strokeWidth="1"
            />
            <Rect
              x="200"
              y="78"
              width="76"
              height="118"
              fill={frostedGlassFill}
              stroke="#BAE6FD"
              strokeWidth="1"
            />
            {/* Privacy lines */}
            <Line
              x1="28"
              y1="130"
              x2="94"
              y2="130"
              stroke="#0284C7"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            <Line
              x1="114"
              y1="130"
              x2="184"
              y2="130"
              stroke="#0284C7"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            <Line
              x1="204"
              y1="130"
              x2="272"
              y2="130"
              stroke="#0284C7"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
          </G>
        );

      // 8. MAMPARA DE BAÑO
      case 'shower_partition':
        return (
          <G>
            <Rect
              x="40"
              y="20"
              width="220"
              height="180"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="3"
            />
            {/* Top Inox bar */}
            <Rect
              x="35"
              y="25"
              width="230"
              height="8"
              fill="#94A3B8"
              stroke="#475569"
              strokeWidth="1"
            />
            {/* Fixed Panel */}
            <Rect
              x="46"
              y="35"
              width="98"
              height="160"
              fill={frostedGlassFill}
              stroke="#7DD3FC"
              strokeWidth="1"
            />
            {/* Sliding Panel */}
            <Rect
              x="148"
              y="35"
              width="106"
              height="160"
              fill={frostedGlassFill}
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            {/* Shower Water Droplets / Decorative Frosting */}
            <Line
              x1="55"
              y1="80"
              x2="135"
              y2="80"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.8"
            />
            <Line
              x1="55"
              y1="120"
              x2="135"
              y2="120"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.8"
            />
            <Line
              x1="155"
              y1="80"
              x2="245"
              y2="80"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.8"
            />
            <Line
              x1="155"
              y1="120"
              x2="245"
              y2="120"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.8"
            />
            {/* Shower Handle */}
            <Circle cx="165" cy="115" r="5" fill="#0F4C81" />
          </G>
        );

      // 9. FACHADA ACM
      case 'facade_acm':
        return (
          <G>
            {/* Substructure grid */}
            <Rect
              x="20"
              y="20"
              width="260"
              height="180"
              fill="#1E293B"
              stroke="#0F172A"
              strokeWidth="2"
            />
            {/* ACM Modular Panels (2x2 Grid) */}
            <Rect
              x="26"
              y="26"
              width="120"
              height="80"
              fill={acmFill}
              stroke="#0F172A"
              strokeWidth="2"
              rx="2"
            />
            <Rect
              x="154"
              y="26"
              width="120"
              height="80"
              fill={acmFill}
              stroke="#0F172A"
              strokeWidth="2"
              rx="2"
            />
            <Rect
              x="26"
              y="114"
              width="120"
              height="80"
              fill={acmFill}
              stroke="#0F172A"
              strokeWidth="2"
              rx="2"
            />
            <Rect
              x="154"
              y="114"
              width="120"
              height="80"
              fill={acmFill}
              stroke="#0F172A"
              strokeWidth="2"
              rx="2"
            />
            {/* Metallic Highlights on ACM Panels */}
            <Line
              x1="30"
              y1="30"
              x2="140"
              y2="30"
              stroke="white"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
            <Line
              x1="158"
              y1="30"
              x2="268"
              y2="30"
              stroke="white"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
            <Line
              x1="30"
              y1="118"
              x2="140"
              y2="118"
              stroke="white"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
            <Line
              x1="158"
              y1="118"
              x2="268"
              y2="118"
              stroke="white"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
          </G>
        );

      // 10. FACHADA ACM + VIDRIO
      case 'facade_acm_glass':
        return (
          <G>
            <Rect
              x="20"
              y="20"
              width="260"
              height="180"
              fill="#0F172A"
              stroke="#1E293B"
              strokeWidth="2"
            />
            {/* Left Side: ACM Panels */}
            <Rect
              x="25"
              y="25"
              width="115"
              height="80"
              fill={acmFill}
              stroke="#0F172A"
              strokeWidth="2"
            />
            <Rect
              x="25"
              y="115"
              width="115"
              height="80"
              fill={acmFill}
              stroke="#0F172A"
              strokeWidth="2"
            />
            {/* Right Side: Curtain Wall Glass */}
            <Rect
              x="148"
              y="25"
              width="127"
              height="170"
              fill={glassFill}
              stroke="#38BDF8"
              strokeWidth="2"
            />
            <Line
              x1="148"
              y1="110"
              x2="275"
              y2="110"
              stroke="#334155"
              strokeWidth="3"
            />
            <Line
              x1="210"
              y1="25"
              x2="210"
              y2="195"
              stroke="#334155"
              strokeWidth="3"
            />
            {/* Glass sheen */}
            <Line
              x1="160"
              y1="170"
              x2="260"
              y2="40"
              stroke="white"
              strokeWidth="2.5"
              strokeOpacity="0.7"
            />
          </G>
        );

      // 11. REVESTIMIENTO ACM
      case 'acm_cladding':
        return (
          <G>
            <Rect
              x="30"
              y="20"
              width="240"
              height="180"
              fill="#1E293B"
              rx="4"
            />
            {/* Horizontal Grooved ACM bands */}
            <Rect
              x="36"
              y="26"
              width="228"
              height="35"
              fill={acmFill}
              stroke="#0F172A"
              strokeWidth="1.5"
            />
            <Rect
              x="36"
              y="67"
              width="228"
              height="35"
              fill={acmFill}
              stroke="#0F172A"
              strokeWidth="1.5"
            />
            <Rect
              x="36"
              y="108"
              width="228"
              height="35"
              fill={acmFill}
              stroke="#0F172A"
              strokeWidth="1.5"
            />
            <Rect
              x="36"
              y="149"
              width="228"
              height="45"
              fill={acmFill}
              stroke="#0F172A"
              strokeWidth="1.5"
            />
            <Line
              x1="40"
              y1="30"
              x2="260"
              y2="30"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          </G>
        );

      // 12. VITRINA RECTA
      case 'showcase_straight':
        return (
          <G>
            {/* Top and Bottom Aluminum Frames */}
            <Rect
              x="25"
              y="30"
              width="250"
              height="14"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="2"
            />
            <Rect
              x="25"
              y="170"
              width="250"
              height="20"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="2"
            />
            {/* Vertical Corner Pillars */}
            <Rect
              x="25"
              y="30"
              width="10"
              height="160"
              fill={frameColor}
            />
            <Rect
              x="265"
              y="30"
              width="10"
              height="160"
              fill={frameColor}
            />
            {/* Main Glass Enclosure */}
            <Rect
              x="35"
              y="44"
              width="230"
              height="126"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Glass Shelves */}
            <Line
              x1="38"
              y1="85"
              x2="262"
              y2="85"
              stroke="#0284C7"
              strokeWidth="3"
            />
            <Line
              x1="38"
              y1="128"
              x2="262"
              y2="128"
              stroke="#0284C7"
              strokeWidth="3"
            />
            {/* Legs */}
            <Rect x="35" y="190" width="8" height="10" fill="#475569" />
            <Rect x="257" y="190" width="8" height="10" fill="#475569" />
          </G>
        );

      // 13. VITRINA ESQUINERA
      case 'showcase_corner':
        return (
          <G>
            {/* 3D / Isometric perspective showcase */}
            <Polygon
              points="150,20 270,60 150,90 30,60"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="2"
            />
            <Polygon
              points="30,60 150,90 150,180 30,150"
              fill={glassFill}
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            <Polygon
              points="150,90 270,60 270,150 150,180"
              fill={glassFill}
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            <Polygon
              points="150,180 270,150 150,120 30,150"
              fill={aluminumLight}
              stroke={frameColor}
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            {/* Corner Pillar */}
            <Line
              x1="150"
              y1="20"
              x2="150"
              y2="185"
              stroke="#0F4C81"
              strokeWidth="3"
            />
            <Line
              x1="30"
              y1="60"
              x2="30"
              y2="150"
              stroke={frameColor}
              strokeWidth="2"
            />
            <Line
              x1="270"
              y1="60"
              x2="270"
              y2="150"
              stroke={frameColor}
              strokeWidth="2"
            />
          </G>
        );

      // 14. VITRINA PUERTAS CORREDIZAS
      case 'showcase_sliding_doors':
        return (
          <G>
            <Rect
              x="25"
              y="30"
              width="250"
              height="160"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="3"
              rx="2"
            />
            {/* Sliding Glass Track */}
            <Rect
              x="33"
              y="40"
              width="120"
              height="130"
              fill={glassFill}
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            <Rect
              x="147"
              y="40"
              width="120"
              height="130"
              fill={glassFill}
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            {/* Glass Overlap & Showcase Saw Lock */}
            <Rect
              x="138"
              y="105"
              width="20"
              height="6"
              fill="#0F4C81"
              rx="2"
            />
            <Circle cx="148" cy="108" r="1.5" fill="white" />
            <Line
              x1="38"
              y1="100"
              x2="256"
              y2="100"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
          </G>
        );

      // 15. VITRINA EXHIBIDORA (TORRE)
      case 'showcase_tower':
        return (
          <G>
            {/* Tall Tower Showcase */}
            <Rect
              x="80"
              y="15"
              width="140"
              height="190"
              fill={glassFill}
              stroke={frameColor}
              strokeWidth="3"
            />
            {/* Top Canopy (LED housing) */}
            <Rect
              x="75"
              y="10"
              width="150"
              height="16"
              fill={frameColor}
              rx="2"
            />
            <Line
              x1="90"
              y1="22"
              x2="210"
              y2="22"
              stroke="#FDE047"
              strokeWidth="2"
            />
            {/* Base Cabinet */}
            <Rect
              x="75"
              y="170"
              width="150"
              height="35"
              fill={frameColor}
              rx="2"
            />
            {/* 3 Intermediate Glass Shelves */}
            <Line
              x1="82"
              y1="60"
              x2="218"
              y2="60"
              stroke="#0284C7"
              strokeWidth="3"
            />
            <Line
              x1="82"
              y1="100"
              x2="218"
              y2="100"
              stroke="#0284C7"
              strokeWidth="3"
            />
            <Line
              x1="82"
              y1="140"
              x2="218"
              y2="140"
              stroke="#0284C7"
              strokeWidth="3"
            />
            {/* Lock */}
            <Circle cx="205" cy="100" r="3" fill="#0F4C81" />
          </G>
        );

      // 16. PÉRGOLA DE ALUMINIO
      case 'pergola_aluminum':
        return (
          <G>
            {/* Isometric Rafters and Beams */}
            {/* Columns */}
            <Rect x="40" y="80" width="12" height="120" fill="#1E293B" />
            <Rect x="248" y="80" width="12" height="120" fill="#1E293B" />
            <Rect x="100" y="55" width="10" height="110" fill="#334155" />
            <Rect x="200" y="55" width="10" height="110" fill="#334155" />

            {/* Main Longitudinal Beams */}
            <Polygon
              points="25,75 275,75 265,85 15,85"
              fill="#0F172A"
            />
            <Polygon
              points="85,50 225,50 215,60 75,60"
              fill="#1E293B"
            />

            {/* Cross Rafters (Lamas) */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const xOffset = 35 + i * 36;
              return (
                <Polygon
                  key={i}
                  points={`${xOffset},45 ${xOffset + 25},78 ${xOffset + 18},82 ${xOffset - 7},49`}
                  fill="#475569"
                  stroke="#0F172A"
                  strokeWidth="0.8"
                />
              );
            })}
          </G>
        );

      // 17. PÉRGOLA CON POLICARBONATO
      case 'pergola_polycarbonate':
        return (
          <G>
            {/* Aluminum Posts */}
            <Rect x="40" y="85" width="12" height="115" fill="#334155" />
            <Rect x="248" y="85" width="12" height="115" fill="#334155" />
            {/* Support Beam */}
            <Rect x="30" y="80" width="240" height="12" fill="#1E293B" rx="1" />
            {/* Slanted Polycarbonate Roof */}
            <Polygon
              points="20,40 280,40 270,80 30,80"
              fill={polyFill}
              stroke="#0284C7"
              strokeWidth="2"
            />
            {/* Alveolar Ribs */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Line
                key={i}
                x1={45 + i * 30}
                y1="40"
                x2={40 + i * 30}
                y2="80"
                stroke="#0284C7"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
            ))}
            {/* Sun Rays Effect */}
            <Line
              x1="70"
              y1="50"
              x2="230"
              y2="50"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.8"
            />
          </G>
        );

      // 18. CUBIERTA POLICARBONATO COMPACTO
      case 'roof_compact_poly':
        return (
          <G>
            {/* Curved / Angled Canopy */}
            <Path
              d="M 30 70 Q 150 30 270 70 L 260 85 Q 150 48 40 85 Z"
              fill={polyFill}
              stroke="#0284C7"
              strokeWidth="2"
            />
            {/* Metal Support Brackets */}
            <Polygon points="40,85 80,150 65,150 30,85" fill="#334155" />
            <Polygon
              points="260,85 220,150 235,150 270,85"
              fill="#334155"
            />
            {/* Wall Mount Plate */}
            <Rect x="20" y="60" width="10" height="100" fill="#1E293B" />
          </G>
        );

      // 19. PUERTA CORREDIZA
      case 'door_sliding':
        return (
          <G>
            <Rect
              x="30"
              y="15"
              width="240"
              height="190"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="4"
              rx="2"
            />
            {/* Left Leaf (Fixed/Slide) */}
            <Rect
              x="38"
              y="23"
              width="116"
              height="174"
              fill={aluminumLight}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            <Rect
              x="50"
              y="35"
              width="92"
              height="150"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Right Leaf (Active) */}
            <Rect
              x="146"
              y="23"
              width="116"
              height="174"
              fill={aluminumLight}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            <Rect
              x="158"
              y="35"
              width="92"
              height="150"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Long Stainless Steel Pull Handle */}
            <Rect
              x="162"
              y="85"
              width="6"
              height="60"
              fill="#0F4C81"
              rx="3"
            />
            <Circle cx="165" cy="95" r="1.5" fill="white" />
            <Circle cx="165" cy="135" r="1.5" fill="white" />
          </G>
        );

      // 20. PUERTA BATIENTE
      case 'door_swing':
        return (
          <G>
            <Rect
              x="50"
              y="15"
              width="200"
              height="190"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="4"
              rx="2"
            />
            {/* Door Leaf */}
            <Rect
              x="62"
              y="27"
              width="176"
              height="168"
              fill={aluminumLight}
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* Glass Insert */}
            <Rect
              x="76"
              y="41"
              width="148"
              height="140"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* 3 Heavy Duty Hinges */}
            <Rect x="58" y="40" width="5" height="16" fill="#334155" rx="1" />
            <Rect x="58" y="105" width="5" height="16" fill="#334155" rx="1" />
            <Rect x="58" y="165" width="5" height="16" fill="#334155" rx="1" />
            {/* Door Handle & Lock escutcheon */}
            <Rect
              x="220"
              y="108"
              width="8"
              height="26"
              fill="#0F4C81"
              rx="2"
            />
            <Line
              x1="212"
              y1="114"
              x2="224"
              y2="114"
              stroke="#0F4C81"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Swing Arc lines */}
            <Line
              x1="62"
              y1="27"
              x2="238"
              y2="110"
              stroke="#0F4C81"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <Line
              x1="62"
              y1="195"
              x2="238"
              y2="110"
              stroke="#0F4C81"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          </G>
        );

      // 21. PUERTA DE ALUMINIO CIEGA
      case 'door_aluminum_solid':
        return (
          <G>
            <Rect
              x="50"
              y="15"
              width="200"
              height="190"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="4"
              rx="2"
            />
            {/* Leaf */}
            <Rect
              x="62"
              y="27"
              width="176"
              height="168"
              fill="#334155"
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* Horizontal Aluminum Louver Grooves */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Rect
                key={i}
                x="72"
                y={36 + i * 16}
                width="156"
                height="11"
                fill={aluminumFill}
                stroke="#1E293B"
                strokeWidth="1"
                rx="1"
              />
            ))}
            {/* Security Lock Handle */}
            <Rect
              x="218"
              y="105"
              width="10"
              height="30"
              fill="#0F4C81"
              rx="2"
            />
          </G>
        );

      // 22. PUERTA CORREDIZA DE VIDRIO (SPIDER)
      case 'door_glass_spider':
        return (
          <G>
            {/* Top Stainless Round Pipe */}
            <Rect
              x="20"
              y="20"
              width="260"
              height="10"
              fill="#94A3B8"
              stroke="#475569"
              strokeWidth="1.5"
              rx="5"
            />
            {/* Spider Glass Clamps & Wheels */}
            <Circle cx="80" cy="25" r="10" fill="#0F4C81" />
            <Circle cx="80" cy="25" r="4" fill="white" />
            <Line x1="80" y1="35" x2="80" y2="50" stroke="#0F4C81" strokeWidth="4" />

            <Circle cx="220" cy="25" r="10" fill="#0F4C81" />
            <Circle cx="220" cy="25" r="4" fill="white" />
            <Line x1="220" y1="35" x2="220" y2="50" stroke="#0F4C81" strokeWidth="4" />

            {/* Pure Frameless Glass Leaf */}
            <Rect
              x="50"
              y="48"
              width="200"
              height="150"
              fill={glassFill}
              stroke="#0284C7"
              strokeWidth="2.5"
            />
            {/* Stainless Steel Long Handle */}
            <Rect
              x="70"
              y="85"
              width="7"
              height="75"
              fill="#0F4C81"
              rx="3.5"
            />
            {/* Glass Sheen */}
            <Line
              x1="90"
              y1="180"
              x2="220"
              y2="60"
              stroke="white"
              strokeWidth="3"
              strokeOpacity="0.7"
            />
          </G>
        );

      // DEFAULT FALLBACK
      default:
        return (
          <G>
            <Rect
              x="30"
              y="25"
              width="240"
              height="170"
              fill={aluminumFill}
              stroke={frameColor}
              strokeWidth="3"
            />
            <Rect
              x="45"
              y="40"
              width="210"
              height="140"
              fill={glassFill}
              stroke="#94A3B8"
              strokeWidth="1"
            />
          </G>
        );
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 300 220"
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          {/* Glass Gradient */}
          <LinearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
            <Stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.7" />
            <Stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.85" />
          </LinearGradient>

          {/* Frosted / Satin Glass Gradient */}
          <LinearGradient
            id="frostedGlassGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#F0F9FF" stopOpacity="0.95" />
            <Stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.95" />
          </LinearGradient>

          {/* ACM Metal Gradient */}
          <LinearGradient id="acmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#475569" />
            <Stop offset="50%" stopColor="#64748B" />
            <Stop offset="100%" stopColor="#334155" />
          </LinearGradient>

          {/* Polycarbonate Gradient */}
          <LinearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
          </LinearGradient>
        </Defs>

        {/* Blueprint background grid for large view */}
        {!isThumbnail && (
          <G opacity="0.35">
            {[20, 50, 80, 110, 140, 170, 200].map((y) => (
              <Line
                key={`h-${y}`}
                x1="10"
                y1={y}
                x2="290"
                y2={y}
                stroke="#CBD5E1"
                strokeWidth="0.5"
                strokeDasharray="2,4"
              />
            ))}
            {[30, 60, 90, 120, 150, 180, 210, 240, 270].map((x) => (
              <Line
                key={`v-${x}`}
                x1={x}
                y1="10"
                x2={x}
                y2="210"
                stroke="#CBD5E1"
                strokeWidth="0.5"
                strokeDasharray="2,4"
              />
            ))}
          </G>
        )}

        {/* Render the Product Graphic */}
        {renderGraphic()}

        {/* Dimension Callout Lines when requested */}
        {showDimensions && widthDimension && heightDimension && (
          <G>
            {/* Bottom Width Dimension Line */}
            <Line
              x1="30"
              y1="210"
              x2="105"
              y2="210"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />
            <Line
              x1="30"
              y1="205"
              x2="30"
              y2="215"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />
            <Line
              x1="195"
              y1="210"
              x2="270"
              y2="210"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />
            <Line
              x1="270"
              y1="205"
              x2="270"
              y2="215"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />

            {/* Right Height Dimension Line */}
            <Line
              x1="285"
              y1="25"
              x2="285"
              y2="85"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />
            <Line
              x1="280"
              y1="25"
              x2="290"
              y2="25"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />
            <Line
              x1="285"
              y1="135"
              x2="285"
              y2="195"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />
            <Line
              x1="280"
              y1="195"
              x2="290"
              y2="195"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />
          </G>
        )}
      </Svg>

      {/* Center Dimension Labels */}
      {showDimensions && widthDimension && heightDimension && (
        <>
          <View style={styles.bottomDimensionTag}>
            <Text style={styles.dimensionTagText}>
              Ancho: {widthDimension} cm
            </Text>
          </View>
          <View style={styles.rightDimensionTag}>
            <Text style={styles.dimensionTagText}>
              Alto: {heightDimension} cm
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  dimensionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  widthGuidelineRow: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heightGuidelineCol: {
    position: 'absolute',
    right: 14,
    top: 20,
    bottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
      } as any,
    }),
  },
  guidelineLine: {
    flex: 1,
    height: 1.5,
    borderStyle: 'dashed',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  guidelineLineVertical: {
    flex: 1,
    width: 1.5,
    borderStyle: 'dashed',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  dimensionPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginHorizontal: 6,
    marginVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)',
      } as any,
    }),
  },
  dimensionPillText: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomDimensionTag: {
    position: 'absolute',
    bottom: 2,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rightDimensionTag: {
    position: 'absolute',
    right: 4,
    top: '44%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: 'center',
  },
  dimensionTagText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
});
