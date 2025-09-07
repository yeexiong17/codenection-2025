import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    View as RNView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';

import { PageHeader } from '@/components/PageHeader';

import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { mockAIResponses, mockCalendarEvents } from '@/constants/MockData';
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
    const params = useLocalSearchParams();
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [showTextInput, setShowTextInput] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const [eventContext, setEventContext] = useState<any>(null);

    const getCalendarContext = () => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // Get today's events
        const todayEvents = mockCalendarEvents.filter(event => {
            const eventDate = new Date(event.date).toISOString().split('T')[0];
            return eventDate === today;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Get next event
        const nextEvent = todayEvents.find(event => new Date(event.date) > now);

        return {
            todayEvents,
            nextEvent,
            eventCount: todayEvents.length
        };
    };

    // Initialize with calendar-aware greeting
    useEffect(() => {
        const calendarContext = getCalendarContext();
        const now = new Date();
        const hour = now.getHours();

        let greeting = "Hello! I'm your Voice AI Assistant. ";

        if (hour < 12) {
            greeting += "Good morning! ";
        } else if (hour < 17) {
            greeting += "Good afternoon! ";
        } else {
            greeting += "Good evening! ";
        }

        if (calendarContext.todayEvents.length === 0) {
            greeting += "You have a free day today - perfect for self-care and relaxation. How are you feeling?";
        } else if (calendarContext.nextEvent) {
            const nextEventTime = new Date(calendarContext.nextEvent.date);
            const timeUntilEvent = Math.round((nextEventTime.getTime() - now.getTime()) / (1000 * 60));
            greeting += `You have ${calendarContext.eventCount} events today. Your next event "${calendarContext.nextEvent.title}" is in ${timeUntilEvent} minutes. How can I help you prepare?`;
        } else {
            greeting += `You have ${calendarContext.eventCount} events today. How are you feeling about your schedule?`;
        }

        setMessages([{
            id: '0',
            text: greeting,
            isUser: false,
            timestamp: now,
        }]);
    }, []);

    // Handle event context from calendar
    useEffect(() => {
        if (params.eventContext) {
            try {
                const context = JSON.parse(params.eventContext as string);
                setEventContext(context);

                // Create event-specific greeting
                const eventGreeting = `I see you're preparing for "${context.title}" (${context.type}) at ${context.time} on ${context.date}. I'm here to help you get ready! What would you like to know about preparing for this event?`;

                setMessages([{
                    id: '0',
                    text: eventGreeting,
                    isUser: false,
                    timestamp: new Date(),
                }]);
            } catch (error) {
                console.error('Error parsing event context:', error);
            }
        }
    }, [params.eventContext]);

    // Automatic reminders and suggestions
    useEffect(() => {
        const checkForReminders = () => {
            const calendarContext = getCalendarContext();
            const now = new Date();

            // Check if user has been active for more than 2 hours without a break
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && !lastMessage.isUser) {
                const timeSinceLastMessage = now.getTime() - lastMessage.timestamp.getTime();
                const twoHours = 2 * 60 * 60 * 1000;

                if (timeSinceLastMessage > twoHours && calendarContext.nextEvent) {
                    const nextEventTime = new Date(calendarContext.nextEvent.date);
                    const timeUntilEvent = Math.round((nextEventTime.getTime() - now.getTime()) / (1000 * 60));

                    if (timeUntilEvent > 30) {
                        const reminderMessage: Message = {
                            id: Date.now().toString(),
                            text: `💡 I noticed you've been working for a while. You have ${timeUntilEvent} minutes until "${calendarContext.nextEvent.title}". Would you like to take a 10-minute break? I can guide you through some gentle stretches or breathing exercises.`,
                            isUser: false,
                            timestamp: now,
                        };
                        setMessages((prev) => [...prev, reminderMessage]);
                    }
                }
            }
        };

        // Check for reminders every 30 minutes
        const reminderInterval = setInterval(checkForReminders, 30 * 60 * 1000);

        return () => clearInterval(reminderInterval);
    }, [messages]);

    // Proactive suggestions based on calendar
    useEffect(() => {
        const suggestPreEventPreparation = () => {
            const calendarContext = getCalendarContext();
            const now = new Date();

            if (calendarContext.nextEvent) {
                const nextEventTime = new Date(calendarContext.nextEvent.date);
                const timeUntilEvent = Math.round((nextEventTime.getTime() - now.getTime()) / (1000 * 60));

                // Suggest preparation 15 minutes before important events
                if (timeUntilEvent === 15 && calendarContext.nextEvent.type === 'exam') {
                    const suggestionMessage: Message = {
                        id: Date.now().toString(),
                        text: `📚 Your exam "${calendarContext.nextEvent.title}" is in 15 minutes. Let's do a quick confidence-building exercise. Take 3 deep breaths and repeat: "I am prepared and capable." Ready to start?`,
                        isUser: false,
                        timestamp: now,
                    };
                    setMessages((prev) => [...prev, suggestionMessage]);
                } else if (timeUntilEvent === 10 && calendarContext.nextEvent.type === 'class') {
                    const suggestionMessage: Message = {
                        id: Date.now().toString(),
                        text: `🎓 Your class "${calendarContext.nextEvent.title}" starts in 10 minutes. Let's do a quick energy boost - 5 jumping jacks or some gentle neck rolls. Which would you prefer?`,
                        isUser: false,
                        timestamp: now,
                    };
                    setMessages((prev) => [...prev, suggestionMessage]);
                }
            }
        };

        // Check for suggestions every minute
        const suggestionInterval = setInterval(suggestPreEventPreparation, 60 * 1000);

        return () => clearInterval(suggestionInterval);
    }, []);

    const getCalendarAwareResponse = (text: string): string => {
        const lowercaseText = text.toLowerCase();
        const calendarContext = getCalendarContext();

        // If we have event context, provide event-specific responses
        if (eventContext) {
            if (lowercaseText.includes('prepare') || lowercaseText.includes('ready') || lowercaseText.includes('help')) {
                if (eventContext.type === 'exam') {
                    return `For your "${eventContext.title}" exam, I recommend: 1) Review key concepts 30 minutes before, 2) Practice deep breathing to stay calm, 3) Have all materials ready, 4) Get a good night's sleep. What specific area would you like help with?`;
                } else if (eventContext.type === 'class') {
                    return `For your "${eventContext.title}" class, here are some tips: 1) Review previous notes, 2) Prepare questions to ask, 3) Bring all necessary materials, 4) Arrive 5 minutes early. How can I help you feel more confident?`;
                } else {
                    return `For your "${eventContext.title}" event, I suggest: 1) Plan your route and timing, 2) Prepare any materials needed, 3) Take a few deep breaths before starting, 4) Stay hydrated. What would you like to focus on?`;
                }
            }

            if (lowercaseText.includes('stress') || lowercaseText.includes('anxious') || lowercaseText.includes('nervous')) {
                return `I understand you're feeling anxious about "${eventContext.title}". Let's do a quick grounding exercise: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. Ready to try?`;
            }

            if (lowercaseText.includes('break') || lowercaseText.includes('rest')) {
                return `Since you have "${eventContext.title}" coming up, I recommend a 10-minute preparation break: 5 minutes to organize your thoughts, then 5 minutes of deep breathing. Would you like me to guide you through this?`;
            }
        }

        // Check for calendar-related queries
        if (lowercaseText.includes('schedule') || lowercaseText.includes('calendar') || lowercaseText.includes('event')) {
            if (calendarContext.todayEvents.length === 0) {
                return "You have a free day today! This is a great opportunity to focus on self-care and relaxation. Would you like me to suggest some wellness activities?";
            } else if (calendarContext.nextEvent) {
                const nextEventTime = new Date(calendarContext.nextEvent.date);
                const timeUntilEvent = Math.round((nextEventTime.getTime() - new Date().getTime()) / (1000 * 60));
                return `You have ${calendarContext.eventCount} events today. Your next event is "${calendarContext.nextEvent.title}" in ${timeUntilEvent} minutes. Would you like me to suggest some preparation techniques?`;
            }
        }

        // Check for stress/anxiety related to upcoming events
        if (lowercaseText.includes('stress') || lowercaseText.includes('anxious') || lowercaseText.includes('nervous')) {
            if (calendarContext.nextEvent) {
                return `I understand you're feeling stressed. I notice you have "${calendarContext.nextEvent.title}" coming up. Let's do a quick breathing exercise together. Inhale for 4 counts, hold for 4, exhale for 6. Ready to try?`;
            }
            return "I'm here to help you manage stress. Let's start with some deep breathing. Would you like me to guide you through a 2-minute meditation?";
        }

        // Check for break requests
        if (lowercaseText.includes('break') || lowercaseText.includes('tired') || lowercaseText.includes('rest')) {
            if (calendarContext.nextEvent) {
                const nextEventTime = new Date(calendarContext.nextEvent.date);
                const timeUntilEvent = Math.round((nextEventTime.getTime() - new Date().getTime()) / (1000 * 60));
                if (timeUntilEvent > 15) {
                    return `Perfect timing for a break! You have ${timeUntilEvent} minutes until your next event. I recommend a 10-minute mindful walk or some gentle stretching. Which would you prefer?`;
                } else {
                    return `You have ${timeUntilEvent} minutes until your next event. Let's do a quick 5-minute breathing exercise to help you feel centered and ready.`;
                }
            }
            return "Great idea to take a break! I suggest a 15-minute mindfulness session or a short walk. What sounds good to you?";
        }

        // Default responses with calendar context
        const matchingResponse = mockAIResponses.responses.find((response) =>
            response.trigger.some((trigger) => lowercaseText.includes(trigger))
        );

        if (matchingResponse) {
            return matchingResponse.response;
        }

        // Contextual default response
        if (calendarContext.eventCount > 3) {
            return "I can see you have a busy day ahead. How are you feeling about managing your schedule? I'm here to help you stay balanced and prepared.";
        }

        // Test Response
        return "Good morning! Today you have 09:00 Part-time Job Shift, 10:00 Final Exam – Computer Science, 11:30 Dentist, and 15:00 Study Group. To prepare, confirm work essentials, review key exam concepts, and pack items for the dentist plus notes for the study group. Start with a 15‑minute prep: hydrate, light snack, two minutes of 4‑6 breathing, and a quick skim of core formulas/notes. Use an if–then plan: if you feel rushed, take a 60‑second reset and focus only on the very next step. Want a 3‑minute calm‑before‑exam breathing or a rapid review checklist?";

        // return "I'm here to support you. How can I help you feel more centered and prepared for your day?";
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
            // For now, we'll simulate it with contextual responses based on time and calendar
            setTimeout(() => {
                const calendarContext = getCalendarContext();
                const now = new Date();
                const hour = now.getHours();

                // Simulate different voice inputs based on context
                let simulatedText = "";
                if (hour < 12) {
                    simulatedText = "Good morning, how should I prepare for my day?";
                } else if (hour < 17) {
                    simulatedText = "I'm feeling a bit stressed about my upcoming events";
                } else {
                    simulatedText = "Good morning, how should I prepare for my day?";
                }

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
            text: messageText,
            isUser: true,
            timestamp: new Date(),
        };

        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: getCalendarAwareResponse(messageText),
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
            <PageHeader title="Voice AI Assistant" />

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
