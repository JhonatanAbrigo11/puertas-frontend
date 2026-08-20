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
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
}) => {
  const { isTablet, isDesktop } = useResponsive();
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

  const handleAddToQuote = () => {
    if (!isValid) return;
    addItem(product, widthCm, heightCm, quantity);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1200);
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.unifiedCard}>
          {/* 1. TOP HEADER: Product Title & Benefits Button (Centered) */}
          <View style={styles.topHeaderBlock}>
            <View style={styles.titleAndBenefitRow}>
              <Text style={styles.productTitle}>{product.name}</Text>
              <TouchableOpacity
                style={styles.benefitsIconButton}
                onPress={() => setIsBenefitsModalOpen(true)}
                activeOpacity={0.8}
                accessibilityLabel="Más beneficios"
              >
                <MaterialCommunityIcons
                  name="lightbulb-on-outline"
                  size={20}
                  color="#F59E0B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. CENTER IMAGE CAROUSEL WITH WARM CREAM BACKGROUND */}
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
                      color="#2563EB"
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
                        color="#2563EB"
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
                        color="#2563EB"
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
                      color="#2563EB"
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 3. INPUTS DE MEDIDAS (Diseño Táctil y Limpio) */}
          <View style={styles.configuratorSection}>
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
                      color="#1D4ED8"
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
                      color="#1D4ED8"
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
                      color="#1D4ED8"
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
                      color="#1D4ED8"
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
                      color={quantity <= 1 ? '#CBD5E1' : '#1D4ED8'}
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
                      color="#1D4ED8"
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
              <Text style={styles.priceLabel}>TOTAL ESTIMADO</Text>
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
                size={18}
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
                  name="hammer-wrench"
                  size={18}
                  color="#4F46E5"
                />
                <Text style={styles.accordionTitle}>Detalle de materiales</Text>
                <View style={styles.materialCountBadge}>
                  <Text style={styles.materialCountText}>
                    {calculatedMaterials.length} insumos
                  </Text>
                </View>
              </View>

              <MaterialCommunityIcons
                name={isMaterialsOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#6366F1"
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
                  name="lightbulb-on-outline"
                  size={20}
                  color="#D97706"
                />
                <Text style={styles.benefitsModalTitle}>Más beneficios</Text>
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
                    color="#10B981"
                  />
                  <Text style={styles.benefitText}>
                    Perfilería {product.aluminumSeries}
                  </Text>
                </View>

                <View style={styles.benefitItem}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={16}
                    color="#10B981"
                  />
                  <Text style={styles.benefitText}>{product.glassType}</Text>
                </View>

                {product.features.map((feat, idx) => (
                  <View key={idx} style={styles.benefitItem}>
                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={16}
                      color="#10B981"
                    />
                    <Text style={styles.benefitText}>{feat}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.infoBanner}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={16}
                  color="#0284C7"
                />
                <Text style={styles.infoBannerText}>
                  Producto fabricado a la medida según tus necesidades
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
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 80,
    alignItems: 'center',
  },
  unifiedCard: {
    maxWidth: 860,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 26,
    overflow: 'hidden',
    ...shadows.sm,
  },
  topHeaderBlock: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleAndBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  productTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  benefitsIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 18,
  },
  carouselSection: {
    marginHorizontal: -26,
    marginVertical: 18,
    alignItems: 'center',
    backgroundColor: '#FAF6EF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EFE8DE',
    paddingVertical: 20,
    paddingHorizontal: 26,
  },
  carouselRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  sidePreviewCard: {
    width: 105,
    height: 270,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2DACD',
    backgroundColor: '#F0EBE1',
    position: 'relative',
  },
  sidePreviewImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  sidePreviewDimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.12)',
  },
  sideNavBubbleLeft: {
    position: 'absolute',
    top: '50%',
    right: 8,
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2DACD',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  sideNavBubbleRight: {
    position: 'absolute',
    top: '50%',
    left: 8,
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2DACD',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  heroPreviewContainer: {
    flex: 1,
    maxWidth: 640,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#EAE3D8',
    ...shadows.sm,
  },
  mobileChevronLeft: {
    position: 'absolute',
    top: '50%',
    left: 14,
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: '#CBD5E1',
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
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  configuratorSection: {
    width: '100%',
    marginTop: 22,
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
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    ...shadows.sm,
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
    color: '#0F172A',
  },
  rangeHintText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  stepperInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
    height: 46,
  },
  stepBtn: {
    width: 44,
    height: '100%',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  stepValueWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    gap: 4,
  },
  stepTextInput: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    minWidth: 36,
  },
  stepUnitText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
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
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginTop: 20,
    ...shadows.sm,
  },
  priceBlock: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  priceValueGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
  },
  priceValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
  },
  pricePerUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  primaryAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    paddingHorizontal: 36,
    borderRadius: 12,
    ...shadows.sm,
  },
  btnSuccess: {
    backgroundColor: '#10B981',
  },
  primaryAddBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  accordionContainer: {
    width: '100%',
    marginTop: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
  },
  accordionHeaderOpen: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F1F5F9',
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  materialCountBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  materialCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  accordionBody: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  benefitsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
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
    color: colors.textPrimary,
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
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  infoBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
    flex: 1,
  },
});
