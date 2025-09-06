import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { InsightHeader } from '@/components/InsightHeader';
import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { mockStressInsights } from '@/constants/MockData';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function InsightDetailScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <InsightDetailContent />
        </>
    );
}

function InsightDetailContent() {
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Find the insight from mock data
    const insight = mockStressInsights.find(i => i.id === id);

    if (!insight) {
        return (
            <View style={styles.container}>
                <InsightHeader title="Insight Details" />
                <View style={styles.content}>
                    <Text>Insight not found</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <InsightHeader title="Insight Details" />
            <ScrollView style={styles.scrollView}>
                <View
                    style={[
                        styles.insightCard,
                        { backgroundColor: getInsightSeverityColor(insight.severity) },
                    ]}>
                    <Text style={styles.severityLabel}>
                        {insight.severity.toUpperCase()} PRIORITY
                    </Text>
                    <Text style={styles.message}>{insight.message}</Text>
                    <Text style={styles.recommendation}>{insight.recommendation}</Text>
                </View>

                <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                    <Text style={styles.sectionTitle}>What This Means</Text>
                    <Text style={styles.sectionContent}>
                        This insight is based on your recent activity patterns and upcoming events.
                        {insight.severity === 'high'
                            ? ' It requires immediate attention to help maintain your well-being.'
                            : insight.severity === 'medium'
                                ? ' Consider addressing this soon to prevent increased stress.'
                                : ' Keep this in mind as you plan your activities.'}
                    </Text>
                </View>

                <View style={[styles.section]}>
                    <Text style={styles.sectionTitle}>Suggested Actions</Text>
                    <View style={styles.actionItem}>
                        <Text style={styles.actionTitle}>1. Review Your Schedule</Text>
                        <Text style={styles.actionDescription}>
                            Look at your upcoming commitments and identify opportunities for breaks.
                        </Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Text style={styles.actionTitle}>2. Try a Wellness Activity</Text>
                        <Text style={styles.actionDescription}>
                            Check the AI Plan for stress-reducing exercises and activities.
                        </Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Text style={styles.actionTitle}>3. Track Your Progress</Text>
                        <Text style={styles.actionDescription}>
                            Monitor how you feel after implementing the recommendations.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const getInsightSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    const colors = {
        low: '#7C9A92', // Sage green - calming
        medium: '#9F91CC', // Soft lavender - gentle alert
        high: '#B5838D', // Muted rose - caring urgency
    };
    return colors[severity];
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    insightCard: {
        margin: 16,
        borderRadius: 12,
        padding: 16,
    },
    severityLabel: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        opacity: 0.9,
    },
    message: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    recommendation: {
        color: '#FFF',
        fontSize: 16,
        lineHeight: 22,
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    sectionContent: {
        fontSize: 16,
        lineHeight: 22,
        opacity: 0.8,
    },
    actionItem: {
        marginBottom: 16,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.8,
    },
});
