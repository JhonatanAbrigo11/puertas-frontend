import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category, CategoryId } from '../../../core/domain/entities/Category';
import { Product } from '../../../core/domain/entities/Product';
import { mockProducts } from '../../../data/mock/products';
import { CategorySelector } from './CategorySelector';
import { ProductCard } from './ProductCard';
import { TechnicalIllustration } from '../../../shared/components/TechnicalIllustration';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';

interface SidebarProps {
  selectedCategoryId: CategoryId;
  onSelectCategory: (category: Category) => void;
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategoryId,
  onSelectCategory,
  selectedProduct,
  onSelectProduct,
  isCollapsed = true,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesCategory =
        selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;

      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryId, searchQuery]);

  // MINI COLLAPSED RAIL VIEW
  if (isCollapsed) {
    return (
      <View style={styles.miniRail}>
        {/* Expand Toggle Button */}
        {onToggleCollapse && (
          <TouchableOpacity
            style={styles.miniToggleBtn}
            onPress={onToggleCollapse}
            activeOpacity={0.7}
            accessibilityLabel="Expandir Catálogo"
          >
            <MaterialCommunityIcons
              name="chevron-double-right"
              size={20}
              color="#2563EB"
            />
          </TouchableOpacity>
        )}

        <View style={styles.miniDivider} />

        {/* Product Mini Thumbnails List */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.miniListContent}
          renderItem={({ item }) => {
            const isSelected = selectedProduct?.id === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.miniThumbCard,
                  isSelected && styles.miniThumbCardSelected,
                ]}
                onPress={() => onSelectProduct(item)}
                activeOpacity={0.8}
              >
                <TechnicalIllustration
                  type={item.illustrationType}
                  height={38}
                  isThumbnail={true}
                />
                {isSelected && (
                  <View style={styles.miniSelectedDot} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  // FULL EXPANDED SIDEBAR VIEW
  return (
    <View style={styles.sidebar}>
      {/* Header with collapse button */}
      <View style={styles.fullHeaderRow}>
        <View style={{ flex: 1 }}>
          <CategorySelector
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
          />
        </View>
        {onToggleCollapse && (
          <TouchableOpacity
            style={styles.collapseBtn}
            onPress={onToggleCollapse}
            activeOpacity={0.7}
            accessibilityLabel="Encoger Catálogo"
          >
            <MaterialCommunityIcons
              name="chevron-double-left"
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Input for Quick Finding */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={18}
          color="#94A3B8"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto o código..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearSearch}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={16}
              color="#94A3B8"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Section Title: PRODUCTOS (X) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>
          PRODUCTOS ({filteredProducts.length})
        </Text>
      </View>

      {/* Product Cards List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={36}
              color={colors.textLight}
            />
            <Text style={styles.emptyText}>No se encontraron productos</Text>
            <Text style={styles.emptySubText}>
              Prueba cambiando la categoría o término de búsqueda.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isSelected={selectedProduct?.id === item.id}
            onSelect={onSelectProduct}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1.5,
    borderRightColor: '#EDF2F7',
    padding: spacing.md,
    flexDirection: 'column',
  },
  fullHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  collapseBtn: {
    width: 32,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniRail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1.5,
    borderRightColor: '#EDF2F7',
    paddingVertical: 12,
    alignItems: 'center',
  },
  miniToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F6FD',
    borderWidth: 1.5,
    borderColor: '#BBD8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniDivider: {
    width: 32,
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  miniListContent: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 24,
  },
  miniThumbCard: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  miniThumbCardSelected: {
    borderColor: '#0F4C81',
    backgroundColor: '#FDF8ED',
    borderWidth: 2,
  },
  miniSelectedDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4AF37',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
    height: 40,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  clearSearch: {
    padding: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  listContent: {
    paddingBottom: spacing['3xl'],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptySubText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});
