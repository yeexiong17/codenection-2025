import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText as Text } from '@/components/ThemedText';

interface PageHeaderProps {
    title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
});
