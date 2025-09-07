import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    companionId?: string;
}

interface AICompanion {
    id: string;
    name: string;
    personality: string;
    description: string;
    avatar: string;
    color: string;
    greeting: string;
    traits: string[];
}

const defaultCompanions: AICompanion[] = [
    {
        id: '1',
        name: 'Luna',
        personality: 'Wise & Calming',
        description: 'A gentle, wise companion who helps you find peace and clarity in stressful moments.',
        avatar: '🌙',
        color: '#6366F1',
        greeting: 'Hello! I\'m Luna, your mindful companion. I\'m here to help you find calm and wisdom in your daily journey. How are you feeling today?',
        traits: ['Mindful', 'Wise', 'Calming', 'Supportive']
    },
    {
        id: '2',
        name: 'Zara',
        personality: 'Energetic & Motivational',
        description: 'An enthusiastic friend who boosts your energy and helps you tackle challenges with confidence.',
        avatar: '⚡',
        color: '#F59E0B',
        greeting: 'Hey there! I\'m Zara, your energy booster! 💪 Ready to conquer the day together? What exciting challenge are we tackling today?',
        traits: ['Energetic', 'Motivational', 'Confident', 'Optimistic']
    },
    {
        id: '3',
        name: 'Sage',
        personality: 'Analytical & Thoughtful',
        description: 'A thoughtful companion who helps you think through problems and make informed decisions.',
        avatar: '🧠',
        color: '#10B981',
        greeting: 'Greetings! I\'m Sage, your analytical companion. I love helping you think through complex situations and find logical solutions. What\'s on your mind?',
        traits: ['Analytical', 'Logical', 'Thoughtful', 'Problem-solver']
    },
    {
        id: '4',
        name: 'Aria',
        personality: 'Creative & Inspiring',
        description: 'A creative soul who inspires you to think outside the box and explore new possibilities.',
        avatar: '🎨',
        color: '#EC4899',
        greeting: 'Hello beautiful soul! I\'m Aria, your creative muse! ✨ Let\'s explore the wonderful world of possibilities together. What creative adventure shall we embark on?',
        traits: ['Creative', 'Inspiring', 'Imaginative', 'Artistic']
    }
];

export default function AICompanionScreen() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [selectedCompanion, setSelectedCompanion] = useState<AICompanion | null>(null);
    const [showCompanionSelector, setShowCompanionSelector] = useState(false);
    const [customCompanions, setCustomCompanions] = useState<AICompanion[]>([]);
    const [showAddCompanion, setShowAddCompanion] = useState(false);
    const [isSelectorCollapsed, setIsSelectorCollapsed] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    const allCompanions = [...defaultCompanions, ...customCompanions];

    // Initialize with first companion if none selected
    useEffect(() => {
        if (!selectedCompanion && allCompanions.length > 0) {
            setSelectedCompanion(allCompanions[0]);
        }
    }, [allCompanions.length]);

    // Initialize messages when companion is selected
    useEffect(() => {
        if (selectedCompanion && messages.length === 0) {
            setMessages([{
                id: '0',
                text: selectedCompanion.greeting,
                isUser: false,
                timestamp: new Date(),
                companionId: selectedCompanion.id,
            }]);
        }
    }, [selectedCompanion]);

    const getCompanionResponse = (text: string, companion: AICompanion): string => {
        const lowercaseText = text.toLowerCase();

        // Personality-based responses
        if (companion.id === '1') { // Luna - Wise & Calming
            if (lowercaseText.includes('stress') || lowercaseText.includes('anxious') || lowercaseText.includes('worried')) {
                return "I sense you're carrying some weight today. Let's breathe together - in for four counts, hold for four, out for six. Feel the tension leaving your body with each exhale. You're safe here with me. 🌙";
            }
            if (lowercaseText.includes('tired') || lowercaseText.includes('exhausted')) {
                return "Your body is asking for rest, and that's perfectly okay. Sometimes the wisest thing we can do is honor our need for stillness. Would you like me to guide you through a gentle meditation?";
            }
            if (lowercaseText.includes('confused') || lowercaseText.includes('lost')) {
                return "When we feel lost, it's often because we're looking outward for answers that already exist within. Take a moment to connect with your inner wisdom. What does your heart tell you?";
            }
            return "I'm here to hold space for whatever you're experiencing. Sometimes the most profound healing happens in the quiet moments between words. How can I support you today?";
        }

        if (companion.id === '2') { // Zara - Energetic & Motivational
            if (lowercaseText.includes('tired') || lowercaseText.includes('exhausted')) {
                return "I hear you, but let's turn that energy around! 💪 Sometimes we need to push through the tiredness to find our second wind. What's one small action you can take right now to feel more energized?";
            }
            if (lowercaseText.includes('difficult') || lowercaseText.includes('hard') || lowercaseText.includes('challenge')) {
                return "YES! Challenges are just opportunities in disguise! 🚀 You've got this! What's the first step you need to take? Let's break it down and tackle it together!";
            }
            if (lowercaseText.includes('motivation') || lowercaseText.includes('motivated')) {
                return "That's the spirit! 🔥 Motivation is like a muscle - the more you use it, the stronger it gets! What's your next big goal? Let's make it happen!";
            }
            return "You're amazing and capable of incredible things! 🌟 Every day is a chance to grow and become even more awesome. What exciting thing are we going to accomplish today?";
        }

        if (companion.id === '3') { // Sage - Analytical & Thoughtful
            if (lowercaseText.includes('decision') || lowercaseText.includes('choose') || lowercaseText.includes('decide')) {
                return "Let's approach this systematically. What are the key factors you need to consider? Let's list the pros and cons, weigh the risks and benefits, and find the most logical path forward.";
            }
            if (lowercaseText.includes('problem') || lowercaseText.includes('issue') || lowercaseText.includes('trouble')) {
                return "Every problem has a solution waiting to be discovered. Let's break this down: What's the root cause? What are the contributing factors? What resources do you have available?";
            }
            if (lowercaseText.includes('confused') || lowercaseText.includes('unclear')) {
                return "Clarity comes through careful analysis. Let's examine this step by step. What do you know for certain? What assumptions might you be making? What additional information do you need?";
            }
            return "I appreciate your thoughtful approach to this. Let's examine the situation from multiple angles to find the most effective solution. What's the first aspect you'd like to explore?";
        }

        if (companion.id === '4') { // Aria - Creative & Inspiring
            if (lowercaseText.includes('creative') || lowercaseText.includes('art') || lowercaseText.includes('design')) {
                return "Creativity flows through you like a river! 🎨 Let's explore the endless possibilities. What if we approached this from a completely different angle? What colors, shapes, or metaphors come to mind?";
            }
            if (lowercaseText.includes('stuck') || lowercaseText.includes('blocked')) {
                return "Creative blocks are just invitations to try something new! ✨ Let's shake things up - what if we tried the opposite approach? Or what if we combined two completely different ideas?";
            }
            if (lowercaseText.includes('boring') || lowercaseText.includes('routine')) {
                return "Routine can be a canvas for creativity! 🌈 What if we added a splash of color to your day? How can we make the ordinary extraordinary? Let's find the magic in the mundane!";
            }
            return "Your imagination is a powerful force! ✨ Let's explore the wonderful world of possibilities together. What dreams are calling to you today?";
        }

        // Default responses for custom companions
        return `I understand what you're saying. As your AI companion, I'm here to support you. Can you tell me more about how you're feeling?`;
    };

    const handleSend = () => {
        if (!inputText.trim() || !selectedCompanion) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: new Date(),
        };

        const companionResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: getCompanionResponse(inputText, selectedCompanion),
            isUser: false,
            timestamp: new Date(),
            companionId: selectedCompanion.id,
        };

        setMessages((prev) => [...prev, userMessage, companionResponse]);
        setInputText('');

        // Scroll to bottom after messages update
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleCompanionSelect = (companion: AICompanion) => {
        setSelectedCompanion(companion);
        setShowCompanionSelector(false);

        // Clear messages and start fresh with new companion
        setMessages([{
            id: '0',
            text: companion.greeting,
            isUser: false,
            timestamp: new Date(),
            companionId: companion.id,
        }]);
    };

    const addCustomCompanion = (companionData: Omit<AICompanion, 'id'>) => {
        const newCompanion: AICompanion = {
            ...companionData,
            id: Date.now().toString(),
        };

        setCustomCompanions(prev => [...prev, newCompanion]);
        setShowAddCompanion(false);

        // Switch to the new companion
        handleCompanionSelect(newCompanion);

        Alert.alert('Success', 'Your new AI companion has been created!');
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={styles.messageContainer}>
            {item.isUser ? (
                <View style={styles.userMessageContainer}>
                    <View style={[
                        styles.userMessageContent,
                        { backgroundColor: selectedCompanion?.color || colors.tint }
                    ]}>
                        <Text style={[styles.messageText, styles.userMessageText]}>
                            {item.text}
                        </Text>
                        <Text style={[styles.timestamp, styles.userTimestamp]}>
                            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                    <View style={[styles.userAvatar, { backgroundColor: selectedCompanion?.color || colors.tint }]}>
                        <FontAwesomeIcon icon={{ prefix: 'fas', iconName: 'user' }} size={16} color="#FFFFFF" />
                    </View>
                </View>
            ) : (
                <View style={styles.aiMessageContainer}>
                    {selectedCompanion && (
                        <View style={[styles.companionAvatar, { backgroundColor: selectedCompanion.color + '20' }]}>
                            <Text style={styles.avatarText}>{selectedCompanion.avatar}</Text>
                        </View>
                    )}
                    <View style={[styles.aiMessageContent, { backgroundColor: colorScheme === 'dark' ? '#3B3956' : '#EFF2F0' }]}>
                        <Text style={[styles.messageText, { color: colors.text }]}>
                            {item.text}
                        </Text>
                        <Text style={[styles.timestamp, { color: colors.tabIconDefault }]}>
                            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );

    const renderCompanionCard = (companion: AICompanion) => (
        <TouchableOpacity
            key={companion.id}
            style={[
                styles.companionCard,
                { backgroundColor: colors.cardBackground },
                { borderColor: 'rgba(0,0,0,0.06)', borderWidth: 1 },
                selectedCompanion?.id === companion.id && { borderColor: companion.color, borderWidth: 2 }
            ]}
            onPress={() => handleCompanionSelect(companion)}
            activeOpacity={0.85}
        >
            <View style={[styles.companionCardAvatar, { backgroundColor: companion.color + '20' }]}>
                <Text style={styles.companionAvatarText}>{companion.avatar}</Text>
            </View>
            <View style={styles.companionInfo}>
                <Text style={[styles.companionName, { color: colors.text }]}>{companion.name}</Text>
                <View style={styles.personalityPillsRow}>
                    {companion.personality
                        .split(/[,&]/)
                        .map(p => p.trim())
                        .filter(Boolean)
                        .map((pill) => (
                            <View key={pill} style={[styles.personalityPill, { backgroundColor: companion.color + '1A' }]}>
                                <Text style={[styles.personalityPillText, { color: companion.color }]}>{pill}</Text>
                            </View>
                        ))}
                </View>
                <Text style={[styles.companionDescription, { color: colors.tabIconDefault }]} numberOfLines={3}>
                    {companion.description}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
            <PageHeader title="AI Companions" />

            {/* Companion Selector */}
            <View style={styles.companionSelector}>
                <TouchableOpacity
                    style={[styles.selectorHeader, { backgroundColor: colors.cardBackground }]}
                    onPress={() => setIsSelectorCollapsed(prev => !prev)}
                    activeOpacity={0.8}
                >
                    <View style={styles.selectorHeaderLeft}>
                        {selectedCompanion && (
                            <View style={[styles.selectorAvatar, { backgroundColor: selectedCompanion.color + '20' }]}>
                                <Text style={styles.avatarText}>{selectedCompanion.avatar}</Text>
                            </View>
                        )}
                        <View>
                            <Text style={[styles.selectorTitle, { color: colors.text }]}>Companion</Text>
                            <Text style={[styles.selectorSubtitle, { color: colors.tabIconDefault }]}>
                                {selectedCompanion ? selectedCompanion.name : 'None selected'}
                            </Text>
                        </View>
                    </View>
                    <FontAwesomeIcon
                        icon={{ prefix: 'fas', iconName: isSelectorCollapsed ? 'chevron-down' : 'chevron-up' }}
                        size={14}
                        color={colors.text}
                    />
                </TouchableOpacity>

                {!isSelectorCollapsed && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.companionScroll}>
                        {allCompanions.map(renderCompanionCard)}
                        <TouchableOpacity
                            style={[styles.addCompanionCard, { backgroundColor: colors.cardBackground }]}
                            onPress={() => setShowAddCompanion(true)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.addCompanionIcon, { backgroundColor: colors.tint }]}>
                                <FontAwesomeIcon icon={{ prefix: 'fas', iconName: 'plus' }} size={20} color="#FFFFFF" />
                            </View>
                            <Text style={[styles.addCompanionText, { color: colors.text }]}>Add New</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>

            {/* Chat Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            />

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={[styles.input, { color: colors.text, backgroundColor: colors.cardBackground }]}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={`Message ${selectedCompanion?.name || 'your companion'}...`}
                        placeholderTextColor={colors.tabIconDefault}
                        multiline
                        maxLength={500}
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: colors.tint }]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <FontAwesomeIcon icon={{ prefix: 'fas', iconName: 'paper-plane' }} size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Add Companion Modal */}
            <AddCompanionModal
                visible={showAddCompanion}
                onClose={() => setShowAddCompanion(false)}
                onAdd={addCustomCompanion}
                colors={colors}
            />
        </KeyboardAvoidingView>
    );
}

interface AddCompanionModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (companion: Omit<AICompanion, 'id'>) => void;
    colors: any;
}

function AddCompanionModal({ visible, onClose, onAdd, colors }: AddCompanionModalProps) {
    const [name, setName] = useState('');
    const [personality, setPersonality] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState('🤖');
    const [greeting, setGreeting] = useState('');
    const [selectedColor, setSelectedColor] = useState('#6366F1');

    const colorOptions = ['#6366F1', '#F59E0B', '#10B981', '#EC4899', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

    const handleSubmit = () => {
        if (!name.trim() || !personality.trim() || !description.trim() || !greeting.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        onAdd({
            name: name.trim(),
            personality: personality.trim(),
            description: description.trim(),
            avatar,
            color: selectedColor,
            greeting: greeting.trim(),
            traits: personality.split(',').map(t => t.trim()).filter(t => t)
        });

        // Reset form
        setName('');
        setPersonality('');
        setDescription('');
        setAvatar('🤖');
        setGreeting('');
        setSelectedColor('#6366F1');
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Create New AI Companion</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <FontAwesomeIcon icon={{ prefix: 'fas', iconName: 'times' }} size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
                        <TextInput
                            style={[styles.textInput, { color: colors.text, backgroundColor: colors.cardBackground }]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter companion name"
                            placeholderTextColor={colors.tabIconDefault}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Personality *</Text>
                        <TextInput
                            style={[styles.textInput, { color: colors.text, backgroundColor: colors.cardBackground }]}
                            value={personality}
                            onChangeText={setPersonality}
                            placeholder="e.g., Wise & Calming, Energetic & Motivational"
                            placeholderTextColor={colors.tabIconDefault}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea, { color: colors.text, backgroundColor: colors.cardBackground }]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe your companion's role and characteristics"
                            placeholderTextColor={colors.tabIconDefault}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Avatar</Text>
                        <View style={styles.avatarSelector}>
                            {['🤖', '🌟', '💫', '🎭', '🎨', '🧠', '💝', '🌈'].map((emoji) => (
                                <TouchableOpacity
                                    key={emoji}
                                    style={[
                                        styles.avatarOption,
                                        { backgroundColor: colors.cardBackground },
                                        avatar === emoji && { borderColor: selectedColor, borderWidth: 2 }
                                    ]}
                                    onPress={() => setAvatar(emoji)}
                                >
                                    <Text style={styles.avatarEmoji}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Color Theme</Text>
                        <View style={styles.colorSelector}>
                            {colorOptions.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColor
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Greeting Message *</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea, { color: colors.text, backgroundColor: colors.cardBackground }]}
                            value={greeting}
                            onChangeText={setGreeting}
                            placeholder="How will your companion greet users?"
                            placeholderTextColor={colors.tabIconDefault}
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                    <TouchableOpacity
                        style={[styles.cancelButton, { backgroundColor: colors.cardBackground }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: selectedColor }]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Create Companion</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    companionSelector: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    selectorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 8,
    },
    selectorHeaderLeft: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    selectorAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    selectorTitle: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.8,
    },
    selectorSubtitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    companionScroll: {
        paddingHorizontal: 16,
    },
    companionCard: {
        width: 200,
        marginRight: 10,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    companionCardAvatar: {
        width: 40,
        height: 40,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    companionAvatarText: {
        fontSize: 20,
    },
    companionInfo: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    companionName: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 2,
    },
    companionPersonality: {
        textAlign: 'center',
        alignItems: 'center',
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 4,
    },
    personalityPill: {
        paddingHorizontal: 8,
        borderRadius: 999,
        marginBottom: 6,
        marginHorizontal: 4,
    },
    personalityPillText: {
        fontSize: 10,
        fontWeight: '600',
    },
    personalityPillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 2,
    },
    companionDescription: {
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 14,
    },
    addCompanionCard: {
        width: 80,
        marginRight: 12,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    addCompanionIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    addCompanionText: {
        fontSize: 12,
        fontWeight: '500',
    },
    messagesList: {
        paddingVertical: 16,
        flexGrow: 1,
    },
    messageContainer: {
        marginVertical: 4,
        paddingHorizontal: 16,
    },
    userMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        maxWidth: '85%',
        alignSelf: 'flex-end',
    },
    aiMessageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        maxWidth: '85%',
        alignSelf: 'flex-start',
    },
    userMessageContent: {
        padding: 12,
        borderRadius: 16,
        borderBottomRightRadius: 4,
        marginRight: 8,
        maxWidth: '100%',
    },
    aiMessageContent: {
        padding: 12,
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        marginLeft: 8,
        maxWidth: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    companionAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    avatarText: {
        fontSize: 16,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 4,
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    userTimestamp: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
    },
    timestamp: {
        fontSize: 11,
        opacity: 0.7,
    },
    inputContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
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
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    textInput: {
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    avatarSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    avatarOption: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarEmoji: {
        fontSize: 20,
    },
    colorSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    colorOption: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#000',
        borderWidth: 3,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
