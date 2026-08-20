import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '../../../core/domain/entities/Product';
import { useProductConfigurator } from '../hooks/useProductConfigurator';
import { useQuote } from '../../quote/context/QuoteContext';
import { TechnicalIllustration } from '../../../shared/components/TechnicalIllustration';
import {
  getProductImageUri,
  getProductGalleryUris,
} from '../../../shared/utils/getProductImageUri';
import { MaterialsTable } from './MaterialsTable';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface ProductDetailViewProps {
  product: Product;
  onAddToCartAnimation?: (
    startCoords: { x: number; y: number },
    count: number
  ) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onAddToCartAnimation,
}) => {
  const { isTablet, isDesktop } = useResponsive();
  const addBtnRef = React.useRef<View>(null);
  const {
    widthCm,
    heightCm,
    quantity,
    setWidthCm,
    setHeightCm,
    setQuantity,
    errors,
    isValid,
    calculatedMaterials,
    subtotalDemo,
    unitPriceDemo,
  } = useProductConfigurator(product);

  const { addItem } = useQuote();
  const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const galleryUris = getProductGalleryUris(product);

  useEffect(() => {
    setIsBenefitsModalOpen(false);
    setCurrentImageIndex(0);
  }, [product.id]);

  const handlePrevImage = () => {
    if (galleryUris.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : galleryUris.length - 1
    );
  };

  const handleNextImage = () => {
    if (galleryUris.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev < galleryUris.length - 1 ? prev + 1 : 0
    );
  };

  const prevIndex =
    (currentImageIndex - 1 + galleryUris.length) % galleryUris.length;
  const nextIndex = (currentImageIndex + 1) % galleryUris.length;

  const currentImageUri =
    galleryUris[currentImageIndex] || getProductImageUri(product);

  const handleStepperChange = (
    currentVal: number,
    delta: number,
    setter: (val: number) => void,
    min: number = 10,
    max: number = 1000
  ) => {
    const newVal = Math.min(Math.max(currentVal + delta, min), max);
    setter(newVal);
  };

  const handleAddToQuote = (e: any) => {
    if (!isValid) return;
    addItem(product, widthCm, heightCm, quantity);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1200);

    if (onAddToCartAnimation) {
      if (e?.nativeEvent?.pageX && e?.nativeEvent?.pageY) {
        onAddToCartAnimation(
          { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY },
          quantity
        );
      } else if (addBtnRef.current?.measureInWindow) {
        addBtnRef.current.measureInWindow((x, y, width, height) => {
          onAddToCartAnimation(
            { x: x + width / 2, y: y + height / 2 },
            quantity
          );
        });
      } else {
        onAddToCartAnimation({ x: 300, y: 500 }, quantity);
      }
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.unifiedCard}>
          {/* 1. TOP HEADER: Product Title, Subtitle & Alta Calidad Badge */}
          <View style={styles.topHeaderBlock}>
            <View style={styles.titleRow}>
              <View style={styles.titleTextGroup}>
                <Text style={styles.productTitle}>{product.name}</Text>
                <Text style={styles.productSubtitle}>
                  {product.shortDescription ||
                    'Sistema de ventanas corredizas de alta calidad, diseñado para brindar elegancia y funcionalidad.'}
                </Text>
              </View>

              {/* Alta Calidad Badge */}
              <TouchableOpacity
                style={styles.qualityBadge}
                onPress={() => setIsBenefitsModalOpen(true)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={15}
                  color="#C98A16"
                />
                <Text style={styles.qualityBadgeText}>Alta calidad</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. CENTER IMAGE CAROUSEL WITH CLEAN DESIGN */}
          <View style={styles.carouselSection}>
            <View style={styles.carouselRow}>
              {/* Left Side Reference Card (Tablet / Desktop) */}
              {(isTablet || isDesktop) && galleryUris.length > 1 && (
                <TouchableOpacity
                  style={styles.sidePreviewCard}
                  onPress={handlePrevImage}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: galleryUris[prevIndex] }}
                    style={styles.sidePreviewImage}
                    resizeMode="cover"
                  />
                  <View style={styles.sidePreviewDimOverlay} />
                  <View style={styles.sideNavBubbleLeft}>
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={20}
                      color="#0A192F"
                    />
                  </View>
                </TouchableOpacity>
              )}

              {/* Main Centered Hero Preview */}
              <View style={styles.heroPreviewContainer}>
                <TechnicalIllustration
                  type={product.illustrationType}
                  imageUri={currentImageUri}
                  height={isTablet || isDesktop ? 340 : 230}
                  widthDimension={widthCm}
                  heightDimension={heightCm}
                  showDimensions={true}
                />

                {/* Mobile Floating Chevrons */}
                {!isTablet && !isDesktop && galleryUris.length > 1 && (
                  <>
                    <TouchableOpacity
                      style={styles.mobileChevronLeft}
                      onPress={handlePrevImage}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name="chevron-left"
                        size={20}
                        color="#0A192F"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.mobileChevronRight}
                      onPress={handleNextImage}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color="#0A192F"
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Right Side Reference Card (Tablet / Desktop) */}
              {(isTablet || isDesktop) && galleryUris.length > 1 && (
                <TouchableOpacity
                  style={styles.sidePreviewCard}
                  onPress={handleNextImage}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: galleryUris[nextIndex] }}
                    style={styles.sidePreviewImage}
                    resizeMode="cover"
                  />
                  <View style={styles.sidePreviewDimOverlay} />
                  <View style={styles.sideNavBubbleRight}>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#0A192F"
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 3. INPUTS DE MEDIDAS (Section Title: Dimensiones y cantidad) */}
          <View style={styles.configuratorSection}>
            <View style={styles.dimensionsSectionHeader}>
              <MaterialCommunityIcons
                name="ruler"
                size={18}
                color="#C98A16"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.dimensionsSectionTitle}>
                Dimensiones y cantidad
              </Text>
            </View>

            <View
              style={[
                styles.steppersContainer,
                isTablet || isDesktop
                  ? styles.steppersContainerDesktop
                  : styles.steppersContainerMobile,
              ]}
            >
              {/* Ancho (W) */}
              <View style={styles.stepperCard}>
                <View style={styles.stepperHeader}>
                  <Text style={styles.stepperLabel}>Ancho (W)</Text>
                  <Text style={styles.rangeHintText}>
                    {product.minWidthCm} - {product.maxWidthCm} cm
                  </Text>
                </View>
                <View style={styles.stepperInputWrapper}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      handleStepperChange(
                        widthCm,
                        -5,
                        setWidthCm,
                        product.minWidthCm,
                        product.maxWidthCm
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="minus"
                      size={18}
                      color="#C98A16"
                    />
                  </TouchableOpacity>

                  <View style={styles.stepValueWrapper}>
                    <TextInput
                      style={styles.stepTextInput}
                      value={widthCm > 0 ? widthCm.toString() : ''}
                      onChangeText={(t) => {
                        const n = parseFloat(t.replace(/[^0-9.]/g, ''));
                        setWidthCm(isNaN(n) ? 0 : n);
                      }}
                      keyboardType="numeric"
                    />
                    <Text style={styles.stepUnitText}>cm</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      handleStepperChange(
                        widthCm,
                        5,
                        setWidthCm,
                        product.minWidthCm,
                        product.maxWidthCm
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="plus"
                      size={18}
                      color="#C98A16"
                    />
                  </TouchableOpacity>
                </View>
                {errors.width ? (
                  <Text style={styles.errorHintText}>{errors.width}</Text>
                ) : null}
              </View>

              {/* Alto (H) */}
              <View style={styles.stepperCard}>
                <View style={styles.stepperHeader}>
                  <Text style={styles.stepperLabel}>Alto (H)</Text>
                  <Text style={styles.rangeHintText}>
                    {product.minHeightCm} - {product.maxHeightCm} cm
                  </Text>
                </View>
                <View style={styles.stepperInputWrapper}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      handleStepperChange(
                        heightCm,
                        -5,
                        setHeightCm,
                        product.minHeightCm,
                        product.maxHeightCm
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="minus"
                      size={18}
                      color="#C98A16"
                    />
                  </TouchableOpacity>

                  <View style={styles.stepValueWrapper}>
                    <TextInput
                      style={styles.stepTextInput}
                      value={heightCm > 0 ? heightCm.toString() : ''}
                      onChangeText={(t) => {
                        const n = parseFloat(t.replace(/[^0-9.]/g, ''));
                        setHeightCm(isNaN(n) ? 0 : n);
                      }}
                      keyboardType="numeric"
                    />
                    <Text style={styles.stepUnitText}>cm</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      handleStepperChange(
                        heightCm,
                        5,
                        setHeightCm,
                        product.minHeightCm,
                        product.maxHeightCm
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="plus"
                      size={18}
                      color="#C98A16"
                    />
                  </TouchableOpacity>
                </View>
                {errors.height ? (
                  <Text style={styles.errorHintText}>{errors.height}</Text>
                ) : null}
              </View>

              {/* Cantidad */}
              <View style={styles.stepperCard}>
                <View style={styles.stepperHeader}>
                  <Text style={styles.stepperLabel}>Cantidad</Text>
                  <Text style={styles.rangeHintText}>Unidades</Text>
                </View>
                <View style={styles.stepperInputWrapper}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      handleStepperChange(quantity, -1, setQuantity, 1, 999)
                    }
                    activeOpacity={0.7}
                    disabled={quantity <= 1}
                  >
                    <MaterialCommunityIcons
                      name="minus"
                      size={18}
                      color={quantity <= 1 ? '#D1D5DB' : '#C98A16'}
                    />
                  </TouchableOpacity>

                  <View style={styles.stepValueWrapper}>
                    <TextInput
                      style={styles.stepTextInput}
                      value={quantity.toString()}
                      onChangeText={(t) => {
                        const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
                        setQuantity(isNaN(n) ? 1 : Math.max(1, n));
                      }}
                      keyboardType="number-pad"
                    />
                    <Text style={styles.stepUnitText}>und</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      handleStepperChange(quantity, 1, setQuantity, 1, 999)
                    }
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="plus"
                      size={18}
                      color="#C98A16"
                    />
                  </TouchableOpacity>
                </View>
                {errors.quantity ? (
                  <Text style={styles.errorHintText}>{errors.quantity}</Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* 4. TOTAL ESTIMADO Y BOTÓN AGREGAR */}
          <View style={styles.priceAndActionCard}>
            <View style={styles.priceBlock}>
              <View style={styles.priceLabelRow}>
                <Text style={styles.priceLabel}>Total estimado</Text>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={15}
                  color="#C98A16"
                />
              </View>
              <View style={styles.priceValueGroup}>
                <Text style={styles.priceValue}>${subtotalDemo.toFixed(2)}</Text>
                {quantity > 1 && (
                  <Text style={styles.pricePerUnit}>
                    (${unitPriceDemo.toFixed(2)} c/u)
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              ref={addBtnRef as any}
              style={[
                styles.primaryAddBtn,
                !isValid && styles.btnDisabled,
                isAddedRecently && styles.btnSuccess,
              ]}
              onPress={handleAddToQuote}
              disabled={!isValid}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name={isAddedRecently ? 'check' : 'cart-outline'}
                size={19}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.primaryAddBtnText}>
                {isAddedRecently ? '¡Agregado!' : 'Agregar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 5. ACORDEÓN DE MATERIALES */}
          <View style={styles.accordionContainer}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                isMaterialsOpen && styles.accordionHeaderOpen,
              ]}
              onPress={() => setIsMaterialsOpen(!isMaterialsOpen)}
              activeOpacity={0.7}
            >
              <View style={styles.accordionLeft}>
                <MaterialCommunityIcons
                  name="layers-outline"
                  size={18}
                  color="#C98A16"
                />
                <Text style={styles.accordionTitle}>Detalle de materiales</Text>
                <View style={styles.materialCountBadge}>
                  <Text style={styles.materialCountText}>
                    {calculatedMaterials.length} insumos
                  </Text>
                </View>
              </View>

              <MaterialCommunityIcons
                name={isMaterialsOpen ? 'chevron-up' : 'chevron-right'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>

            {isMaterialsOpen && (
              <View style={styles.accordionBody}>
                <MaterialsTable
                  materials={calculatedMaterials}
                  subtotalDemo={subtotalDemo}
                  quantity={quantity}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Benefits Modal */}
      <Modal
        visible={isBenefitsModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsBenefitsModalOpen(false)}
      >
        <View style={styles.benefitsModalOverlay}>
          <View style={styles.benefitsModalCard}>
            <View style={styles.benefitsModalHeader}>
              <View style={styles.benefitsModalTitleRow}>
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={20}
                  color="#C98A16"
                />
                <Text style={styles.benefitsModalTitle}>Alta calidad garantizada</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsBenefitsModalOpen(false)}
                style={styles.benefitsModalClose}
                accessibilityLabel="Cerrar"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.benefitsModalBody}
              contentContainerStyle={styles.benefitsModalBodyContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.benefitsDescription}>
                {product.fullDescription}
              </Text>

              <Text style={styles.benefitsTitle}>BENEFICIOS CLAVE</Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={16}
                    color="#C98A16"
                  />
                  <Text style={styles.benefitText}>
                    Perfilería {product.aluminumSeries}
                  </Text>
                </View>

                <View style={styles.benefitItem}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={16}
                    color="#C98A16"
                  />
                  <Text style={styles.benefitText}>{product.glassType}</Text>
                </View>

                {product.features.map((feat, idx) => (
                  <View key={idx} style={styles.benefitItem}>
                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={16}
                      color="#C98A16"
                    />
                    <Text style={styles.benefitText}>{feat}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.infoBanner}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={16}
                  color="#C98A16"
                />
                <Text style={styles.infoBannerText}>
                  Producto fabricado a la medida según los más altos estándares de calidad.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
    alignItems: 'center',
  },
  unifiedCard: {
    maxWidth: 860,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
    padding: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
      } as any,
    }),
  },
  topHeaderBlock: {
    width: '100%',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleTextGroup: {
    flex: 1,
  },
  productTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0A192F', // Deep Midnight Navy
    letterSpacing: -0.4,
  },
  productSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
    lineHeight: 19,
    maxWidth: 520,
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7', // Amber Tint
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  qualityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309', // Warm Ochre
  },
  carouselSection: {
    width: '100%',
    marginVertical: 14,
    alignItems: 'center',
  },
  carouselRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  sidePreviewCard: {
    width: 95,
    height: 270,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  sidePreviewImage: {
    width: '100%',
    height: '100%',
    opacity: 0.65,
  },
  sidePreviewDimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 25, 47, 0.1)',
  },
  sideNavBubbleLeft: {
    position: 'absolute',
    top: '50%',
    right: 8,
    marginTop: -19,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
      } as any,
    }),
  },
  sideNavBubbleRight: {
    position: 'absolute',
    top: '50%',
    left: 8,
    marginTop: -19,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
      } as any,
    }),
  },
  heroPreviewContainer: {
    flex: 1,
    maxWidth: 620,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  mobileChevronLeft: {
    position: 'absolute',
    top: '50%',
    left: 14,
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  mobileChevronRight: {
    position: 'absolute',
    top: '50%',
    right: 14,
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  configuratorSection: {
    width: '100%',
    marginTop: 18,
  },
  dimensionsSectionHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dimensionsSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A192F',
  },
  steppersContainer: {
    width: '100%',
  },
  steppersContainerDesktop: {
    flexDirection: 'row',
    gap: 16,
  },
  steppersContainerMobile: {
    flexDirection: 'column',
    gap: 14,
  },
  stepperCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
  },
  stepperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepperLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A192F',
  },
  rangeHintText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  stepperInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
    height: 44,
  },
  stepBtn: {
    width: 40,
    height: '100%',
    backgroundColor: '#FFFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  stepValueWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    gap: 3,
  },
  stepTextInput: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#0A192F',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    minWidth: 36,
  },
  stepUnitText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  errorHintText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 4,
  },
  priceAndActionCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 18,
    marginTop: 18,
  },
  priceBlock: {
    flexDirection: 'column',
  },
  priceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  priceValueGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 3,
  },
  priceValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0A192F',
  },
  pricePerUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  primaryAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C98A16', // Warm Gold
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#C98A16',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 6px rgba(201, 138, 22, 0.3)',
      } as any,
    }),
  },
  btnSuccess: {
    backgroundColor: '#10B981',
  },
  primaryAddBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  accordionContainer: {
    width: '100%',
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  accordionHeaderOpen: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A192F',
  },
  materialCountBadge: {
    backgroundColor: '#FEF3C7', // Amber Tint
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  materialCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  accordionBody: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  benefitsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 47, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  benefitsModalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.md,
  },
  benefitsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  benefitsModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitsModalTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.heavy,
    color: '#0A192F',
  },
  benefitsModalClose: {
    padding: 4,
  },
  benefitsModalBody: {
    maxHeight: 420,
  },
  benefitsModalBodyContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  benefitsDescription: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  benefitsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  benefitsList: {
    gap: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  benefitText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  infoBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
    flex: 1,
  },
});
