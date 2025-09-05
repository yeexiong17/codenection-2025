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


    const getBenefits = (type: ToolkitItem['type']) => {
        switch (type) {
            case 'breathing':
                return [
                    'Reduces stress and anxiety',
                    'Improves focus and concentration',
                    'Helps regulate emotions',
                    'Lowers heart rate and blood pressure'
                ];
            case 'journal':
                return [
                    'Increases self-awareness',
                    'Helps process emotions',
                    'Tracks personal growth',
                    'Improves problem-solving skills'
                ];
            case 'exercise':
                return [
                    'Relieves physical tension',
                    'Improves posture and circulation',
                    'Boosts energy levels',
                    'Reduces muscle stiffness'
                ];
            case 'meditation':
                return [
                    'Enhances mental clarity',
                    'Promotes emotional balance',
                    'Improves sleep quality',
                    'Reduces stress and anxiety'
                ];
            default:
                return [];
        }
    };

    const getSteps = (type: ToolkitItem['type']) => {
        switch (type) {
            case 'breathing':
                return [
                    'Find a comfortable position',
                    'Inhale deeply for 4 seconds',
                    'Hold breath for 4 seconds',
                    'Exhale slowly for 6 seconds',
                    'Repeat for 5-10 cycles'
                ];
            case 'journal':
                return [
                    'Choose a quiet space',
                    'Reflect on your day',
                    'Write without judgment',
                    'Express your feelings',
                    'Note what you\'re grateful for'
                ];
            case 'exercise':
                return [
                    'Stand up and stretch gently',
                    'Roll shoulders backwards and forwards',
                    'Stretch neck side to side',
                    'Do gentle wrist and ankle rotations',
                    'Take short walk if possible'
                ];
            case 'meditation':
                return [
                    'Find a quiet space',
                    'Sit comfortably',
                    'Focus on your breath',
                    'Observe thoughts without judgment',
                    'Gently return focus when distracted'
                ];
            default:
                return [];
        }
    };

    const renderSelectedItem = () => {
        if (!selectedItem) return null;

        const benefits = getBenefits(selectedItem.type);
        const steps = getSteps(selectedItem.type);

        return (
            <View
                style={[
                    styles.modalContent,
                    { backgroundColor: colors.cardBackground },
                ]}>
                <ScrollView style={styles.modalScroll}>
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

                    <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Duration</Text>
                        <View style={styles.durationBadge}>
                            <IconSymbol name="clock" size={16} color={colors.tint} />
                            <Text style={styles.durationText}>{selectedItem.duration}</Text>
                        </View>
                    </View>

                    <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Benefits</Text>
                        {benefits.map((benefit, index) => (
                            <View key={index} style={styles.benefitItem}>
                                <IconSymbol name="checkmark" size={16} color={colors.tint} />
                                <Text style={styles.benefitText}>{benefit}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>How to Practice</Text>
                        {steps.map((step, index) => (
                            <View key={index} style={styles.stepItem}>
                                <Text style={styles.stepNumber}>{index + 1}</Text>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Recommended Use</Text>
                        <Text style={styles.recommendationText}>
                            Practice this activity {selectedItem.type === 'breathing' || selectedItem.type === 'exercise'
                                ? 'whenever you feel stressed or tense'
                                : 'at least once daily'} for best results. Regular practice will help build a healthy mental wellness routine.
                        </Text>
                    </View>
                </ScrollView>

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
        <View style={styles.container}>
            <PageHeader title="Wellness Toolkit" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Featured Activities</Text>
                    <View style={styles.gridContainer}>
                        {mockToolkitItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.gridCard,
                                    { backgroundColor: colors.cardBackground },
                                    { marginHorizontal: 0 }
                                ]}
                                onPress={() => setSelectedItem(item)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: colors.tint }]}>
                                    <IconSymbol
                                        name={getIconName(item.type)}
                                        size={24}
                                        color="#FFFFFF"
                                    />
                                </View>
                                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.cardDuration}>{item.duration}</Text>
                                <View style={[styles.cardType, { backgroundColor: colors.tint }]}>
                                    <Text style={styles.cardTypeText} numberOfLines={1}>{item.type.toUpperCase()}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {selectedItem && (
                <View style={[StyleSheet.absoluteFill, styles.modalOverlay]}>
                    {renderSelectedItem()}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
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
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 20,
        paddingHorizontal: 0,
    },
    gridCard: {
        width: '47%', // Reduced width to prevent overflow
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        padding: 12,
        marginBottom: 12,
        height: 150, // Slightly reduced height
        justifyContent: 'flex-start', // Align content from top
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
        textAlign: 'center',
        minHeight: 36, // Space for 2 lines
        width: '100%',
    },
    cardDuration: {
        fontSize: 13,
        opacity: 0.7,
        marginBottom: 6,
        textAlign: 'center',
    },
    cardType: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        marginTop: 'auto', // Push to bottom of card
    },
    cardTypeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
    modalOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContent: {
        borderRadius: 20,
        padding: 20,
        maxHeight: '85%',
    },
    modalScroll: {
        marginBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 12,
    },
    closeButton: {
        padding: 4,
    },
    modalDescription: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
        opacity: 0.8,
    },
    modalSection: {
        marginBottom: 24,
    },
    modalSectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 12,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    durationText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    benefitText: {
        marginLeft: 8,
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
    stepItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 8,
    },
    stepText: {
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
        paddingTop: 2,
    },
    recommendationText: {
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.8,
    },
    startButton: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
