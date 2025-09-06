import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

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
    const screenWidth = Dimensions.get('window').width;

    const getStressValue = (level: StressLevel['level']) => {
        switch (level) {
            case 'low': return 1;
            case 'medium': return 2;
            case 'high': return 3;
            default: return 1;
        }
    };

    const getStressColor = (level: StressLevel['level']) => {
        const baseColors = {
            low: '#7C9A92',    // Sage green - calming
            medium: '#9F91CC', // Soft lavender - gentle alert
            high: '#B5838D'    // Muted rose - caring urgency
        };
        return baseColors[level];
    };

    // Chart dimensions
    const chartWidth = screenWidth - 80; // Account for padding
    const chartHeight = 200;
    const padding = 40;
    const dataPoints = mockStressData.length;

    // Calculate points for the line chart
    const points = mockStressData.map((data, index) => {
        const x = padding + (index / (dataPoints - 1)) * (chartWidth - 2 * padding);
        const y = padding + (3 - getStressValue(data.level)) * (chartHeight - 2 * padding) / 2;
        return { x, y, data };
    });

    // Create path for the line
    const pathData = points.map((point, index) => {
        return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Stress Level Trends</Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>Last 30 days</Text>
            </View>

            <View style={styles.chartContainer}>
                <Svg width={chartWidth} height={chartHeight}>
                    {/* Grid lines */}
                    <Line
                        x1={padding}
                        y1={padding}
                        x2={chartWidth - padding}
                        y2={padding}
                        stroke={colors.text + '20'}
                        strokeWidth={1}
                    />
                    <Line
                        x1={padding}
                        y1={padding + (chartHeight - 2 * padding) / 2}
                        x2={chartWidth - padding}
                        y2={padding + (chartHeight - 2 * padding) / 2}
                        stroke={colors.text + '20'}
                        strokeWidth={1}
                    />
                    <Line
                        x1={padding}
                        y1={chartHeight - padding}
                        x2={chartWidth - padding}
                        y2={chartHeight - padding}
                        stroke={colors.text + '20'}
                        strokeWidth={1}
                    />

                    {/* Y-axis labels */}
                    <SvgText
                        x={padding - 10}
                        y={padding + 5}
                        fontSize="12"
                        fill={colors.text + '80'}
                        textAnchor="end"
                    >
                        High
                    </SvgText>
                    <SvgText
                        x={padding - 10}
                        y={padding + (chartHeight - 2 * padding) / 2 + 5}
                        fontSize="12"
                        fill={colors.text + '80'}
                        textAnchor="end"
                    >
                        Medium
                    </SvgText>
                    <SvgText
                        x={padding - 10}
                        y={chartHeight - padding + 5}
                        fontSize="12"
                        fill={colors.text + '80'}
                        textAnchor="end"
                    >
                        Low
                    </SvgText>

                    {/* Line chart */}
                    <Path
                        d={pathData}
                        stroke={colors.tint}
                        strokeWidth={3}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {points.map((point, index) => (
                        <Circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r={4}
                            fill={getStressColor(point.data.level)}
                            stroke={colors.background}
                            strokeWidth={2}
                        />
                    ))}
                </Svg>

                {/* X-axis labels */}
                <View style={styles.xAxisLabels}>
                    <Text style={[styles.xAxisLabel, { color: colors.text }]}>
                        {formatDate(mockStressData[0].date)}
                    </Text>
                    <Text style={[styles.xAxisLabel, { color: colors.text }]}>
                        {formatDate(mockStressData[Math.floor(dataPoints / 2)].date)}
                    </Text>
                    <Text style={[styles.xAxisLabel, { color: colors.text }]}>
                        {formatDate(mockStressData[dataPoints - 1].date)}
                    </Text>
                </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                <Text style={[styles.legendTitle, { color: colors.text }]}>Stress Level</Text>
                <View style={styles.legendItems}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: getStressColor('low') }]} />
                        <Text style={[styles.legendText, { color: colors.text }]}>Low</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: getStressColor('medium') }]} />
                        <Text style={[styles.legendText, { color: colors.text }]}>Medium</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: getStressColor('high') }]} />
                        <Text style={[styles.legendText, { color: colors.text }]}>High</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
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
    chartContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 40,
        marginTop: 8,
    },
    xAxisLabel: {
        fontSize: 11,
        opacity: 0.7,
        fontWeight: '500',
    },
    legend: {
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.08)',
    },
    legendTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 12,
        opacity: 0.8,
    },
    legendItems: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: 8,
        marginRight: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    legendText: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.8,
    },
});
