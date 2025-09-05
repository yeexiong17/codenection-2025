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

export interface ToolkitItem {
    id: string;
    title: string;
    description: string;
    type: 'breathing' | 'journal' | 'exercise' | 'meditation';
    duration: string;
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
        date: '2024-03-20T10:00:00',
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
        date: '2024-03-21T15:00:00',
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
        date: '2024-03-22T11:30:00',
        type: 'other',
        description: 'Regular checkup',
        calendarId: 'personal'
    },
    // Work Events
    {
        id: '7',
        title: 'Part-time Job Shift',
        date: '2024-03-23T09:00:00',
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

export const mockToolkitItems: ToolkitItem[] = [
    {
        id: '1',
        title: 'Deep Breathing',
        description: 'Simple breathing exercise to reduce stress and anxiety',
        type: 'breathing',
        duration: '5 min'
    },
    {
        id: '2',
        title: 'Gratitude Journal',
        description: 'Write down three things you\'re grateful for today',
        type: 'journal',
        duration: '10 min'
    },
    {
        id: '3',
        title: 'Desk Stretches',
        description: 'Quick stretches you can do at your desk',
        type: 'exercise',
        duration: '7 min'
    },
    {
        id: '4',
        title: 'Guided Meditation',
        description: 'Short meditation for focus and clarity',
        type: 'meditation',
        duration: '10 min'
    }
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
            response: "Getting good sleep is crucial for mental wellness. Have you tried the guided meditation in our toolkit? It can help you wind down."
        }
    ]
};
