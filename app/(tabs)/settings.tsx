import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

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
        onPress,
    }: {
        icon: string;
        title: string;
        subtitle: string;
        action?: React.ReactNode;
        onPress?: () => void;
    }) => (
        <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <FontAwesomeIcon icon={{ prefix: 'fas', iconName: icon }} size={24} color={colors.tint} style={styles.settingIcon} />
            <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.settingSubtitle, { color: colors.text }]}>{subtitle}</Text>
            </View>
            {action}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <PageHeader title="Settings" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
                    <View style={[styles.sectionCard]}>
                        {renderSettingItem({
                            icon: 'bell',
                            title: 'Push Notifications',
                            subtitle: 'Get important updates and reminders',
                            action: <Switch value={true} onValueChange={() => { }} />,
                        })}
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
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
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
                    <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
                        {renderSettingItem({
                            icon: 'user',
                            title: 'Profile',
                            subtitle: 'Manage your personal information',
                            onPress: () => console.log('Profile pressed'),
                        })}
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        {renderSettingItem({
                            icon: 'lock',
                            title: 'Privacy',
                            subtitle: 'Control your data and permissions',
                            onPress: () => console.log('Privacy pressed'),
                        })}
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        {renderSettingItem({
                            icon: 'circle-question',
                            title: 'Help & Support',
                            subtitle: 'Get assistance and provide feedback',
                            onPress: () => console.log('Help pressed'),
                        })}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
                    <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
                        {renderSettingItem({
                            icon: 'circle-info',
                            title: 'Version',
                            subtitle: '1.0.0 (Prototype)',
                        })}
                    </View>
                </View>
            </ScrollView>
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
    scrollContent: {
        paddingBottom: 20,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    sectionCard: {
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        minHeight: 64,
    },
    settingIcon: {
        marginRight: 16,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingContent: {
        backgroundColor: Colors.light.cardBackground,
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.2,
    },
    settingSubtitle: {
        fontSize: 14,
        opacity: 0.7,
        lineHeight: 18,
    },
    divider: {
        height: 1,
        marginLeft: 56,
        opacity: 0.1,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        minWidth: 80,
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
