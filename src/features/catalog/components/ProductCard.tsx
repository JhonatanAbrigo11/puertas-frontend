import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '../../../core/domain/entities/Product';
import { TechnicalIllustration } from '../../../shared/components/TechnicalIllustration';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
}) => {
  // Extract a clean short series tag (e.g. "Serie 20/25", "Línea Residencial")
  const getShortSeriesTag = () => {
    if (product.aluminumSeries.includes('Serie 20')) return 'Serie 20/25';
    if (product.aluminumSeries.includes('Serie 25')) return 'Serie 25 (3 Rieles)';
    if (product.aluminumSeries.includes('Batiente')) return 'Línea Batiente';
    if (product.aluminumSeries.includes('Proyectante')) return 'Serie Proyectable';
    if (product.aluminumSeries.includes('Canal U')) return 'Vidrio Templado 8mm';
    if (product.aluminumSeries.includes('Suspendido')) return 'Sistema Suspendido';
    if (product.aluminumSeries.includes('Corporativa')) return 'Vidrio Satinado 8mm';
    if (product.aluminumSeries.includes('Marino')) return 'Acero Inox 304';
    if (product.aluminumSeries.includes('Tubular 3"x2"')) return 'Paneles ACM 4mm';
    if (product.aluminumSeries.includes('Muro Cortina')) return 'ACM 4mm';
    if (product.aluminumSeries.includes('Rastrelado')) return 'Panel Arquitectónico';
    if (product.aluminumSeries.includes('Ranurada')) return 'Aluminio Anodizado';
    if (product.aluminumSeries.includes('Esquinera')) return 'Aluminio Reforzado';
    if (product.aluminumSeries.includes('Correderas')) return 'Guías Correderas';
    if (product.aluminumSeries.includes('Exhibidora')) return 'Cristal 8mm Templado';
    if (product.aluminumSeries.includes('Pesada')) return 'Estructural Pesada';
    if (product.aluminumSeries.includes('Canaletas')) return 'Policarbonato 10mm';
    if (product.aluminumSeries.includes('Viga')) return 'Policarbonato 4mm';
    if (product.aluminumSeries.includes('Spider')) return 'Herrajes Spider Inox';
    return product.mainMaterial.split('+')[0].trim();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(product)}
      style={[
        styles.card,
        isSelected ? styles.cardSelected : styles.cardDefault,
      ]}
    >
      {/* Thumbnail Container */}
      <View style={styles.thumbnailContainer}>
        <TechnicalIllustration
          type={product.illustrationType}
          height={68}
          isThumbnail={true}
        />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.productName,
            isSelected && styles.productNameSelected,
          ]}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Series Pill Badge */}
        <View style={styles.tagPill}>
          <Text style={styles.tagPillText} numberOfLines={1}>
            {getShortSeriesTag()}
          </Text>
        </View>

        {/* Code */}
        <Text style={styles.codeText}>{product.code}</Text>
      </View>

      {/* Selected Circular Check Badge */}
      {isSelected && (
        <View style={styles.checkBadge}>
          <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    gap: spacing.sm,
  },
  cardDefault: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EDF2F7',
    ...shadows.sm,
  },
  cardSelected: {
    backgroundColor: '#FDF8ED',
    borderWidth: 2,
    borderColor: '#0F4C81',
    ...shadows.md,
  },
  thumbnailContainer: {
    width: 76,
    height: 68,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 20,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A2540',
    lineHeight: 17,
    marginBottom: 4,
  },
  productNameSelected: {
    color: '#0A2540',
    fontWeight: '800',
  },
  tagPill: {
    backgroundColor: '#F0F6FD',
    borderWidth: 1,
    borderColor: '#BBD8F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F4C81',
  },
  codeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0F4C81',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
});
