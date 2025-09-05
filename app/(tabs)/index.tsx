import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { StressHeatmap } from '@/components/StressHeatmap';
import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { CalendarEvent, mockCalendarEvents, mockStressInsights, StressInsight } from '@/constants/MockData';
import { useColorScheme } from '@/hooks/useColorScheme';

function InsightsTab() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleInsightPress = (insightId: string) => {
    router.push(`/insight-detail?id=${insightId}`);
  };

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {mockStressInsights.map((insight: StressInsight) => (
        <TouchableOpacity
          key={insight.id}
          style={[styles.insightCard, { backgroundColor: getInsightSeverityColor(insight.severity) }]}
          onPress={() => handleInsightPress(insight.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.insightMessage}>{insight.message}</Text>
          <Text style={styles.insightRecommendation}>{insight.recommendation}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

function UpcomingTab() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {mockCalendarEvents
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((event: CalendarEvent) => (
          <TouchableOpacity
            key={event.id}
            style={[styles.eventCard, { backgroundColor: colors.cardBackground }]}
          >
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>
                {format(new Date(event.date), 'MMM d, h:mm a')}
              </Text>
            </View>
            <Text style={styles.eventDescription}>{event.description}</Text>
            <View style={[styles.eventType, { backgroundColor: getEventTypeColor(event.type) }]}>
              <Text style={styles.eventTypeText}>{event.type.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

function SummaryTab() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const screenWidth = Dimensions.get('window').width - 32; // Account for padding

  const stats = {
    upcomingEvents: mockCalendarEvents.length,
    highStressCount: mockStressInsights.filter(i => i.severity === 'high').length,
    nextEvent: mockCalendarEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0],
  };

  // Calculate stress level distribution for doughnut chart
  const stressLevels = {
    low: mockStressInsights.filter(i => i.severity === 'low').length,
    medium: mockStressInsights.filter(i => i.severity === 'medium').length,
    high: mockStressInsights.filter(i => i.severity === 'high').length,
  };

  const doughnutData = [
    {
      name: 'Low',
      count: stressLevels.low || 1,
      color: '#7C9A92', // Sage green - calming
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Medium',
      count: stressLevels.medium || 1,
      color: '#9F91CC', // Soft lavender - gentle alert
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: 'High',
      count: stressLevels.high || 1,
      color: '#B5838D', // Muted rose - caring urgency
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
  ];

  // Prepare stress data for line chart
  const stressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [3, 2, 4, 3, 5, 2, 1], // Mock stress levels (1-5)
      color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`, // Optional
      strokeWidth: 2 // Optional
    }],
  };

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StressHeatmap />

      <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
        <Text style={styles.summaryTitle}>Today's Overview</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Upcoming Events</Text>
          <Text style={styles.summaryValue}>{stats.upcomingEvents}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.summaryLabel}>Next Event</Text>
        <Text style={styles.nextEventTitle}>{stats.nextEvent.title}</Text>
        <Text style={styles.nextEventTime}>
          {format(new Date(stats.nextEvent.date), 'h:mm a')}
        </Text>
      </View>

    </ScrollView>
  );
};

const Tab = createMaterialTopTabNavigator();

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <PageHeader title="Dashboard" />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: [styles.tabBar, { backgroundColor: colors.background }],
          tabBarIndicatorStyle: { backgroundColor: colors.tint },
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.tabIconDefault,
          tabBarLabelStyle: styles.tabLabel,
        }}>
        <Tab.Screen name="Summary" component={SummaryTab} />
        <Tab.Screen name="Insights" component={InsightsTab} />
        <Tab.Screen name="Upcoming" component={UpcomingTab} />
      </Tab.Navigator>
    </View>
  );
}

const getEventTypeColor = (type: CalendarEvent['type']) => {
  const colors: Record<CalendarEvent['type'], string> = {
    exam: '#B5838D', // Muted rose - gentle urgency
    class: '#7C9A92', // Sage green - growth and learning
    bill: '#C6AC8F', // Warm sand - grounding
    other: '#8E9CAA'  // Muted blue-grey - neutral
  };
  return colors[type];
};

const getInsightSeverityColor = (severity: StressInsight['severity']) => {
  const colors: Record<StressInsight['severity'], string> = {
    low: '#7C9A92',    // Sage green - calming
    medium: '#9F91CC', // Soft lavender - gentle alert
    high: '#B5838D'    // Muted rose - caring urgency
  };
  return colors[severity];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  chartCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'none',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  eventDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  eventType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  eventTypeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  insightRecommendation: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 12,
  },
  nextEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  nextEventTime: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
});