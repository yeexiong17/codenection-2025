import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface NotificationBannerProps {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'success';
    onPress?: () => void;
    onDismiss?: () => void;
    autoHide?: boolean;
}

const BANNER_HEIGHT = 80;
const SCREEN_WIDTH = Dimensions.get('window').width;

export function NotificationBanner({
    title,
    message,
    type = 'info',
    onPress,
    onDismiss,
    autoHide = true,
}: NotificationBannerProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const translateY = useRef(new Animated.Value(-BANNER_HEIGHT)).current;

    const getTypeColor = () => {
        switch (type) {
            case 'warning':
                return '#FFD93D';
            case 'success':
                return '#4ECDC4';
            default:
                return colors.tint;
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'warning':
                return 'exclamationmark.triangle.fill';
            case 'success':
                return 'checkmark.circle.fill';
            default:
                return 'info.circle.fill';
        }
    };

    useEffect(() => {
        // Slide in animation
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();

        // Auto-hide after 3 seconds if enabled
        if (autoHide) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        Animated.timing(translateY, {
            toValue: -BANNER_HEIGHT,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            onDismiss?.();
        });
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    backgroundColor: colors.cardBackground,
                },
            ]}>
            <TouchableOpacity
                style={styles.content}
                onPress={onPress}
                activeOpacity={onPress ? 0.7 : 1}>
                <IconSymbol name={getTypeIcon()} size={24} color={getTypeColor()} style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                </View>
                <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
                    <IconSymbol name="xmark" size={20} color={colors.text} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: BANNER_HEIGHT,
        width: SCREEN_WIDTH,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1000,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    message: {
        fontSize: 14,
        opacity: 0.7,
    },
    dismissButton: {
        padding: 8,
    },
});
