import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useState } from 'react';
import { View as RNView, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { CalendarSource, mockCalendarSources } from '@/constants/MockData';
import { useColorScheme } from '@/hooks/useColorScheme';


export default function CalendarScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [calendars, setCalendars] = useState(mockCalendarSources);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState('5 minutes ago');

    const toggleCalendar = (id: string) => {
        setCalendars(prev =>
            prev.map(cal =>
                cal.id === id ? { ...cal, enabled: !cal.enabled } : cal
            )
        );
    };

    const handleSync = async () => {
        setIsSyncing(true);

        // Simulate sync process
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSyncing(false);
        setLastSyncTime('Just now');
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
                    icon="calendar"
                    size={20}
                    color={colors.tint}
                />
                <Text style={styles.syncTitle}>Google Calendar</Text>
                <Text style={styles.syncStatus}>Connected</Text>
            </RNView>
            <Text style={styles.lastSync}>Last synced: {lastSyncTime}</Text>
            <TouchableOpacity
                style={[styles.syncButton, { backgroundColor: colors.tint }]}
                onPress={handleSync}
                disabled={isSyncing}
                activeOpacity={0.8}
            >
                <FontAwesomeIcon
                    icon={isSyncing ? 'spinner' : 'sync-alt'}
                    size={16}
                    color="#FFFFFF"
                />
                <Text style={styles.syncButtonText}>
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <ScrollView style={styles.container}>
            <PageHeader title="AI Calendar" />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sync Status</Text>
                {renderSyncStatus()}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Calendar Sources</Text>
                {calendars.map(renderCalendarSource)}
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
        padding: 12,
        marginBottom: 12,
    },
    syncHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    syncTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        flex: 1,
    },
    syncStatus: {
        fontSize: 14,
        color: '#7C9A92', // Sage green for success
        fontWeight: '600',
    },
    lastSync: {
        fontSize: 12,
        opacity: 0.7,
        marginBottom: 12,
    },
    syncButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    syncButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
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
});
