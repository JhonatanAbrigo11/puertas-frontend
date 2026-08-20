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
import { getProductImageUri } from '../../../shared/utils/getProductImageUri';
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
              size={18}
              color="#FFFFFF"
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
                  imageUri={getProductImageUri(item)}
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
              color="#FFFFFF"
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
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    padding: spacing.md,
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '1px 0 3px rgba(0, 0, 0, 0.03)',
      } as any,
    }),
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
    borderRadius: 8,
    backgroundColor: '#FE4648', // Forest Green
    borderWidth: 1,
    borderColor: '#FE4648',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniRail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingVertical: 14,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '1px 0 3px rgba(0, 0, 0, 0.03)',
      } as any,
    }),
  },
  miniToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FE4648', // Forest Green
    borderWidth: 1,
    borderColor: '#FE4648',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FE4648',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 5px rgba(30, 58, 43, 0.25)',
      } as any,
    }),
  },
  miniDivider: {
    width: 32,
    height: 1.5,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  miniListContent: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 24,
  },
  miniThumbCard: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      } as any,
    }),
  },
  miniThumbCardSelected: {
    borderColor: '#FE4648',
    backgroundColor: '#F3F4F6',
    borderWidth: 2.5,
    ...Platform.select({
      ios: {
        shadowColor: '#FE4648',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 6px rgba(30, 58, 43, 0.25)',
      } as any,
    }),
  },
  miniSelectedDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FE4648',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#1A1A1A',
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
    color: '#737373',
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
