import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CalculatedMaterialItem } from '../../../core/domain/entities/Recipe';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';

interface MaterialsTableProps {
  materials: CalculatedMaterialItem[];
  subtotalDemo: number;
  quantity: number;
}

export const MaterialsTable: React.FC<MaterialsTableProps> = ({
  materials,
  subtotalDemo,
  quantity,
}) => {
  return (
    <View style={styles.container}>
      {/* Table Structure */}
      <View style={styles.table}>
        {/* Table Head */}
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.colHeader, styles.colMaterialHeader]}>
            MATERIAL / COMPONENTE
          </Text>
          <Text style={[styles.colHeader, styles.colQuantityHeader]}>
            CANTIDAD
          </Text>
          <Text style={[styles.colHeader, styles.colUnitHeader]}>
            UNIDAD
          </Text>
          <Text style={[styles.colHeader, styles.colPriceHeader]}>
            P. UNITARIO
          </Text>
          <Text style={[styles.colHeader, styles.colSubtotalHeader]}>
            SUBTOTAL
          </Text>
        </View>

        {/* Table Rows */}
        {materials.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <View
              key={item.materialId}
              style={[styles.tableRow, isEven && styles.tableRowEven]}
            >
              {/* Col 1: Material Name & Formula */}
              <View style={styles.colMaterialCell}>
                <Text style={styles.materialName}>{item.materialName}</Text>
                {item.notes ? (
                  <Text style={styles.formulaNote}>{item.notes}</Text>
                ) : null}
              </View>

              {/* Col 2: Quantity */}
              <View style={styles.colQuantityCell}>
                <Text style={styles.quantityText}>
                  {item.quantity.toFixed(
                    item.unit === 'und' || item.unit === 'juego' ? 0 : 2
                  )}
                </Text>
              </View>

              {/* Col 3: Unit */}
              <View style={styles.colUnitCell}>
                <View style={styles.unitChip}>
                  <Text style={styles.unitChipText}>{item.unit}</Text>
                </View>
              </View>

              {/* Col 4: Unit Price */}
              <View style={styles.colPriceCell}>
                <Text style={styles.priceText}>
                  ${item.unitPriceDemo.toFixed(2)}
                </Text>
              </View>

              {/* Col 5: Subtotal */}
              <View style={styles.colSubtotalCell}>
                <Text style={styles.subtotalText}>
                  ${item.subtotalDemo.toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Table Footer: Subtotal Summary */}
        <View style={styles.tableFooter}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerNote}>
              * Estimación preliminar de materiales para {quantity}{' '}
              {quantity === 1 ? 'unidad' : 'unidades'}. No incluye desperdicio
              adicional ni mano de obra.
            </Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.totalLabel}>Subtotal Materiales:</Text>
            <Text style={styles.totalAmount}>${subtotalDemo.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textPrimary,
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  table: {
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
  },
  colHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#525252',
    letterSpacing: 0.5,
  },
  colMaterialHeader: {
    flex: 3,
    textAlign: 'left',
    paddingRight: 8,
  },
  colQuantityHeader: {
    flex: 1.1,
    textAlign: 'right',
    paddingRight: 10,
  },
  colUnitHeader: {
    flex: 0.9,
    textAlign: 'center',
  },
  colPriceHeader: {
    flex: 1.3,
    textAlign: 'right',
    paddingRight: 10,
  },
  colSubtotalHeader: {
    flex: 1.3,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
  },
  tableRowEven: {
    backgroundColor: '#FAFAFA',
  },
  colMaterialCell: {
    flex: 3,
    paddingRight: 8,
  },
  colQuantityCell: {
    flex: 1.1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  colUnitCell: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colPriceCell: {
    flex: 1.3,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  colSubtotalCell: {
    flex: 1.3,
    alignItems: 'flex-end',
  },
  materialName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  formulaNote: {
    fontSize: 10,
    color: '#737373',
    marginTop: 2,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  unitChip: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFCACA',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unitChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D93638',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737373',
  },
  subtotalText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  tableFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0F0',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1.5,
    borderTopColor: '#FFCACA',
  },
  footerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  footerNote: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 14,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D93638',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A1A1A',
  },
});
