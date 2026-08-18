import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category, CategoryId } from '../../../core/domain/entities/Category';
import { mockCategories } from '../../../data/mock/categories';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface CategorySelectorProps {
  selectedCategoryId: CategoryId;
  onSelectCategory: (category: Category) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const activeCategory =
    mockCategories.find((c) => c.id === selectedCategoryId) ||
    mockCategories[0];

  return (
    <View style={styles.container}>
      <Text style={styles.headerLabel}>CATEGORÍA</Text>

      {/* Selector Trigger Button */}
      <TouchableOpacity
        style={styles.triggerButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.75}
      >
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="layers-triple-outline"
            size={18}
            color={colors.primary}
          />
        </View>

        <View style={styles.triggerTextContainer}>
          <Text style={styles.triggerCategoryName} numberOfLines={1}>
            {activeCategory.name}
          </Text>
          <Text style={styles.triggerHint}>
            {activeCategory.productCount} productos
          </Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Category Dropdown / Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={mockCategories}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const isSelected = item.id === selectedCategoryId;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.categoryItem,
                          isSelected && styles.categoryItemSelected,
                        ]}
                        onPress={() => {
                          onSelectCategory(item);
                          setModalVisible(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.categoryItemLeft}>
                          <View
                            style={[
                              styles.categoryIconCircle,
                              isSelected && styles.categoryIconCircleSelected,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="check"
                              size={16}
                              color={
                                isSelected ? '#FFFFFF' : 'transparent'
                              }
                            />
                          </View>
                          <View style={styles.categoryTextWrapper}>
                            <Text
                              style={[
                                styles.categoryItemTitle,
                                isSelected && styles.categoryItemTitleSelected,
                              ]}
                            >
                              {item.name}
                            </Text>
                            <Text
                              style={styles.categoryItemDescription}
                              numberOfLines={1}
                            >
                              {item.description}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.countBadge,
                            isSelected && styles.countBadgeSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.countBadgeText,
                              isSelected && styles.countBadgeTextSelected,
                            ]}
                          >
                            {item.productCount}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  headerLabel: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...shadows.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  triggerTextContainer: {
    flex: 1,
  },
  triggerCategoryName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  triggerHint: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  categoryItemSelected: {
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  categoryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  categoryIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  categoryIconCircleSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryTextWrapper: {
    flex: 1,
  },
  categoryItemTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
  },
  categoryItemTitleSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
  categoryItemDescription: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: colors.surfaceActive,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  countBadgeSelected: {
    backgroundColor: colors.primary,
  },
  countBadgeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
  },
  countBadgeTextSelected: {
    color: '#FFFFFF',
  },
});
