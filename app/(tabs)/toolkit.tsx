import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { PageHeader } from '@/components/PageHeader';

import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { mockToolkitItems, ToolkitItem } from '@/constants/MockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ToolkitScreen() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [selectedItem, setSelectedItem] = useState<ToolkitItem | null>(null);

    const getIconName = (type: ToolkitItem['type']) => {
        switch (type) {
            case 'breathing':
                return 'wind';
            case 'journal':
                return 'book.fill';
            case 'exercise':
                return 'figure.walk';
            case 'meditation':
                return 'sparkles';
            default:
                return 'heart.fill';
        }
    };

    const renderToolkitItem = (item: ToolkitItem) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.itemCard, { backgroundColor: colors.cardBackground }]}
            onPress={() => setSelectedItem(item)}>
            <View style={styles.itemHeader}>
                <IconSymbol
                    name={getIconName(item.type)}
                    size={24}
                    color={colors.tint}
                    style={styles.itemIcon}
                />
                <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDuration}>{item.duration}</Text>
                </View>
            </View>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <View style={[styles.itemType, { backgroundColor: colors.tint }]}>
                <Text style={styles.itemTypeText}>{item.type.toUpperCase()}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderSelectedItem = () => {
        if (!selectedItem) return null;

        return (
            <View
                style={[
                    styles.modalContent,
                    { backgroundColor: colors.cardBackground },
                ]}>
                <View style={styles.modalHeader}>
                    <IconSymbol
                        name={getIconName(selectedItem.type)}
                        size={32}
                        color={colors.tint}
                    />
                    <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSelectedItem(null)}>
                        <IconSymbol name="xmark" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.modalDescription}>
                    {selectedItem.description}
                </Text>

                <TouchableOpacity
                    style={[styles.startButton, { backgroundColor: colors.tint }]}
                    onPress={() => {
                        // In the prototype, we'll just close the modal
                        setSelectedItem(null);
                    }}>
                    <Text style={styles.startButtonText}>Start Activity</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScrollView
            style={[styles.container, { paddingTop: insets.top }]}
            contentContainerStyle={styles.contentContainer}>
            <PageHeader title="Wellness Toolkit" />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Activities</Text>
                {mockToolkitItems.map(renderToolkitItem)}
            </View>

            {selectedItem && (
                <View style={[StyleSheet.absoluteFill, styles.modalOverlay]}>
                    {renderSelectedItem()}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    itemCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemIcon: {
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemDuration: {
        fontSize: 14,
        opacity: 0.7,
    },
    itemDescription: {
        fontSize: 14,
        marginBottom: 12,
    },
    itemType: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    itemTypeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    modalOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContent: {
        borderRadius: 12,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 12,
    },
    closeButton: {
        padding: 4,
    },
    modalDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    startButton: {
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
