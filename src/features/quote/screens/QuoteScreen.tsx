import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ClientRecord, useQuote } from '../context/QuoteContext';
import { QuoteCustomer } from '../../../core/domain/entities/Quote';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface QuoteScreenProps {
  onGoToCatalog: () => void;
}

const emptyClient: QuoteCustomer = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
};

export const QuoteScreen: React.FC<QuoteScreenProps> = () => {
  const {
    clients,
    selectedClientId,
    selectClient,
    addClient,
    updateClient,
    deleteClient,
  } = useQuote();
  const [search, setSearch] = React.useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [newClient, setNewClient] = React.useState<QuoteCustomer>(emptyClient);
  const [viewClient, setViewClient] = React.useState<ClientRecord | null>(null);
  const [editingClient, setEditingClient] = React.useState<ClientRecord | null>(
    null
  );
  const filteredClients = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) => {
      return (
        client.name.toLowerCase().includes(query) ||
        client.phone.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
      );
    });
  }, [clients, search]);

  const handleSelectClient = (client: ClientRecord) => {
    selectClient(client.id);
  };

  const handleCreateClient = () => {
    if (!newClient.name.trim()) {
      return;
    }

    addClient(newClient);
    setNewClient(emptyClient);
    setIsCreateModalOpen(false);
  };

  const handleViewClient = (client: ClientRecord) => {
    setViewClient(client);
    setIsViewModalOpen(true);
  };

  const handleOpenEditClient = (client: ClientRecord) => {
    setEditingClient({ ...client });
    setIsEditModalOpen(true);
  };

  const handleSaveEditClient = () => {
    if (!editingClient?.name.trim()) {
      return;
    }

    updateClient(editingClient.id, editingClient);
    setEditingClient(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteClient = (client: ClientRecord) => {
    Alert.alert(
      'Eliminar cliente',
      `¿Deseas eliminar a "${client.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteClient(client.id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.filterActionRow}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons
              name="magnify"
              size={18}
              color={colors.textMuted}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre, teléfono o correo"
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <TouchableOpacity
            style={styles.newClientButton}
            onPress={() => setIsCreateModalOpen(true)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.newClientButtonText}>Nuevo Cliente</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableCardHeader}>
            <Text style={styles.tableCardTitle}>
              LISTA DE CLIENTES ({filteredClients.length} de {clients.length})
            </Text>
          </View>

          {filteredClients.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <MaterialCommunityIcons
                name="account-search-outline"
                size={28}
                color={colors.textMuted}
              />
              <Text style={styles.emptyStateTitle}>Sin resultados</Text>
              <Text style={styles.emptyStateText}>
                No encontramos clientes con ese criterio de búsqueda.
              </Text>
            </View>
          ) : (
            <View style={styles.clientsList}>
              {filteredClients.map((client, index) => {
                const isSelected = selectedClientId === client.id;
                const isEven = index % 2 === 0;
                const clientCode = `CLI-${String(index + 1).padStart(4, '0')}`;

                return (
                  <View
                    key={client.id}
                    style={[styles.clientRow, isEven && styles.clientRowEven]}
                  >
                    <View style={styles.clientMain}>
                      <View style={styles.codeRow}>
                        <Text style={styles.clientCode}>{clientCode}</Text>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>Cliente</Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            isSelected
                              ? styles.statusBadgeActive
                              : styles.statusBadgeDefault,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={
                              isSelected
                                ? 'check-circle'
                                : 'account-outline'
                            }
                            size={12}
                            color={isSelected ? '#FE4648' : '#737373'}
                          />
                          <Text
                            style={[
                              styles.statusBadgeText,
                              isSelected
                                ? styles.statusTextActive
                                : styles.statusTextDefault,
                            ]}
                          >
                            {isSelected ? 'Activo' : 'Registrado'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.clientName}>{client.name}</Text>

                      {!!client.phone && (
                        <View style={styles.contactRow}>
                          <MaterialCommunityIcons
                            name="phone-outline"
                            size={14}
                            color="#737373"
                          />
                          <Text style={styles.contactText}>{client.phone}</Text>
                        </View>
                      )}

                      {!!client.address && (
                        <Text style={styles.clientDesc}>{client.address}</Text>
                      )}

                      {!!client.notes && (
                        <Text style={styles.clientDesc}>{client.notes}</Text>
                      )}
                    </View>

                    <View style={styles.clientRightBlock}>
                      <View style={styles.contactContainer}>
                        <Text style={styles.contactValue} numberOfLines={1}>
                          {client.email || 'Sin correo'}
                        </Text>
                        <Text style={styles.contactLabel}>correo</Text>
                      </View>

                      <View style={styles.actionIconsRow}>
                        <TouchableOpacity
                          style={styles.iconBtnView}
                          onPress={() => handleViewClient(client)}
                          activeOpacity={0.7}
                          accessibilityLabel="Ver cliente"
                        >
                          <MaterialCommunityIcons
                            name="eye-outline"
                            size={18}
                            color="#FE4648"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.iconBtnEdit}
                          onPress={() => handleOpenEditClient(client)}
                          activeOpacity={0.7}
                          accessibilityLabel="Editar cliente"
                        >
                          <MaterialCommunityIcons
                            name="pencil-outline"
                            size={18}
                            color="#FE4648"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.iconBtnDelete}
                          onPress={() => handleDeleteClient(client)}
                          activeOpacity={0.7}
                          accessibilityLabel="Eliminar cliente"
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={18}
                            color="#DC2626"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isCreateModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCreateModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Crear Nuevo Cliente</Text>

            <TextInput
              style={styles.formInput}
              placeholder="Nombre o razón social *"
              placeholderTextColor={colors.textMuted}
              value={newClient.name}
              onChangeText={(text) => setNewClient((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Teléfono"
              placeholderTextColor={colors.textMuted}
              value={newClient.phone}
              onChangeText={(text) => setNewClient((prev) => ({ ...prev, phone: text }))}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Correo"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={newClient.email}
              onChangeText={(text) => setNewClient((prev) => ({ ...prev, email: text }))}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Dirección / obra"
              placeholderTextColor={colors.textMuted}
              value={newClient.address}
              onChangeText={(text) => setNewClient((prev) => ({ ...prev, address: text }))}
            />
            <TextInput
              style={[styles.formInput, styles.formInputMultiline]}
              placeholder="Observaciones"
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              value={newClient.notes}
              onChangeText={(text) => setNewClient((prev) => ({ ...prev, notes: text }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsCreateModalOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleCreateClient}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Guardar Cliente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isViewModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsViewModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Detalle del Cliente</Text>

            {viewClient && (
              <View style={styles.detailList}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nombre</Text>
                  <Text style={styles.detailValue}>{viewClient.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Teléfono</Text>
                  <Text style={styles.detailValue}>
                    {viewClient.phone || '—'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Correo</Text>
                  <Text style={styles.detailValue}>
                    {viewClient.email || '—'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Dirección</Text>
                  <Text style={styles.detailValue}>
                    {viewClient.address || '—'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Observaciones</Text>
                  <Text style={styles.detailValue}>
                    {viewClient.notes || '—'}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsViewModalOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
              {viewClient && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    handleSelectClient(viewClient);
                    setIsViewModalOpen(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>Usar Cliente</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Cliente</Text>

            {editingClient && (
              <>
                <TextInput
                  style={styles.formInput}
                  placeholder="Nombre o razón social *"
                  placeholderTextColor={colors.textMuted}
                  value={editingClient.name}
                  onChangeText={(text) =>
                    setEditingClient((prev) =>
                      prev ? { ...prev, name: text } : prev
                    )
                  }
                />
                <TextInput
                  style={styles.formInput}
                  placeholder="Teléfono"
                  placeholderTextColor={colors.textMuted}
                  value={editingClient.phone}
                  onChangeText={(text) =>
                    setEditingClient((prev) =>
                      prev ? { ...prev, phone: text } : prev
                    )
                  }
                />
                <TextInput
                  style={styles.formInput}
                  placeholder="Correo"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={editingClient.email}
                  onChangeText={(text) =>
                    setEditingClient((prev) =>
                      prev ? { ...prev, email: text } : prev
                    )
                  }
                />
                <TextInput
                  style={styles.formInput}
                  placeholder="Dirección / obra"
                  placeholderTextColor={colors.textMuted}
                  value={editingClient.address}
                  onChangeText={(text) =>
                    setEditingClient((prev) =>
                      prev ? { ...prev, address: text } : prev
                    )
                  }
                />
                <TextInput
                  style={[styles.formInput, styles.formInputMultiline]}
                  placeholder="Observaciones"
                  placeholderTextColor={colors.textMuted}
                  multiline
                  textAlignVertical="top"
                  value={editingClient.notes}
                  onChangeText={(text) =>
                    setEditingClient((prev) =>
                      prev ? { ...prev, notes: text } : prev
                    )
                  }
                />
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditingClient(null);
                  setIsEditModalOpen(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEditClient}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
  },
  filterActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  newClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#C98A16', // Warm Gold
    borderWidth: 1,
    borderColor: '#B45309',
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 9,
    ...shadows.sm,
  },
  newClientButtonText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: '#FFFFFF',
  },
  searchBox: {
    flex: 1,
    minWidth: 220,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 40,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
  },

  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    ...shadows.sm,
  },
  tableCardHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tableCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#525252',
    letterSpacing: 0.8,
  },
  clientsList: {
    width: '100%',
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
  },
  clientRowEven: {
    backgroundColor: '#FAFAFA',
  },
  clientMain: {
    flex: 1,
    paddingRight: 16,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  clientCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C98A16',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#525252',
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
    borderWidth: 1,
  },
  statusBadgeActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusBadgeDefault: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F0F0F0',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#059669',
  },
  statusTextDefault: {
    color: '#737373',
  },
  clientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A192F',
    marginBottom: 3,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  contactText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#525252',
  },
  clientDesc: {
    fontSize: 11,
    color: '#737373',
    lineHeight: 15,
  },
  clientRightBlock: {
    alignItems: 'flex-end',
    minWidth: 130,
    gap: 8,
  },
  contactContainer: {
    alignItems: 'flex-end',
    maxWidth: 160,
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#C98A16',
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },
  actionIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtnView: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnEdit: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDelete: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyStateTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  emptyStateText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  detailList: {
    gap: spacing.sm,
  },
  detailRow: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 47, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    padding: spacing.lg,
    ...shadows.md,
  },
  modalTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.heavy,
    color: '#0A192F',
    marginBottom: spacing.sm,
  },
  formInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  formInputMultiline: {
    minHeight: 90,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#C98A16',
    borderRadius: borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#C98A16',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
});
