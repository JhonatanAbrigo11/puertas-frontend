import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { mockProducts } from '../../../data/mock/products';
import { mockCategories } from '../../../data/mock/categories';
import { materialsMap } from '../../../data/mock/materials';
import { Product } from '../../../core/domain/entities/Product';
import { RecipeItem } from '../../../core/domain/entities/Recipe';
import { TechnicalIllustration } from '../../../shared/components/TechnicalIllustration';
import { getProductImageUri } from '../../../shared/utils/getProductImageUri';
import { generateAndDownloadPdf } from '../../../core/domain/services/pdfGenerator';
import { CreateProductModal } from '../components/CreateProductModal';
import { AddRecipeMaterialModal } from '../components/AddRecipeMaterialModal';
import { ManufacturingProductGridCard } from '../components/ManufacturingProductGridCard';
import {
  buildSheetDraftFromProduct,
  applySheetDraftToProduct,
  draftToPreviewProduct,
  SheetEditDraft,
} from '../utils/sheetEditDraft';
import { Input } from '../../../shared/components/Input';
import { Toast } from '../../../shared/components/Toast';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

export const ManufacturingRecipesScreen: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();
  const gridColumns = isDesktop ? 4 : isTablet ? 3 : 2;

  const [productsList, setProductsList] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [isEditingSheet, setIsEditingSheet] = useState(false);
  const [sheetDraft, setSheetDraft] = useState<SheetEditDraft | null>(null);

  // Modals state
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic simulation dimensions for the selected product
  const [simWidth, setSimWidth] = useState<number>(120);
  const [simHeight, setSimHeight] = useState<number>(100);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productsList.filter((prod) => {
      const matchesCategory =
        selectedCategory === 'all' || prod.categoryId === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === '' ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.aluminumSeries.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.glassType.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [productsList, selectedCategory, searchQuery]);

  // Current active product
  const activeProduct = useMemo(() => {
    if (!selectedProductId) return undefined;
    return productsList.find((p) => p.id === selectedProductId);
  }, [productsList, selectedProductId]);

  const displayProduct = useMemo(() => {
    if (!activeProduct) return undefined;
    if (isEditingSheet && sheetDraft) {
      return draftToPreviewProduct(activeProduct, sheetDraft);
    }
    return activeProduct;
  }, [activeProduct, isEditingSheet, sheetDraft]);

  // Sync simulation dimensions when product changes
  React.useEffect(() => {
    if (activeProduct) {
      setSimWidth(activeProduct.defaultWidthCm);
      setSimHeight(activeProduct.defaultHeightCm);
      setIsEditingSheet(false);
      setSheetDraft(null);
    }
  }, [activeProduct?.id]);

  // Handler: Add new product
  const handleSaveNewProduct = (newProduct: Product) => {
    setProductsList((prev) => [newProduct, ...prev]);
    setSelectedProductId(newProduct.id);
    setViewMode('detail');
    setToastMessage(`Ficha del producto "${newProduct.name}" creada exitosamente.`);
  };

  const handleOpenProductSheet = (product: Product) => {
    setSelectedProductId(product.id);
    setViewMode('detail');
  };

  const handleBackToGrid = () => {
    setIsEditingSheet(false);
    setSheetDraft(null);
    setViewMode('grid');
  };

  const handleStartEditSheet = () => {
    if (!activeProduct) return;
    setSheetDraft(buildSheetDraftFromProduct(activeProduct));
    setIsEditingSheet(true);
  };

  const handleCancelEditSheet = () => {
    if (activeProduct) {
      setSimWidth(activeProduct.defaultWidthCm);
      setSimHeight(activeProduct.defaultHeightCm);
    }
    setIsEditingSheet(false);
    setSheetDraft(null);
  };

  const handleSaveEditSheet = () => {
    if (!activeProduct || !sheetDraft) return;

    const updated = applySheetDraftToProduct(activeProduct, sheetDraft);
    setProductsList((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setSimWidth(updated.defaultWidthCm);
    setSimHeight(updated.defaultHeightCm);
    setIsEditingSheet(false);
    setSheetDraft(null);
    setToastMessage(`Ficha "${updated.name}" actualizada correctamente.`);
  };

  const updateDraftField = <K extends keyof SheetEditDraft>(
    field: K,
    value: SheetEditDraft[K]
  ) => {
    setSheetDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateRecipeItemDraft = (
    index: number,
    field: keyof SheetEditDraft['recipeItems'][number],
    value: string
  ) => {
    setSheetDraft((prev) => {
      if (!prev) return prev;
      const recipeItems = [...prev.recipeItems];
      recipeItems[index] = { ...recipeItems[index], [field]: value };
      return { ...prev, recipeItems };
    });
  };

  // Handler: Add material to current product's recipe
  const handleAddMaterialToActiveRecipe = (newItem: RecipeItem) => {
    if (!activeProduct) return;

    setProductsList((prev) => {
      const next = prev.map((prod) => {
        if (prod.id !== activeProduct.id) return prod;

        const currentItems = prod.recipe?.items ? [...prod.recipe.items] : [];
        return {
          ...prod,
          recipe: {
            productId: prod.id,
            items: [...currentItems, newItem],
          },
        };
      });

      if (isEditingSheet) {
        const updated = next.find((p) => p.id === activeProduct.id);
        if (updated) setSheetDraft(buildSheetDraftFromProduct(updated));
      }

      return next;
    });

    const mat = materialsMap[newItem.materialId];
    setToastMessage(
      `Insumo "${mat?.name || newItem.materialId}" agregado a la ficha.`
    );
  };

  // Handler: Remove material from current product's recipe
  const handleRemoveMaterialFromRecipe = (indexToRemove: number) => {
    if (!activeProduct || !activeProduct.recipe) return;

    setProductsList((prev) => {
      const next = prev.map((prod) => {
        if (prod.id !== activeProduct.id) return prod;

        const currentItems = prod.recipe?.items ? [...prod.recipe.items] : [];
        currentItems.splice(indexToRemove, 1);

        return {
          ...prod,
          recipe: {
            productId: prod.id,
            items: currentItems,
          },
        };
      });

      if (isEditingSheet) {
        const updated = next.find((p) => p.id === activeProduct.id);
        if (updated) setSheetDraft(buildSheetDraftFromProduct(updated));
      }

      return next;
    });

    setToastMessage('Insumo removido de la ficha.');
  };

  // Calculate dynamic recipe outputs for the simulation
  const simulatedItems = useMemo(() => {
    const product = displayProduct;
    if (!product || !product.recipe || !product.recipe.items) {
      return [];
    }

    return product.recipe.items.map((item) => {
      const rawQty =
        item.manualQuantityOverride ??
        item.calculate({
          widthCm: simWidth,
          heightCm: simHeight,
          quantity: 1,
        });

      const mat = materialsMap[item.materialId];
      const unit = mat ? mat.unit : 'und';
      const unitPrice =
        item.manualUnitPriceOverride ?? (mat ? mat.unitPriceDemo : 0);
      const roundedQty =
        unit === 'und' || unit === 'juego'
          ? Math.ceil(rawQty)
          : Math.round(rawQty * 100) / 100;
      const subtotal = Math.round(roundedQty * unitPrice * 100) / 100;

      return {
        materialId: item.materialId,
        materialCode: mat?.code || item.materialId,
        materialName: mat?.name || item.materialId,
        formulaDescription: item.formulaDescription || '',
        quantity: roundedQty,
        unit,
        unitPrice,
        subtotal,
        notes: item.notes || '',
      };
    });
  }, [displayProduct, simWidth, simHeight]);

  const totalSimulatedPrice = useMemo(() => {
    return simulatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  }, [simulatedItems]);

  const handlePrint = async () => {
    const product = displayProduct || activeProduct;
    if (!product) return;

    const singleItemQuote = {
      id: `sheet-${Date.now()}`,
      quoteNumber: `FICHA-${product.code}`,
      customer: {
        name: 'Taller de Producción / Fabricación ALUX',
        phone: '+593 99 123 4567',
        email: 'taller@alux.com',
        address: 'Planta Metalmecánica - Área de Corte & Ensamble',
        notes: `Ficha técnica generada para ${product.name}`,
      },
      items: [
        {
          id: `item-${Date.now()}`,
          productId: product.id,
          product: product,
          productName: product.name,
          productCode: product.code,
          widthCm: simWidth,
          heightCm: simHeight,
          quantity: 1,
          calculatedMaterials: simulatedItems.map((m) => ({
            materialId: m.materialId,
            materialName: m.materialName,
            materialCategory: 'aluminio' as const,
            quantity: m.quantity,
            unit: m.unit,
            unitPriceDemo: m.unitPrice,
            subtotalDemo: m.subtotal,
            notes: m.formulaDescription,
          })),
          subtotalDemo: totalSimulatedPrice,
          unitPriceDemo: totalSimulatedPrice,
          createdAt: new Date().toISOString(),
        },
      ],
      totalItemCount: 1,
      subtotalMaterialsDemo: totalSimulatedPrice,
      estimatedLaborDemo: Math.round(totalSimulatedPrice * 0.25 * 100) / 100,
      totalDemo: Math.round(totalSimulatedPrice * 1.25 * 100) / 100,
      consolidatedMaterials: simulatedItems.map((m) => ({
        materialId: m.materialId,
        materialName: m.materialName,
        category: 'aluminio' as const,
        totalQuantity: m.quantity,
        unit: m.unit,
        unitPriceDemo: m.unitPrice,
        totalPriceDemo: m.subtotal,
        usedInProductsCount: 1,
        productNames: [product.name],
      })),
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString(),
    };

    await generateAndDownloadPdf(singleItemQuote, {
      itemCount: 1,
      totalProductsCount: 1,
      subtotalMaterialsDemo: totalSimulatedPrice,
      estimatedLaborDemo: Math.round(totalSimulatedPrice * 0.25 * 100) / 100,
      totalDemo: Math.round(totalSimulatedPrice * 1.25 * 100) / 100,
    });
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {/* 1. Filters & Action Button Card */}
        <View style={styles.headerCard}>
          {/* Top Row: Search Input + New Product Button */}
          <View style={styles.filterActionRow}>
            <View style={styles.searchBox}>
              <MaterialCommunityIcons
                name="magnify"
                size={18}
                color="#94A3B8"
                style={{ marginRight: 6 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar producto por nombre, código o serie..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={16}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* "+ NUEVO PRODUCTO" Button */}
            <TouchableOpacity
              style={styles.createProductBtn}
              onPress={() => setIsCreateProductOpen(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
              <Text style={styles.createProductBtnText}>Nuevo Producto</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChipsContainer}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === 'all' && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory('all')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === 'all' && styles.categoryChipTextSelected,
                ]}
              >
                Todos los Modelos ({productsList.length})
              </Text>
            </TouchableOpacity>

            {mockCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = productsList.filter(
                (p) => p.categoryId === cat.id
              ).length;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat.name} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 2. Grid de fichas o detalle del producto */}
        {viewMode === 'grid' ? (
          <View>
            <Text style={styles.gridSectionTitle}>
              Fichas de fabricación ({filteredProducts.length})
            </Text>

            {filteredProducts.length === 0 ? (
              <View style={styles.emptyGrid}>
                <MaterialCommunityIcons
                  name="clipboard-search-outline"
                  size={40}
                  color="#94A3B8"
                />
                <Text style={styles.emptyGridTitle}>Sin resultados</Text>
                <Text style={styles.emptyGridDesc}>
                  Prueba otro término de búsqueda o categoría.
                </Text>
              </View>
            ) : (
              <View style={styles.productGrid}>
                {filteredProducts.map((prod) => (
                  <View
                    key={prod.id}
                    style={[
                      styles.gridItem,
                      { width: `${100 / gridColumns}%` },
                    ]}
                  >
                    <ManufacturingProductGridCard
                      product={prod}
                      onPress={handleOpenProductSheet}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          activeProduct && displayProduct && (
            <View style={styles.detailWrapper}>
              <TouchableOpacity
                style={styles.backRow}
                onPress={handleBackToGrid}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={20}
                  color="#0F4C81"
                />
                <Text style={styles.backRowText}>Volver a fichas</Text>
              </TouchableOpacity>

          {/* Ficha técnica del producto seleccionado */}
            <View style={[styles.recipeDetailCard, isEditingSheet && styles.recipeDetailCardEditing]}>
              {isEditingSheet && (
                <View style={styles.editingBanner}>
                  <MaterialCommunityIcons name="pencil" size={16} color="#92400E" />
                  <Text style={styles.editingBannerText}>Modo edición — modifica los campos y guarda</Text>
                </View>
              )}

              {/* Imagen del producto */}
              <View style={styles.sheetImageBanner}>
                <TechnicalIllustration
                  type={displayProduct.illustrationType}
                  imageUri={
                    isEditingSheet && sheetDraft?.customImageUri.trim()
                      ? sheetDraft.customImageUri.trim()
                      : getProductImageUri(displayProduct)
                  }
                  height={180}
                  isThumbnail
                />
              </View>

              {isEditingSheet && sheetDraft && (
                <Input
                  label="URL de imagen (opcional)"
                  value={sheetDraft.customImageUri}
                  onChangeText={(v) => updateDraftField('customImageUri', v)}
                  placeholder="https://..."
                  autoCapitalize="none"
                  containerStyle={styles.compactInput}
                />
              )}

              {/* Product Sheet Header */}
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHeaderLeft}>
                  {isEditingSheet && sheetDraft ? (
                    <View style={styles.editFieldsBlock}>
                      <View style={styles.editRow2}>
                        <View style={styles.editFieldHalf}>
                          <Input
                            label="Código"
                            value={sheetDraft.code}
                            onChangeText={(v) => updateDraftField('code', v)}
                            containerStyle={styles.compactInput}
                          />
                        </View>
                        <View style={styles.editFieldHalf}>
                          <Input
                            label="Tipo fabricación"
                            value={sheetDraft.fabricationType}
                            onChangeText={(v) => updateDraftField('fabricationType', v)}
                            containerStyle={styles.compactInput}
                          />
                        </View>
                      </View>
                      <View style={styles.editRow4}>
                        <Input label="Ancho mín." value={sheetDraft.minWidthCm} onChangeText={(v) => updateDraftField('minWidthCm', v)} keyboardType="numeric" unitSuffix="cm" containerStyle={styles.compactInput} />
                        <Input label="Ancho máx." value={sheetDraft.maxWidthCm} onChangeText={(v) => updateDraftField('maxWidthCm', v)} keyboardType="numeric" unitSuffix="cm" containerStyle={styles.compactInput} />
                        <Input label="Alto mín." value={sheetDraft.minHeightCm} onChangeText={(v) => updateDraftField('minHeightCm', v)} keyboardType="numeric" unitSuffix="cm" containerStyle={styles.compactInput} />
                        <Input label="Alto máx." value={sheetDraft.maxHeightCm} onChangeText={(v) => updateDraftField('maxHeightCm', v)} keyboardType="numeric" unitSuffix="cm" containerStyle={styles.compactInput} />
                      </View>
                      <Input label="Nombre del producto" value={sheetDraft.name} onChangeText={(v) => updateDraftField('name', v)} containerStyle={styles.compactInput} />
                      <Input label="Descripción corta" value={sheetDraft.shortDescription} onChangeText={(v) => updateDraftField('shortDescription', v)} containerStyle={styles.compactInput} />
                      <Input label="Descripción completa" value={sheetDraft.fullDescription} onChangeText={(v) => updateDraftField('fullDescription', v)} multiline numberOfLines={4} containerStyle={styles.compactInput} inputContainerStyle={styles.textAreaInput} />
                    </View>
                  ) : (
                    <>
                      <View style={styles.sheetCodeRow}>
                        <Text style={styles.sheetCode}>{displayProduct.code}</Text>
                        <View style={styles.sheetBadge}>
                          <Text style={styles.sheetBadgeText}>
                            {displayProduct.fabricationType}
                          </Text>
                        </View>
                        <View style={styles.sheetBadgeGray}>
                          <Text style={styles.sheetBadgeGrayText}>
                            Rango: {displayProduct.minWidthCm}-
                            {displayProduct.maxWidthCm}cm ×{' '}
                            {displayProduct.minHeightCm}-
                            {displayProduct.maxHeightCm}cm
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.sheetTitle}>{displayProduct.name}</Text>
                      <Text style={styles.sheetDesc}>{displayProduct.fullDescription}</Text>
                    </>
                  )}
                </View>

                <View style={styles.sheetHeaderActions}>
                  {isEditingSheet ? (
                    <>
                      <TouchableOpacity style={styles.cancelEditBtn} onPress={handleCancelEditSheet} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="close" size={16} color="#64748B" />
                        <Text style={styles.cancelEditBtnText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.saveEditBtn} onPress={handleSaveEditSheet} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="content-save" size={16} color="#FFFFFF" />
                        <Text style={styles.saveEditBtnText}>Guardar</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.editSheetBtn} onPress={handleStartEditSheet} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="pencil-outline" size={16} color="#0F4C81" />
                        <Text style={styles.editSheetBtnText}>Editar ficha</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.printSheetBtn} onPress={handlePrint} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="printer" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.printSheetBtnText}>Imprimir Ficha</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>

              {/* Technical Specifications Summary Row */}
              {isEditingSheet && sheetDraft ? (
                <View style={styles.editFieldsBlock}>
                  <Input label="Serie de aluminio" value={sheetDraft.aluminumSeries} onChangeText={(v) => updateDraftField('aluminumSeries', v)} containerStyle={styles.compactInput} />
                  <Input label="Tipo de vidrio" value={sheetDraft.glassType} onChangeText={(v) => updateDraftField('glassType', v)} containerStyle={styles.compactInput} />
                  <Input label="Material principal" value={sheetDraft.mainMaterial} onChangeText={(v) => updateDraftField('mainMaterial', v)} containerStyle={styles.compactInput} />
                  <Input label="% desperdicio corte" value={sheetDraft.wastePercentage} onChangeText={(v) => updateDraftField('wastePercentage', v)} keyboardType="numeric" unitSuffix="%" containerStyle={styles.compactInput} />
                </View>
              ) : (
                <View style={styles.specChipsRow}>
                  <View style={styles.specChip}>
                    <Text style={styles.specChipText}>{displayProduct.aluminumSeries}</Text>
                  </View>
                  <View style={styles.specChip}>
                    <Text style={styles.specChipText}>{displayProduct.glassType}</Text>
                  </View>
                </View>
              )}

              {/* Interactive Simulation Dimensions Bar */}
              <View style={styles.simulatorBar}>
                <View style={styles.simBarLeft}>
                  <Text style={styles.simBarTitle}>
                    Simulador de Corte Paramétrico
                  </Text>
                </View>

                <View style={styles.steppersInline}>
                  {/* Stepper Ancho */}
                  <View style={styles.stepperMini}>
                    <Text style={styles.stepperLabel}>Ancho (W):</Text>
                    <TouchableOpacity
                      style={styles.miniStepBtn}
                      onPress={() =>
                        setSimWidth((w) =>
                          Math.max(displayProduct.minWidthCm, w - 10)
                        )
                      }
                    >
                      <Text style={styles.miniStepBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.miniStepVal}>{simWidth} cm</Text>
                    <TouchableOpacity
                      style={styles.miniStepBtn}
                      onPress={() =>
                        setSimWidth((w) =>
                          Math.min(displayProduct.maxWidthCm, w + 10)
                        )
                      }
                    >
                      <Text style={styles.miniStepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Stepper Alto */}
                  <View style={styles.stepperMini}>
                    <Text style={styles.stepperLabel}>Alto (H):</Text>
                    <TouchableOpacity
                      style={styles.miniStepBtn}
                      onPress={() =>
                        setSimHeight((h) =>
                          Math.max(displayProduct.minHeightCm, h - 10)
                        )
                      }
                    >
                      <Text style={styles.miniStepBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.miniStepVal}>{simHeight} cm</Text>
                    <TouchableOpacity
                      style={styles.miniStepBtn}
                      onPress={() =>
                        setSimHeight((h) =>
                          Math.min(displayProduct.maxHeightCm, h + 10)
                        )
                      }
                    >
                      <Text style={styles.miniStepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {isEditingSheet && sheetDraft && (
                <View style={styles.editRow2}>
                  <Input
                    label="Ancho por defecto"
                    value={sheetDraft.defaultWidthCm}
                    onChangeText={(v) => {
                      updateDraftField('defaultWidthCm', v);
                      const n = parseFloat(v.replace(',', '.'));
                      if (Number.isFinite(n)) setSimWidth(n);
                    }}
                    keyboardType="numeric"
                    unitSuffix="cm"
                    containerStyle={styles.compactInput}
                  />
                  <Input
                    label="Alto por defecto"
                    value={sheetDraft.defaultHeightCm}
                    onChangeText={(v) => {
                      updateDraftField('defaultHeightCm', v);
                      const n = parseFloat(v.replace(',', '.'));
                      if (Number.isFinite(n)) setSimHeight(n);
                    }}
                    keyboardType="numeric"
                    unitSuffix="cm"
                    containerStyle={styles.compactInput}
                  />
                </View>
              )}

              {/* Recipe Header with "+ AGREGAR MATERIAL" Button */}
              <View style={styles.recipeHeaderRow}>
                <View style={styles.recipeHeaderLeft}>
                  <Text style={styles.recipeHeaderTitle}>
                    RECETA DE MATERIALES & REGLAS DE CORTE ({simulatedItems.length})
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addMaterialBtn}
                  onPress={() => setIsAddMaterialOpen(true)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text style={styles.addMaterialBtnText}>
                    Agregar Insumos a la Ficha
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Recipes & Cutting Formulas Table */}
              <View style={styles.recipeTable}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tableScrollContent}
                >
                  <View style={styles.tableInner}>
                    {/* Header Row */}
                    <View style={styles.recipeTableHead}>
                      <Text style={[styles.colHead, styles.colMaterial]}>
                        MATERIAL / PERFIL
                      </Text>
                      <Text style={[styles.colHead, styles.colFormula]}>
                        FÓRMULA DE CORTE / REGLA
                      </Text>
                      <Text
                        style={[
                          styles.colHead,
                          styles.colQty,
                          { textAlign: 'right' },
                        ]}
                      >
                        CONSUMO
                      </Text>
                      <Text
                        style={[
                          styles.colHead,
                          styles.colUnit,
                          { textAlign: 'center' },
                        ]}
                      >
                        UNIDAD
                      </Text>
                      <Text
                        style={[
                          styles.colHead,
                          styles.colPrice,
                          { textAlign: 'right' },
                        ]}
                      >
                        P. UNITARIO
                      </Text>
                      <Text
                        style={[
                          styles.colHead,
                          styles.colSubtotal,
                          { textAlign: 'right' },
                        ]}
                      >
                        SUBTOTAL
                      </Text>
                      <Text
                        style={[
                          styles.colHead,
                          styles.colActions,
                          { textAlign: 'center' },
                        ]}
                      >
                        ACC.
                      </Text>
                    </View>

                    {/* Data Rows */}
                    {simulatedItems.map((item, idx) => {
                      const isEven = idx % 2 === 0;
                      return (
                        <View
                          key={idx}
                          style={[
                            styles.recipeTableRow,
                            isEven && styles.recipeTableRowEven,
                          ]}
                        >
                          {/* Col 1: Material Info */}
                          <View
                            style={[styles.colCell, styles.colMaterial]}
                          >
                            <Text style={styles.matCodeText}>
                              {item.materialCode}
                            </Text>
                            <Text
                              style={styles.matNameText}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.materialName}
                            </Text>
                            {isEditingSheet && sheetDraft?.recipeItems[idx] && (
                              <TextInput
                                style={styles.cellInputSmall}
                                value={sheetDraft.recipeItems[idx].notes}
                                onChangeText={(v) => updateRecipeItemDraft(idx, 'notes', v)}
                                placeholder="Notas adicionales"
                                placeholderTextColor="#94A3B8"
                              />
                            )}
                          </View>

                          {/* Col 2: Formula */}
                          <View
                            style={[
                              styles.colCell,
                              styles.colFormula,
                              { justifyContent: 'center' },
                            ]}
                          >
                            {isEditingSheet && sheetDraft?.recipeItems[idx] ? (
                              <TextInput
                                style={styles.cellInputFormula}
                                value={sheetDraft.recipeItems[idx].formulaDescription}
                                onChangeText={(v) =>
                                  updateRecipeItemDraft(idx, 'formulaDescription', v)
                                }
                                multiline
                                placeholder="Fórmula de corte"
                                placeholderTextColor="#92400E"
                              />
                            ) : (
                              <View style={styles.formulaBadge}>
                                <Text
                                  style={styles.formulaText}
                                  numberOfLines={2}
                                  ellipsizeMode="tail"
                                >
                                  {item.formulaDescription}
                                </Text>
                              </View>
                            )}
                          </View>

                          {/* Col 3: Quantity */}
                          <View
                            style={[
                              styles.colCell,
                              styles.colQty,
                              { alignItems: 'flex-end' },
                            ]}
                          >
                            {isEditingSheet && sheetDraft?.recipeItems[idx] ? (
                              <TextInput
                                style={styles.cellInputQty}
                                value={sheetDraft.recipeItems[idx].manualQuantity}
                                onChangeText={(v) =>
                                  updateRecipeItemDraft(idx, 'manualQuantity', v)
                                }
                                placeholder={item.quantity.toFixed(
                                  item.unit === 'und' || item.unit === 'juego' ? 0 : 2
                                )}
                                placeholderTextColor="#94A3B8"
                                keyboardType="decimal-pad"
                              />
                            ) : (
                              <Text style={styles.qtyText}>
                                {item.quantity.toFixed(
                                  item.unit === 'und' || item.unit === 'juego'
                                    ? 0
                                    : 2
                                )}
                              </Text>
                            )}
                          </View>

                          {/* Col 4: Unit */}
                          <View
                            style={[
                              styles.colCell,
                              styles.colUnit,
                              { alignItems: 'center' },
                            ]}
                          >
                            <View style={styles.unitPill}>
                              <Text style={styles.unitPillText}>
                                {item.unit}
                              </Text>
                            </View>
                          </View>

                          {/* Col 5: Unit Price */}
                          <View
                            style={[
                              styles.colCell,
                              styles.colPrice,
                              { alignItems: 'flex-end' },
                            ]}
                          >
                            {isEditingSheet && sheetDraft?.recipeItems[idx] ? (
                              <TextInput
                                style={styles.cellInputPrice}
                                value={sheetDraft.recipeItems[idx].manualUnitPrice}
                                onChangeText={(v) =>
                                  updateRecipeItemDraft(idx, 'manualUnitPrice', v)
                                }
                                placeholder={item.unitPrice.toFixed(2)}
                                placeholderTextColor="#94A3B8"
                                keyboardType="decimal-pad"
                              />
                            ) : (
                              <Text style={styles.unitPriceText}>
                                ${item.unitPrice.toFixed(2)}
                              </Text>
                            )}
                          </View>

                          {/* Col 6: Subtotal */}
                          <View
                            style={[
                              styles.colCell,
                              styles.colSubtotal,
                              { alignItems: 'flex-end' },
                            ]}
                          >
                            <Text style={styles.subtotalText}>
                              ${item.subtotal.toFixed(2)}
                            </Text>
                          </View>

                          {/* Col 7: Delete Action Icon */}
                          <View
                            style={[
                              styles.colCell,
                              styles.colActions,
                              { alignItems: 'center' },
                            ]}
                          >
                            <TouchableOpacity
                              style={styles.deleteRecipeItemBtn}
                              onPress={() =>
                                handleRemoveMaterialFromRecipe(idx)
                              }
                              activeOpacity={0.7}
                              accessibilityLabel="Eliminar insumo de la receta"
                            >
                              <MaterialCommunityIcons
                                name="trash-can-outline"
                                size={16}
                                color="#DC2626"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}

                    {/* Table Footer */}
                    <View style={styles.recipeTableFooter}>
                      <Text style={styles.footerNoteText}>
                        * Receta paramétrica para 1 unidad ({simWidth} ×{' '}
                        {simHeight} cm). Costo automático recalculado en vivo.
                      </Text>
                      <View style={styles.footerTotalBox}>
                        <Text style={styles.footerTotalLabel}>
                          Costo Materiales ({simWidth}×{simHeight}cm):
                        </Text>
                        <Text style={styles.footerTotalValue}>
                          ${totalSimulatedPrice.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
            </View>
          )
        )}
      </ScrollView>

      {/* Modal 1: Create New Product */}
      <CreateProductModal
        visible={isCreateProductOpen}
        onClose={() => setIsCreateProductOpen(false)}
        onSaveProduct={handleSaveNewProduct}
      />

      {/* Modal 2: Add Material to Active Product Recipe */}
      <AddRecipeMaterialModal
        visible={isAddMaterialOpen}
        onClose={() => setIsAddMaterialOpen(false)}
        onAddMaterial={handleAddMaterialToActiveRecipe}
      />

      {/* Toast Feedback */}
      <Toast
        message={toastMessage || ''}
        visible={!!toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
    gap: spacing.lg,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    gap: 12,
    ...shadows.sm,
  },
  filterActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  createProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F4C81',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
    ...shadows.sm,
  },
  createProductBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchBox: {
    flex: 1,
    minWidth: 260,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  categoryChipsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipSelected: {
    backgroundColor: '#FDF8ED',
    borderColor: '#D4AF37',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextSelected: {
    color: '#997316',
    fontWeight: '800',
  },
  gridSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    padding: 6,
  },
  emptyGrid: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyGridTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A2540',
  },
  emptyGridDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 280,
  },
  detailWrapper: {
    gap: 12,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backRowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F4C81',
  },
  sheetImageBanner: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recipeDetailCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 20,
    gap: 14,
    ...shadows.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 14,
  },
  sheetHeaderLeft: {
    flex: 1,
  },
  sheetCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  sheetCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F4C81',
    letterSpacing: 0.5,
  },
  sheetBadge: {
    backgroundColor: '#FDF8ED',
    borderWidth: 1,
    borderColor: '#E8D28E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sheetBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#997316',
  },
  sheetBadgeGray: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sheetBadgeGrayText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A2540',
    marginBottom: 4,
  },
  sheetDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  printSheetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F4C81',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    ...shadows.sm,
  },
  printSheetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sheetHeaderActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  editSheetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F6FD',
    borderWidth: 1,
    borderColor: '#BBD8F5',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  editSheetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F4C81',
  },
  saveEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#15803D',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  saveEditBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  cancelEditBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  recipeDetailCardEditing: {
    borderColor: '#D4AF37',
    backgroundColor: '#FFFDF8',
  },
  editingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editingBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  editFieldsBlock: {
    gap: 4,
  },
  editRow2: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  editRow4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  editFieldHalf: {
    flex: 1,
    minWidth: 140,
  },
  compactInput: {
    marginBottom: 8,
  },
  textAreaInput: {
    minHeight: 88,
    alignItems: 'flex-start',
  },
  cellInputSmall: {
    fontSize: 11,
    color: '#0A2540',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    minWidth: 120,
  },
  cellInputFormula: {
    fontSize: 11,
    color: '#92400E',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FFFBEB',
    minWidth: 180,
    minHeight: 36,
    textAlignVertical: 'top',
  },
  cellInputQty: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2540',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    minWidth: 64,
    textAlign: 'right',
  },
  cellInputPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2540',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    minWidth: 72,
    textAlign: 'right',
  },
  specChipsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  specChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A2540',
  },
  simulatorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDF8ED',
    borderWidth: 1.5,
    borderColor: '#E8D28E',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexWrap: 'wrap',
    gap: 10,
  },
  simBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  simBarTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#997316',
  },
  steppersInline: {
    flexDirection: 'row',
    gap: 16,
  },
  stepperMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepperLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#997316',
  },
  miniStepBtn: {
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniStepBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F4C81',
  },
  miniStepVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A2540',
    minWidth: 46,
    textAlign: 'center',
  },
  recipeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    flexWrap: 'wrap',
    gap: 10,
  },
  recipeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recipeHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.8,
  },
  addMaterialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F4C81',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 4,
  },
  addMaterialBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recipeTable: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  tableScrollContent: {
    minWidth: '100%',
  },
  tableInner: {
    minWidth: 720,
    width: '100%',
  },
  recipeTableHead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
  },
  colHead: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  colCell: {
    paddingVertical: 8,
    minWidth: 0,
  },
  colMaterial: {
    flex: 2.8,
    minWidth: 160,
    paddingRight: 8,
  },
  colFormula: {
    flex: 2.6,
    minWidth: 160,
    paddingRight: 8,
    overflow: 'hidden',
  },
  colQty: {
    flex: 1.1,
    minWidth: 65,
    paddingRight: 8,
  },
  colUnit: {
    flex: 0.9,
    minWidth: 55,
  },
  colPrice: {
    flex: 1.2,
    minWidth: 75,
    paddingRight: 8,
  },
  colSubtotal: {
    flex: 1.3,
    minWidth: 80,
    paddingRight: 8,
  },
  colActions: {
    width: 44,
  },
  recipeTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  recipeTableRowEven: {
    backgroundColor: '#FAFAFA',
  },
  matCodeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F4C81',
  },
  matNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2540',
  },
  formulaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FDF8ED',
    borderWidth: 1,
    borderColor: '#E8D28E',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  formulaText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#997316',
    flexShrink: 1,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  unitPill: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unitPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  unitPriceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  subtotalText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F4C81',
  },
  deleteRecipeItemBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeTableFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    flexWrap: 'wrap',
    gap: 10,
  },
  footerNoteText: {
    fontSize: 10,
    color: '#94A3B8',
    flex: 1,
    minWidth: 200,
  },
  footerTotalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  footerTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F4C81',
  },
});
