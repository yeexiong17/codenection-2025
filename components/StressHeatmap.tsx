import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText as Text } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface StressLevel {
    date: string;
    level: 'low' | 'medium' | 'high';
}

// Mock data - in real app, this would come from your data source
const mockStressData: StressLevel[] = [
    // Last 30 days of data
    ...Array(30).fill(null).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as StressLevel['level']
    }))
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function StressHeatmap() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getStressColor = (level: StressLevel['level']) => {
        const baseColors = {
            low: '#7C9A92',    // Sage green - calming
            medium: '#9F91CC', // Soft lavender - gentle alert
            high: '#B5838D'    // Muted rose - caring urgency
        };

        return {
            low: baseColors.low + '40',      // 25% opacity
            medium: baseColors.medium + '80', // 50% opacity
            high: baseColors.high + 'CC',    // 80% opacity
        }[level];
    };

    // Group data by weeks (5 weeks to cover 30 days)
    const weeks = Array(5).fill(null).map((_, weekIndex) => {
        return mockStressData.slice(weekIndex * 7, (weekIndex + 1) * 7);
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stress Level Trends</Text>

            <View style={styles.heatmapContainer}>
                {/* Day labels */}
                <View style={styles.dayLabels}>
                    {DAYS.map((day, i) => (
                        <Text key={day} style={[styles.dayLabel, i === 6 && styles.lastDayLabel]}>
                            {day}
                        </Text>
                    ))}
                </View>

                {/* Heatmap grid */}
                <View style={styles.grid}>
                    {weeks.map((week, weekIndex) => (
                        <View key={weekIndex} style={styles.week}>
                            {week.map((day, dayIndex) => (
                                <View
                                    key={day.date}
                                    style={[
                                        styles.cell,
                                        { backgroundColor: getStressColor(day.level) },
                                        dayIndex === 6 && styles.lastCell
                                    ]}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: getStressColor('low') }]} />
                    <Text style={styles.legendText}>Low</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: getStressColor('medium') }]} />
                    <Text style={styles.legendText}>Medium</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: getStressColor('high') }]} />
                    <Text style={styles.legendText}>High</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    heatmapContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    dayLabels: {
        marginRight: 8,
    },
    dayLabel: {
        fontSize: 12,
        opacity: 0.6,
        height: 20,
        marginBottom: 4,
    },
    lastDayLabel: {
        marginBottom: 0,
    },
    grid: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    week: {
        width: '18%',
    },
    cell: {
        height: 20,
        borderRadius: 4,
        marginBottom: 4,
    },
    lastCell: {
        marginBottom: 0,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 4,
    },
    legendText: {
        fontSize: 12,
        opacity: 0.8,
    },
});
