import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '../../../core/domain/entities/Product';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface DimensionConfiguratorProps {
  product: Product;
  widthCm: number;
  heightCm: number;
  quantity: number;
  subtotalDemo: number;
  unitPriceDemo: number;
  widthError?: string;
  heightError?: string;
  quantityError?: string;
  onWidthChange: (val: number) => void;
  onHeightChange: (val: number) => void;
  onQuantityChange: (val: number) => void;
  onAddToQuote: () => void;
  onPrintSheet?: () => void;
  isValid: boolean;
  hideActions?: boolean;
  hideSummary?: boolean;
}

export const DimensionConfigurator: React.FC<DimensionConfiguratorProps> = ({
  product,
  widthCm,
  heightCm,
  quantity,
  subtotalDemo,
  unitPriceDemo,
  widthError,
  heightError,
  quantityError,
  onWidthChange,
  onHeightChange,
  onQuantityChange,
  onAddToQuote,
  onPrintSheet,
  isValid,
  hideActions = false,
  hideSummary = false,
}) => {
  const presetDimensions = [
    { label: '100 x 100 cm', w: 100, h: 100 },
    { label: '120 x 100 cm', w: 120, h: 100 },
    { label: '150 x 120 cm', w: 150, h: 120 },
    { label: '180 x 150 cm', w: 180, h: 150 },
    { label: '200 x 210 cm', w: 200, h: 210 },
  ];

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

  return (
    <View style={styles.paneContainer}>
      {/* 1. Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CONFIGURAR PRODUCTO</Text>
        <Text style={styles.subtitle}>
          Ingresa las dimensiones del vano arquitectónico
        </Text>
      </View>

      {/* 2. Medidas Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>MEDIDAS</Text>

        {/* Ancho (W) Stepper */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ancho (W)</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() =>
                handleStepperChange(
                  widthCm,
                  -5,
                  onWidthChange,
                  product.minWidthCm,
                  product.maxWidthCm
                )
              }
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.stepInput}
              value={widthCm > 0 ? widthCm.toString() : ''}
              onChangeText={(t) => {
                const n = parseFloat(t.replace(/[^0-9.]/g, ''));
                onWidthChange(isNaN(n) ? 0 : n);
              }}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() =>
                handleStepperChange(
                  widthCm,
                  5,
                  onWidthChange,
                  product.minWidthCm,
                  product.maxWidthCm
                )
              }
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>

            <View style={styles.unitBox}>
              <Text style={styles.unitText}>cm</Text>
            </View>
          </View>
          {widthError ? (
            <Text style={styles.errorText}>{widthError}</Text>
          ) : (
            <Text style={styles.rangeText}>
              Rango: {product.minWidthCm} - {product.maxWidthCm} cm
            </Text>
          )}
        </View>

        {/* Alto (H) Stepper */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Alto (H)</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() =>
                handleStepperChange(
                  heightCm,
                  -5,
                  onHeightChange,
                  product.minHeightCm,
                  product.maxHeightCm
                )
              }
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.stepInput}
              value={heightCm > 0 ? heightCm.toString() : ''}
              onChangeText={(t) => {
                const n = parseFloat(t.replace(/[^0-9.]/g, ''));
                onHeightChange(isNaN(n) ? 0 : n);
              }}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() =>
                handleStepperChange(
                  heightCm,
                  5,
                  onHeightChange,
                  product.minHeightCm,
                  product.maxHeightCm
                )
              }
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>

            <View style={styles.unitBox}>
              <Text style={styles.unitText}>cm</Text>
            </View>
          </View>
          {heightError ? (
            <Text style={styles.errorText}>{heightError}</Text>
          ) : (
            <Text style={styles.rangeText}>
              Rango: {product.minHeightCm} - {product.maxHeightCm} cm
            </Text>
          )}
        </View>

        {/* Cantidad Stepper */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Cantidad</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() =>
                handleStepperChange(quantity, -1, onQuantityChange, 1, 999)
              }
              activeOpacity={0.7}
              disabled={quantity <= 1}
            >
              <Text
                style={[
                  styles.stepBtnText,
                  quantity <= 1 && styles.stepBtnTextDisabled,
                ]}
              >
                −
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.stepInput}
              value={quantity.toString()}
              onChangeText={(t) => {
                const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
                onQuantityChange(isNaN(n) ? 1 : Math.max(1, n));
              }}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() =>
                handleStepperChange(quantity, 1, onQuantityChange, 1, 999)
              }
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>

            <View style={styles.unitBox}>
              <Text style={styles.unitText}>und</Text>
            </View>
          </View>
          {quantityError ? (
            <Text style={styles.errorText}>{quantityError}</Text>
          ) : null}
        </View>
      </View>

      {/* 3. Medidas Estándar */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>MEDIDAS ESTÁNDAR</Text>
        <View style={styles.presetsGrid}>
          {presetDimensions.map((preset, idx) => {
            const isSelected = widthCm === preset.w && heightCm === preset.h;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.presetChip,
                  isSelected && styles.presetChipSelected,
                ]}
                onPress={() => {
                  onWidthChange(preset.w);
                  onHeightChange(preset.h);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    isSelected && styles.presetChipTextSelected,
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 4. Resumen Técnico */}
      {!hideSummary && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>RESUMEN</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>SERIE</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {product.aluminumSeries}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>VIDRIO</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {product.glassType}
              </Text>
            </View>
          </View>

          {/* 5. Subtotal Estimado Box */}
          <View style={styles.subtotalCard}>
            <Text style={styles.subtotalLabel}>SUBTOTAL ESTIMADO</Text>
            <Text style={styles.subtotalValue}>${subtotalDemo.toFixed(2)}</Text>
            <Text style={styles.subtotalPerUnit}>
              (${unitPriceDemo.toFixed(2)} / und)
            </Text>
          </View>
        </>
      )}

      {/* 6. Buttons */}
      {!hideActions && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.primaryAddBtn, !isValid && styles.btnDisabled]}
            onPress={onAddToQuote}
            disabled={!isValid}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="cart-plus"
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.primaryAddBtnText}>Agregar al Carrito</Text>
          </TouchableOpacity>

          {onPrintSheet && (
            <TouchableOpacity
              style={styles.secondaryPrintBtn}
              onPress={onPrintSheet}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="printer-outline"
                size={18}
                color="#475569"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.secondaryPrintBtnText}>Imprimir Ficha</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paneContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    overflow: 'hidden',
    height: 40,
  },
  stepBtn: {
    width: 38,
    height: '100%',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F4C81',
  },
  stepBtnTextDisabled: {
    color: '#CBD5E1',
  },
  stepInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  unitBox: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  unitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  rangeText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
  },
  errorText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 3,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetChipSelected: {
    backgroundColor: '#FDF8ED',
    borderColor: '#D4AF37',
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  presetChipTextSelected: {
    color: '#997316',
    fontWeight: '800',
  },
  summaryRow: {
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F4C81',
    marginTop: 1,
  },
  subtotalCard: {
    backgroundColor: '#FDF8ED',
    borderWidth: 1.5,
    borderColor: '#E8D28E',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  subtotalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#997316',
    letterSpacing: 0.5,
  },
  subtotalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0A2540',
    marginVertical: 2,
  },
  subtotalPerUnit: {
    fontSize: 11,
    color: '#64748B',
  },
  buttonsContainer: {
    gap: 8,
  },
  primaryAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F4C81',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 8,
    ...shadows.sm,
  },
  primaryAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryPrintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    borderRadius: 8,
  },
  secondaryPrintBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
