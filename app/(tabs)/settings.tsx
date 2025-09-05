import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, Switch, TouchableOpacity } from 'react-native';

import { PageHeader } from '@/components/PageHeader';

import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const renderSettingItem = ({
        icon,
        title,
        subtitle,
        action,
    }: {
        icon: string;
        title: string;
        subtitle: string;
        action?: React.ReactNode;
    }) => (
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
            <FontAwesomeIcon icon={{ prefix: 'fas', iconName: icon }} size={24} color={colors.tint} style={styles.settingIcon} />
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingSubtitle}>{subtitle}</Text>
            </View>
            {action}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <PageHeader title="Settings" />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                {renderSettingItem({
                    icon: 'bell',
                    title: 'Push Notifications',
                    subtitle: 'Get important updates and reminders',
                    action: <Switch value={true} onValueChange={() => { }} />,
                })}
                {renderSettingItem({
                    icon: 'calendar',
                    title: 'Calendar Sync',
                    subtitle: 'Connect with Google Calendar',
                    action: (
                        <View style={[styles.badge, { backgroundColor: colors.tint }]}>
                            <Text style={styles.badgeText}>CONNECTED</Text>
                        </View>
                    ),
                })}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                {renderSettingItem({
                    icon: 'user',
                    title: 'Profile',
                    subtitle: 'Manage your personal information',
                })}
                {renderSettingItem({
                    icon: 'lock',
                    title: 'Privacy',
                    subtitle: 'Control your data and permissions',
                })}
                {renderSettingItem({
                    icon: 'circle-question',
                    title: 'Help & Support',
                    subtitle: 'Get assistance and provide feedback',
                })}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                {renderSettingItem({
                    icon: 'circle-info',
                    title: 'Version',
                    subtitle: '1.0.0 (Prototype)',
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 1,
    },
    settingIcon: {
        marginRight: 16,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 14,
        opacity: 0.7,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
});
