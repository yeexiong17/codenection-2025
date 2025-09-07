import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText as Text } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface StressLevel {
    date: string;
    level: 'low' | 'medium' | 'high';
    notes?: string;
    activities?: string[];
    mood?: string;
}

// Generate stress data for the last 30 days
const generateStressData = (): StressLevel[] => {
    const data: StressLevel[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dayOfWeek = date.getDay();

        // Create more realistic stress patterns
        let level: StressLevel['level'] = 'low';
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekends
            level = Math.random() < 0.3 ? 'medium' : 'low';
        } else if (dayOfWeek === 1 || dayOfWeek === 5) { // Monday/Friday
            level = Math.random() < 0.6 ? 'medium' : Math.random() < 0.2 ? 'high' : 'low';
        } else { // Mid-week
            level = Math.random() < 0.4 ? 'medium' : Math.random() < 0.1 ? 'high' : 'low';
        }

        data.push({
            date: date.toISOString(),
            level,
            notes: [
                "Had a productive morning meeting",
                "Felt overwhelmed with deadlines",
                "Great workout session",
                "Difficult conversation with manager",
                "Relaxing evening with family",
                "Struggled with focus today",
                "Completed important project milestone"
            ][Math.floor(Math.random() * 7)],
            activities: [
                ["Work", "Exercise", "Meditation"],
                ["Work", "Social", "Reading"],
                ["Work", "Family", "Rest"],
                ["Work", "Exercise", "Hobby"],
                ["Work", "Social", "Entertainment"]
            ][Math.floor(Math.random() * 5)],
            mood: ["😊", "😌", "😰", "😤", "😴", "🤔", "😌"][Math.floor(Math.random() * 7)]
        });
    }

    return data;
};

const mockStressData: StressLevel[] = generateStressData();

export function StressHeatmap() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getStressColor = (level: StressLevel['level']) => {
        const baseColors = {
            low: '#7C9A92',    // Sage green - calming
            medium: '#9F91CC', // Soft lavender - gentle alert
            high: '#B5838D'    // Muted rose - caring urgency
        };
        return baseColors[level];
    };

    // Calculate stress statistics
    const stressStats = {
        low: mockStressData.filter(item => item.level === 'low').length,
        medium: mockStressData.filter(item => item.level === 'medium').length,
        high: mockStressData.filter(item => item.level === 'high').length,
    };

    const totalDays = mockStressData.length;
    const averageStress = ((stressStats.low * 1) + (stressStats.medium * 2) + (stressStats.high * 3)) / totalDays;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Stress Patterns</Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>Last 30 days</Text>
            </View>

            {/* Stress Summary */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={[styles.summaryTitle, { color: colors.text }]}>Average Stress Level</Text>

                    {/* Visual Scale */}
                    <View style={styles.scaleContainer}>
                        <View style={styles.scaleLabels}>
                            <Text style={[styles.scaleLabel, { color: colors.text }]}>Low</Text>
                            <Text style={[styles.scaleLabel, { color: colors.text }]}>Medium</Text>
                            <Text style={[styles.scaleLabel, { color: colors.text }]}>High</Text>
                        </View>
                        <View style={styles.scaleBar}>
                            <View style={[styles.scaleBackground, { backgroundColor: colors.cardBackground }]}>
                                <View
                                    style={[
                                        styles.scaleFill,
                                        {
                                            width: `${((averageStress - 1) / 2) * 100}%`,
                                            backgroundColor: averageStress < 1.5 ? getStressColor('low') :
                                                averageStress < 2.5 ? getStressColor('medium') :
                                                    getStressColor('high')
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                        <Text style={[styles.scaleValue, { color: colors.tint }]}>
                            {averageStress.toFixed(1)} / 3.0
                        </Text>
                    </View>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <View style={[styles.statColor, { backgroundColor: getStressColor('low') }]} />
                        <Text style={[styles.statNumber, { color: colors.text }]}>{stressStats.low}</Text>
                        <Text style={[styles.statLabel, { color: colors.text }]}>Low Days</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={[styles.statColor, { backgroundColor: getStressColor('medium') }]} />
                        <Text style={[styles.statNumber, { color: colors.text }]}>{stressStats.medium}</Text>
                        <Text style={[styles.statLabel, { color: colors.text }]}>Medium Days</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={[styles.statColor, { backgroundColor: getStressColor('high') }]} />
                        <Text style={[styles.statNumber, { color: colors.text }]}>{stressStats.high}</Text>
                        <Text style={[styles.statLabel, { color: colors.text }]}>High Days</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 13,
        opacity: 0.7,
        fontWeight: '500',
    },
    summaryContainer: {
        marginBottom: 20,
    },
    summaryCard: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        opacity: 0.8,
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 4,
    },
    summarySubtext: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.7,
    },
    scaleContainer: {
        width: '100%',
        alignItems: 'center',
    },
    scaleLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    scaleLabel: {
        fontSize: 12,
        fontWeight: '500',
        opacity: 0.7,
    },
    scaleBar: {
        width: '100%',
        marginBottom: 12,
    },
    scaleBackground: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    scaleFill: {
        height: '100%',
        borderRadius: 4,
    },
    scaleValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        opacity: 0.7,
        textAlign: 'center',
    },
});
