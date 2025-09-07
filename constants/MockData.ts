export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: 'exam' | 'class' | 'bill' | 'other';
    description?: string;
    calendarId: string;
}

export interface StressInsight {
    id: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
}


export interface AIRecommendation {
    id: string;
    time: string;
    title: string;
    description: string;
    category: 'wellness' | 'productivity' | 'mindfulness' | 'social' | 'health' | 'calendar';
    priority: 'high' | 'medium' | 'low';
    duration: string;
    icon: string;
    completed?: boolean;
    isCalendarEvent?: boolean;
    isWellnessBreak?: boolean;
    eventType?: string;
}

export interface CalendarSource {
    id: string;
    name: string;
    color: string;
    enabled: boolean;
}

export const mockCalendarSources: CalendarSource[] = [
    {
        id: 'university',
        name: 'University Calendar',
        color: '#7C9A92', // Sage green
        enabled: true,
    },
    {
        id: 'personal',
        name: 'Personal Calendar',
        color: '#9F91CC', // Soft lavender
        enabled: true,
    },
    {
        id: 'work',
        name: 'Work Calendar',
        color: '#C6AC8F', // Warm sand
        enabled: false,
    },
];

export const mockCalendarEvents: CalendarEvent[] = [
    // University Events
    {
        id: '1',
        title: 'Final Exam - Computer Science',
        date: '2024-09-07T10:00:00',
        type: 'exam',
        description: 'CS401 Final Examination',
        calendarId: 'university'
    },
    {
        id: '2',
        title: 'Psychology Class',
        date: '2024-03-19T14:30:00',
        type: 'class',
        description: 'PSY201 - Chapter 7 Discussion',
        calendarId: 'university'
    },
    {
        id: '3',
        title: 'Study Group - Database Systems',
        date: '2024-09-07T15:00:00',
        type: 'class',
        description: 'Group project meeting in Library Room 204',
        calendarId: 'university'
    },
    // Personal Events
    {
        id: '4',
        title: 'Rent Payment Due',
        date: '2024-03-25T00:00:00',
        type: 'bill',
        description: 'Monthly rent payment',
        calendarId: 'personal'
    },
    {
        id: '5',
        title: 'Yoga Class',
        date: '2024-03-19T08:00:00',
        type: 'other',
        description: 'Morning yoga session at Wellness Center',
        calendarId: 'personal'
    },
    {
        id: '6',
        title: 'Dentist Appointment',
        date: '2024-09-07T11:30:00',
        type: 'other',
        description: 'Regular checkup',
        calendarId: 'personal'
    },
    // Work Events
    {
        id: '7',
        title: 'Part-time Job Shift',
        date: '2024-09-07T09:00:00',
        type: 'other',
        description: 'Shift at the campus bookstore',
        calendarId: 'work'
    },
    {
        id: '8',
        title: 'Team Meeting',
        date: '2024-03-21T13:00:00',
        type: 'other',
        description: 'Weekly sync with the bookstore team',
        calendarId: 'work'
    }
];

export const mockStressInsights: StressInsight[] = [
    {
        id: '1',
        message: 'High stress levels detected',
        severity: 'high',
        recommendation: 'You have 2 exams tomorrow. Consider taking a 15-minute break and try some breathing exercises.'
    },
    {
        id: '2',
        message: 'Upcoming bill reminder',
        severity: 'medium',
        recommendation: 'Rent is due in 5 days. Plan your budget to avoid last-minute stress.'
    }
];


export const mockAIRecommendations: AIRecommendation[] = [
    {
        id: '1',
        time: '07:00',
        title: 'Morning Meditation',
        description: 'Start your day with 10 minutes of mindfulness meditation to set a positive tone',
        category: 'mindfulness',
        priority: 'high',
        duration: '10 min',
        icon: '🧘‍♀️',
    },
    {
        id: '2',
        time: '07:30',
        title: 'Hydration Check',
        description: 'Drink a glass of water to rehydrate after sleep and boost your metabolism',
        category: 'health',
        priority: 'medium',
        duration: '2 min',
        icon: '💧',
    },
    {
        id: '3',
        time: '08:00',
        title: 'Healthy Breakfast',
        description: 'Prepare a nutritious breakfast with protein and fiber to fuel your day',
        category: 'health',
        priority: 'high',
        duration: '15 min',
        icon: '🥗',
    },
    {
        id: '4',
        time: '09:00',
        title: 'Work Planning',
        description: 'Review your schedule and prioritize tasks for maximum productivity',
        category: 'productivity',
        priority: 'high',
        duration: '10 min',
        icon: '📋',
    },
    {
        id: '5',
        time: '10:30',
        title: 'Movement Break',
        description: 'Take a 5-minute stretch break to prevent stiffness and improve focus',
        category: 'wellness',
        priority: 'medium',
        duration: '5 min',
        icon: '🤸‍♀️',
    },
    {
        id: '6',
        time: '12:00',
        title: 'Mindful Lunch',
        description: 'Eat lunch away from your desk and practice mindful eating',
        category: 'mindfulness',
        priority: 'medium',
        duration: '30 min',
        icon: '🍽️',
    },
    {
        id: '7',
        time: '14:00',
        title: 'Deep Breathing',
        description: 'Practice 4-7-8 breathing technique to reduce afternoon stress',
        category: 'wellness',
        priority: 'high',
        duration: '5 min',
        icon: '🫁',
    },
    {
        id: '8',
        time: '15:30',
        title: 'Social Connection',
        description: 'Reach out to a friend or family member for a quick check-in',
        category: 'social',
        priority: 'low',
        duration: '10 min',
        icon: '💬',
    },
    {
        id: '9',
        time: '17:00',
        title: 'Work Wrap-up',
        description: 'Review your accomplishments and plan for tomorrow',
        category: 'productivity',
        priority: 'medium',
        duration: '10 min',
        icon: '✅',
    },
    {
        id: '10',
        time: '18:30',
        title: 'Evening Walk',
        description: 'Take a 20-minute walk to unwind and get some fresh air',
        category: 'wellness',
        priority: 'medium',
        duration: '20 min',
        icon: '🚶‍♀️',
    },
    {
        id: '11',
        time: '19:30',
        title: 'Gratitude Practice',
        description: 'Write down three things you\'re grateful for today',
        category: 'mindfulness',
        priority: 'high',
        duration: '5 min',
        icon: '📝',
    },
    {
        id: '12',
        time: '21:00',
        title: 'Digital Detox',
        description: 'Put away devices and engage in a relaxing activity',
        category: 'wellness',
        priority: 'medium',
        duration: '30 min',
        icon: '📱',
    },
    {
        id: '13',
        time: '22:00',
        title: 'Bedtime Routine',
        description: 'Start your wind-down routine with calming activities',
        category: 'wellness',
        priority: 'high',
        duration: '30 min',
        icon: '🌙',
    },
];

export const mockAIResponses = {
    greeting: "Hi! I'm your MindEase AI assistant. How can I help you manage your stress today?",
    responses: [
        {
            trigger: ['stress', 'anxious', 'worried'],
            response: "I understand you're feeling stressed. Let's break this down together. What's the main thing on your mind right now?"
        },
        {
            trigger: ['exam', 'test', 'study'],
            response: "I see you have some upcoming exams. Remember to take regular breaks - studies show they improve retention. Would you like to try a quick breathing exercise?"
        },
        {
            trigger: ['sleep', 'tired', 'rest'],
            response: "Getting good sleep is crucial for mental wellness. Have you tried the guided meditation in our AI Plan? It can help you wind down."
        }
    ]
};
