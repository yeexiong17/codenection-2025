import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Audio } from 'expo-av';
import { useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    View as RNView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { PageHeader } from '@/components/PageHeader';

import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { mockAIResponses } from '@/constants/MockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export default function AIChatScreen() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [showTextInput, setShowTextInput] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            text: mockAIResponses.greeting,
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const getMockResponse = (text: string): string => {
        const lowercaseText = text.toLowerCase();
        const matchingResponse = mockAIResponses.responses.find((response) =>
            response.trigger.some((trigger) => lowercaseText.includes(trigger))
        );
        return matchingResponse?.response || "I understand. Could you tell me more about how you're feeling?";
    };

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);

            // Start pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        setIsRecording(false);
        setRecording(null);
        pulseAnim.setValue(1);

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            if (!uri) return;

            // Here you would normally send the audio file to your speech-to-text service
            // For now, we'll simulate it with a timeout
            setTimeout(() => {
                const simulatedText = "This is a simulated transcription of the voice recording.";
                handleSend(simulatedText);
            }, 1000);
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    };

    const handleSend = (text?: string) => {
        const messageText = text || inputText;
        if (!messageText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: new Date(),
        };

        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: getMockResponse(inputText),
            isUser: false,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage, aiResponse]);
        setInputText('');

        // Scroll to bottom after messages update
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageContainer,
                item.isUser ? styles.userMessage : styles.aiMessage,
                { backgroundColor: item.isUser ? colors.tint : colors.cardBackground },
            ]}>
            <Text style={[styles.messageText, item.isUser && styles.userMessageText]}>
                {item.text}
            </Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
            <PageHeader title="AI Assistant" />

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            />

            <RNView style={styles.inputContainer}>
                {showTextInput ? (
                    <RNView style={styles.textInputContainer}>
                        <TouchableOpacity
                            style={[styles.modeToggleButton, { backgroundColor: colors.cardBackground }]}
                            onPress={() => setShowTextInput(false)}>
                            <FontAwesomeIcon
                                icon={{ prefix: 'fas', iconName: 'microphone' }}
                                size={20}
                                color={colors.text}
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.input, { color: colors.text, backgroundColor: colors.cardBackground }]}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type your message..."
                            placeholderTextColor={colors.tabIconDefault}
                            multiline
                            maxLength={500}
                            returnKeyType="send"
                            onSubmitEditing={() => handleSend()}
                            autoFocus
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, { backgroundColor: colors.tint }]}
                            onPress={() => handleSend()}>
                            <FontAwesomeIcon icon={{ prefix: 'fas', iconName: 'paper-plane' }} size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </RNView>
                ) : (
                    <RNView style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.voiceButton,
                                { backgroundColor: isRecording ? '#FF4B4B' : colors.tint },
                            ]}
                            onPress={isRecording ? stopRecording : startRecording}>
                            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                <FontAwesomeIcon
                                    icon={{ prefix: 'fas', iconName: isRecording ? 'square' : 'microphone' }}
                                    size={32}
                                    color="#FFFFFF"
                                />
                            </Animated.View>
                        </TouchableOpacity>
                        {!isRecording && (
                            <TouchableOpacity
                                style={[styles.keyboardButton, { backgroundColor: colors.cardBackground }]}
                                onPress={() => setShowTextInput(true)}>
                                <FontAwesomeIcon
                                    icon={{ prefix: 'fas', iconName: 'keyboard' }}
                                    size={20}
                                    color={colors.text}
                                />
                            </TouchableOpacity>
                        )}
                    </RNView>
                )}
            </RNView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messagesList: {
        padding: 16,
        paddingBottom: 120, // Add extra padding for the voice button
        flexGrow: 1,
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 4,
        padding: 12,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    userMessage: {
        alignSelf: 'flex-end',
    },
    aiMessage: {
        borderTopLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    inputContainer: {
        width: '100%',
        padding: 8,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        marginRight: 8,
        padding: 12,
        borderRadius: 20,
        fontSize: 16,
        maxHeight: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingHorizontal: 50,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    voiceButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    keyboardButton: {
        position: 'absolute',
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    modeToggleButton: {
        width: 36,
        height: 45,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
});
