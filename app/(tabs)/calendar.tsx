import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useState } from 'react';
import { View as RNView, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { CalendarSource, mockCalendarEvents, mockCalendarSources } from '@/constants/MockData';
import { useColorScheme } from '@/hooks/useColorScheme';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

export default function CalendarScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [calendars, setCalendars] = useState(mockCalendarSources);

    const toggleCalendar = (id: string) => {
        setCalendars(prev =>
            prev.map(cal =>
                cal.id === id ? { ...cal, enabled: !cal.enabled } : cal
            )
        );
    };

    const renderCalendarSource = (source: CalendarSource) => (
        <View
            key={source.id}
            style={[styles.calendarItem, { backgroundColor: colors.cardBackground }]}
        >
            <RNView style={styles.calendarHeader}>
                <RNView style={styles.calendarNameContainer}>
                    <RNView style={[styles.colorDot, { backgroundColor: source.color }]} />
                    <Text style={styles.calendarName}>{source.name}</Text>
                </RNView>
                <Switch
                    value={source.enabled}
                    onValueChange={() => toggleCalendar(source.id)}
                />
            </RNView>
        </View>
    );

    const renderSyncStatus = () => (
        <View style={[styles.syncCard, { backgroundColor: colors.cardBackground }]}>
            <RNView style={styles.syncHeader}>
                <FontAwesomeIcon
                    icon={{ prefix: 'fas', iconName: 'calendar' }}
                    size={24}
                    color={colors.tint}
                />
                <Text style={styles.syncTitle}>Google Calendar</Text>
            </RNView>
            <Text style={styles.syncStatus}>Connected</Text>
            <Text style={styles.lastSync}>Last synced: 5 minutes ago</Text>
            <TouchableOpacity
                style={[styles.syncButton, { backgroundColor: colors.tint }]}
                onPress={() => {/* Handle sync */ }}
            >
                <Text style={styles.syncButtonText}>Sync Now</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <PageHeader title="Calendar" />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sync Status</Text>
                {renderSyncStatus()}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Calendar Sources</Text>
                {calendars.map(renderCalendarSource)}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                {mockCalendarEvents
                    .filter(event => calendars.find(cal => cal.id === event.calendarId)?.enabled)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(event => {
                        const calendar = calendars.find(cal => cal.id === event.calendarId);
                        return (
                            <View
                                key={event.id}
                                style={[styles.eventCard, { backgroundColor: colors.cardBackground }]}
                            >
                                <RNView style={styles.eventHeader}>
                                    <RNView style={styles.eventTitleContainer}>
                                        <RNView style={[styles.colorDot, { backgroundColor: calendar?.color }]} />
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                    </RNView>
                                    <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
                                </RNView>
                                <Text style={styles.eventDescription}>{event.description}</Text>
                                <Text style={[styles.calendarName, { color: calendar?.color }]}>
                                    {calendar?.name}
                                </Text>
                            </View>
                        );
                    })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    syncCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    syncHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    syncTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },
    syncStatus: {
        fontSize: 16,
        color: '#7C9A92', // Sage green for success
        fontWeight: '600',
        marginBottom: 4,
    },
    lastSync: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 16,
    },
    syncButton: {
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    syncButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    calendarItem: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    calendarNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    calendarName: {
        fontSize: 16,
        fontWeight: '500',
    },
    eventCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    eventTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
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
        opacity: 0.8,
    },
    calendarName: {
        fontSize: 12,
        fontWeight: '600',
    },
});
