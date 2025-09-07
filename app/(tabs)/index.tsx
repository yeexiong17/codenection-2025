import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { StressHeatmap } from '@/components/StressHeatmap';
import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { mockAIRecommendations, mockCalendarEvents, mockStressInsights, StressInsight } from '@/constants/MockData';
import { useColorScheme } from '@/hooks/useColorScheme';

function InsightsTab() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleInsightPress = (insightId: string) => {
    router.push(`/insight-detail?id=${insightId}`);
  };

  // Calculate insights statistics
  const insightsStats = {
    total: mockStressInsights.length,
    high: mockStressInsights.filter(i => i.severity === 'high').length,
    medium: mockStressInsights.filter(i => i.severity === 'medium').length,
    low: mockStressInsights.filter(i => i.severity === 'low').length,
  };

  const getInsightTrend = () => {
    // Mock trend calculation - in real app, this would compare with previous periods
    const recentHigh = mockStressInsights.filter(i => i.severity === 'high').length;
    if (recentHigh > 2) return { direction: 'up', text: 'Stress levels are trending higher' };
    if (recentHigh < 1) return { direction: 'down', text: 'Stress levels are improving' };
    return { direction: 'stable', text: 'Stress levels are stable' };
  };

  const trend = getInsightTrend();

  const getMoodPatterns = () => {
    // Mock mood pattern analysis
    return [
      { pattern: 'Morning Anxiety', frequency: '3 days this week', severity: 'medium' },
      { pattern: 'Evening Stress', frequency: '2 days this week', severity: 'low' },
      { pattern: 'Work Pressure', frequency: '4 days this week', severity: 'high' },
    ];
  };

  const moodPatterns = getMoodPatterns();

  const getWellnessTips = () => {
    return [
      {
        title: 'Deep Breathing',
        description: 'Practice 4-7-8 breathing technique',
        icon: '🫁',
        category: 'Relaxation'
      },
      {
        title: 'Mindful Walking',
        description: 'Take a 10-minute mindful walk',
        icon: '🚶',
        category: 'Movement'
      },
      {
        title: 'Gratitude Journal',
        description: 'Write down 3 things you\'re grateful for',
        icon: '📝',
        category: 'Reflection'
      },
      {
        title: 'Progressive Relaxation',
        description: 'Tense and release each muscle group',
        icon: '🧘',
        category: 'Relaxation'
      }
    ];
  };

  const wellnessTips = getWellnessTips();

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Stress Patterns - moved to top */}
      <View style={[styles.stressHeatmapCard, { backgroundColor: colors.background }]}>
        <StressHeatmap />
      </View>

      {/* Insights Overview */}
      <View style={[styles.insightsOverviewCard, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Insights Overview</Text>
        <View style={styles.insightsStatsGrid}>
          <View style={styles.insightStatItem}>
            <Text style={[styles.insightStatNumber, { color: colors.tint }]}>{insightsStats.total}</Text>
            <Text style={[styles.insightStatLabel, { color: colors.text }]}>Total Insights</Text>
          </View>
          <View style={styles.insightStatItem}>
            <Text style={[styles.insightStatNumber, { color: '#B5838D' }]}>{insightsStats.high}</Text>
            <Text style={[styles.insightStatLabel, { color: colors.text }]}>High Priority</Text>
          </View>
          <View style={styles.insightStatItem}>
            <Text style={[styles.insightStatNumber, { color: '#9F91CC' }]}>{insightsStats.medium}</Text>
            <Text style={[styles.insightStatLabel, { color: colors.text }]}>Medium</Text>
          </View>
          <View style={styles.insightStatItem}>
            <Text style={[styles.insightStatNumber, { color: '#7C9A92' }]}>{insightsStats.low}</Text>
            <Text style={[styles.insightStatLabel, { color: colors.text }]}>Low</Text>
          </View>
        </View>
      </View>

      {/* Trend Analysis */}
      <View style={[styles.trendCard, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Trend Analysis</Text>
        <View style={styles.trendContent}>
          <View style={styles.trendIcon}>
            <Text style={styles.trendEmoji}>
              {trend.direction === 'up' ? '📈' : trend.direction === 'down' ? '📉' : '➡️'}
            </Text>
          </View>
          <View style={styles.trendDetails}>
            <Text style={[styles.trendText, { color: colors.text }]}>{trend.text}</Text>
            <Text style={[styles.trendSubtext, { color: colors.text }]}>
              Based on your recent activity patterns
            </Text>
          </View>
        </View>
      </View>

      {/* Mood Patterns */}
      <View style={[styles.patternsCard, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Mood Patterns</Text>
        {moodPatterns.map((pattern, index) => (
          <View key={index} style={styles.patternItem}>
            <View style={styles.patternInfo}>
              <Text style={[styles.patternName, { color: colors.text }]}>{pattern.pattern}</Text>
              <Text style={[styles.patternFrequency, { color: colors.text }]}>{pattern.frequency}</Text>
            </View>
            <View style={[
              styles.patternSeverity,
              { backgroundColor: getInsightSeverityColor(pattern.severity as any) }
            ]}>
              <Text style={styles.patternSeverityText}>{pattern.severity.toUpperCase()}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Wellness Tips */}
      <View style={[styles.tipsCard, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Personalized Tips</Text>
        <View style={styles.tipsGrid}>
          {wellnessTips.map((tip, index) => (
            <TouchableOpacity key={index} style={styles.tipItem} activeOpacity={0.7}>
              <View style={[styles.tipIcon, { backgroundColor: colors.tint }]}>
                <Text style={styles.tipEmoji}>{tip.icon}</Text>
              </View>
              <Text style={[styles.tipTitle, { color: colors.text }]}>{tip.title}</Text>
              <Text style={[styles.tipDescription, { color: colors.text }]}>{tip.description}</Text>
              <View style={[styles.tipCategory, { backgroundColor: colors.tint + '20' }]}>
                <Text style={[styles.tipCategoryText, { color: colors.tint }]}>{tip.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Insights */}
      <View style={[styles.recentInsightsCard, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Insights</Text>
        {mockStressInsights.slice(0, 3).map((insight: StressInsight) => (
          <TouchableOpacity
            key={insight.id}
            style={[styles.insightCard, { backgroundColor: getInsightSeverityColor(insight.severity) }]}
            onPress={() => handleInsightPress(insight.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.insightMessage}>{insight.message}</Text>
            <Text style={styles.insightRecommendation}>{insight.recommendation}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: colors.tint }]}>View All Insights</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};


function SummaryTab() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation();

  const stats = {
    upcomingEvents: mockCalendarEvents.length,
    highStressCount: mockStressInsights.filter(i => i.severity === 'high').length,
    mediumStressCount: mockStressInsights.filter(i => i.severity === 'medium').length,
    lowStressCount: mockStressInsights.filter(i => i.severity === 'low').length,
    nextEvent: mockCalendarEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0],
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentStressLevel = () => {
    const total = stats.highStressCount + stats.mediumStressCount + stats.lowStressCount;
    if (total === 0) return 'Unknown';
    if (stats.highStressCount > stats.mediumStressCount && stats.highStressCount > stats.lowStressCount) return 'High';
    if (stats.mediumStressCount > stats.lowStressCount) return 'Medium';
    return 'Low';
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'High': return '#B5838D';
      case 'Medium': return '#9F91CC';
      case 'Low': return '#7C9A92';
      default: return colors.tabIconDefault;
    }
  };

  const getAIStressRecommendation = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const thisWeekEvents = mockCalendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });

    const todayEvents = mockCalendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === today.toDateString();
    });

    const eventCount = thisWeekEvents.length;
    const todayEventCount = todayEvents.length;

    if (eventCount >= 8) {
      return {
        title: "This week will be hectic!",
        subtitle: "AI recommends extra self-care",
        icon: "😰",
        recommendations: [
          "Take a 15-min break at 2:00 PM today",
          "Schedule meditation before your 3:30 PM meeting"
        ],
        urgency: "high"
      };
    } else if (eventCount >= 5) {
      return {
        title: "Moderate schedule ahead",
        subtitle: "AI suggests strategic breaks",
        icon: "😌",
        recommendations: [
          "Take a 10-min walk at 1:30 PM",
          "Block 30 minutes for lunch without meetings"
        ],
        urgency: "medium"
      };
    } else if (todayEventCount >= 3) {
      return {
        title: "Today looks busy",
        subtitle: "AI recommends mindful pacing",
        icon: "🧘",
        recommendations: [
          "Take 5 deep breaths before your 2:00 PM event",
          "Schedule a 10-min break at 3:00 PM"
        ],
        urgency: "medium"
      };
    } else {
      return {
        title: "Light schedule today",
        subtitle: "AI suggests wellness focus",
        icon: "😊",
        recommendations: [
          "Use free time for a 20-min meditation",
          "Plan something enjoyable for this evening"
        ],
        urgency: "low"
      };
    }
  };

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Card */}
      <View style={[styles.welcomeCard, { backgroundColor: colors.background }]}>
        <View style={styles.welcomeContent}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>{getCurrentGreeting()}</Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.text }]}>How are you feeling today?</Text>
        </View>
        <View style={[styles.welcomeIcon, { backgroundColor: colors.tint }]}>
          <Text style={styles.welcomeEmoji}>🌱</Text>
        </View>
      </View>

      {/* AI-Powered Stress Management Recommendation */}
      {(() => {
        const aiRecommendation = getAIStressRecommendation();
        const urgencyColor = aiRecommendation.urgency === 'high' ? '#FF6B6B' :
          aiRecommendation.urgency === 'medium' ? '#FFA726' : '#4CAF50';

        return (
          <View style={[styles.dailyStressReminderCard, { backgroundColor: colors.background }]}>
            <View style={styles.dailyStressReminderHeader}>
              <View style={[styles.dailyStressReminderIcon, { backgroundColor: urgencyColor }]}>
                <Text style={styles.dailyStressReminderEmoji}>{aiRecommendation.icon}</Text>
              </View>
              <View style={styles.dailyStressReminderTitleContainer}>
                <Text style={[styles.dailyStressReminderTitle, { color: colors.text }]}>
                  {aiRecommendation.title}
                </Text>
                <Text style={[styles.dailyStressReminderSubtitle, { color: colors.text }]}>
                  {aiRecommendation.subtitle}
                </Text>
              </View>
            </View>

            <View style={styles.dailyStressTipsContainer}>
              {aiRecommendation.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.dailyStressTipItem}>
                  <Text style={[styles.dailyStressTipNumber, { color: urgencyColor }]}>{index + 1}</Text>
                  <Text style={[styles.dailyStressTipText, { color: colors.text }]}>
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.dailyStressReminderButton, { backgroundColor: urgencyColor }]}
              onPress={() => {
                // Navigate to Smart Schedule tab
                navigation.navigate('Smart Schedule' as never);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.dailyStressReminderButtonText}>
                {aiRecommendation.urgency === 'high' ? 'Start Emergency Calm Session' :
                  aiRecommendation.urgency === 'medium' ? 'Begin Stress Relief' : 'Continue Wellness Journey'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })()}

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.tint }]}>
            <Text style={styles.statIconText}>📅</Text>
          </View>
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.upcomingEvents}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Upcoming Events</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <View style={[styles.statIcon, { backgroundColor: getStressColor(getCurrentStressLevel()) }]}>
            <Text style={styles.statIconText}>💭</Text>
          </View>
          <Text style={[styles.statNumber, { color: getStressColor(getCurrentStressLevel()) }]}>
            {getCurrentStressLevel()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Current Stress</Text>
        </View>
      </View>

      {/* Next Event Card */}
      <View style={[styles.eventCard, { backgroundColor: colors.background }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Next Event</Text>
        <View style={styles.eventContent}>
          <View style={[styles.eventIcon, { backgroundColor: colors.tint }]}>
            <Text style={styles.eventIconText}>📅</Text>
          </View>
          <View style={styles.eventDetails}>
            <Text style={[styles.eventTitle, { color: colors.text }]}>{stats.nextEvent.title}</Text>
            <Text style={[styles.eventTime, { color: colors.text }]}>
              {format(new Date(stats.nextEvent.date), 'MMM d, h:mm a')}
            </Text>
          </View>
        </View>
      </View>


    </ScrollView>
  );
};


function AIRecommendationsTab() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      wellness: '#4CAF50',
      productivity: '#2196F3',
      mindfulness: '#9C27B0',
      social: '#FF9800',
      health: '#F44336',
    };
    return colors[category] || colors.wellness;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: '#FF6B6B',
      medium: '#FFA726',
      low: '#4CAF50',
    };
    return colors[priority] || colors.medium;
  };

  const toggleCompletion = (id: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getIntelligentSchedule = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Get today's calendar events
    const todayEvents = mockCalendarEvents.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === todayString;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Create a combined schedule with wellness activities and calendar events
    const combinedSchedule = [];

    // Add morning wellness routine (7:00 - 9:00)
    const morningWellness = mockAIRecommendations.filter(rec => {
      const [hour] = rec.time.split(':').map(Number);
      return hour >= 7 && hour < 9;
    });
    combinedSchedule.push(...morningWellness);

    // Process calendar events and insert wellness breaks
    todayEvents.forEach((event, index) => {
      const eventTime = new Date(event.date);
      const eventHour = eventTime.getHours();
      const eventMinute = eventTime.getMinutes();

      // Add calendar event
      combinedSchedule.push({
        id: `calendar-${event.id}`,
        time: `${eventHour.toString().padStart(2, '0')}:${eventMinute.toString().padStart(2, '0')}`,
        title: event.title,
        description: event.description || `Scheduled ${event.type} event`,
        category: 'calendar' as any,
        priority: 'high' as any,
        duration: '60 min',
        icon: event.type === 'exam' ? '📝' : event.type === 'class' ? '🎓' : event.type === 'bill' ? '💰' : '📅',
        isCalendarEvent: true,
        eventType: event.type
      });

      // Insert wellness break if there's a gap before next event
      if (index < todayEvents.length - 1) {
        const nextEvent = todayEvents[index + 1];
        const nextEventTime = new Date(nextEvent.date);
        const timeDiff = nextEventTime.getTime() - eventTime.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        // If there's more than 1.5 hours between events, suggest a wellness break
        if (hoursDiff > 1.5) {
          const breakTime = new Date(eventTime.getTime() + (60 * 60 * 1000)); // 1 hour after current event
          const breakHour = breakTime.getHours();
          const breakMinute = breakTime.getMinutes();

          // Choose appropriate wellness activity based on event type
          let wellnessActivity;
          if (event.type === 'exam') {
            wellnessActivity = {
              id: `wellness-break-${event.id}`,
              time: `${breakHour.toString().padStart(2, '0')}:${breakMinute.toString().padStart(2, '0')}`,
              title: 'Post-Exam Recovery',
              description: 'Take a mindful break to decompress after your exam',
              category: 'wellness' as any,
              priority: 'high' as any,
              duration: '15 min',
              icon: '🧘‍♀️',
              isWellnessBreak: true
            };
          } else if (event.type === 'class') {
            wellnessActivity = {
              id: `wellness-break-${event.id}`,
              time: `${breakHour.toString().padStart(2, '0')}:${breakMinute.toString().padStart(2, '0')}`,
              title: 'Movement Break',
              description: 'Stretch and move your body after sitting in class',
              category: 'wellness' as any,
              priority: 'medium' as any,
              duration: '10 min',
              icon: '🤸‍♀️',
              isWellnessBreak: true
            };
          } else {
            wellnessActivity = {
              id: `wellness-break-${event.id}`,
              time: `${breakHour.toString().padStart(2, '0')}:${breakMinute.toString().padStart(2, '0')}`,
              title: 'Mindful Break',
              description: 'Take a moment to center yourself and recharge',
              category: 'mindfulness' as any,
              priority: 'medium' as any,
              duration: '10 min',
              icon: '🌱',
              isWellnessBreak: true
            };
          }

          combinedSchedule.push(wellnessActivity);
        }
      }
    });

    // Add evening wellness routine (18:00 - 22:00)
    const eveningWellness = mockAIRecommendations.filter(rec => {
      const [hour] = rec.time.split(':').map(Number);
      return hour >= 18 && hour <= 22;
    });
    combinedSchedule.push(...eveningWellness);

    // Sort by time
    return combinedSchedule.sort((a, b) => {
      const [hourA, minuteA] = a.time.split(':').map(Number);
      const [hourB, minuteB] = b.time.split(':').map(Number);
      return (hourA * 60 + minuteA) - (hourB * 60 + minuteB);
    });
  };

  const intelligentSchedule = getIntelligentSchedule();

  const getCurrentTimeRecommendation = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    return intelligentSchedule.find(rec => {
      const [hour, minute] = rec.time.split(':').map(Number);
      const recTime = hour * 60 + minute;
      return Math.abs(recTime - currentTime) <= 30; // Within 30 minutes
    });
  };

  const currentRecommendation = getCurrentTimeRecommendation();

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Compact Progress Summary */}
      <View style={[styles.progressCard, { backgroundColor: colors.background }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: colors.text }]}>Today's Progress</Text>
          <Text style={[styles.progressPercentage, { color: colors.tint }]}>
            {Math.round((completedItems.size / intelligentSchedule.filter(item => !item.isCalendarEvent).length) * 100)}%
          </Text>
        </View>

        <View style={[styles.progressBarContainer, { backgroundColor: colors.cardBackground }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${(completedItems.size / intelligentSchedule.filter(item => !item.isCalendarEvent).length) * 100}%`,
                backgroundColor: colors.tint
              }
            ]}
          />
        </View>

        <Text style={[styles.progressDetailText, { color: colors.text }]}>
          {completedItems.size} of {intelligentSchedule.filter(item => !item.isCalendarEvent).length} wellness activities completed
        </Text>
      </View>



      {/* Timeline */}
      <View style={[styles.timelineCard, { backgroundColor: colors.background }]}>
        <View style={styles.timelineHeader}>
          <Text style={[styles.timelineTitle, { color: colors.text }]}>
            AI-Powered Daily Schedule
          </Text>
        </View>

        <View style={[styles.timelineNote, { backgroundColor: colors.tint + '15' }]}>
          <Text style={[styles.timelineNoteText, { color: colors.tint }]}>
            💡 Tap on wellness activities to mark them as complete
          </Text>
        </View>

        <View style={styles.timelineContainer}>
          {intelligentSchedule.map((recommendation, index) => {
            const isCompleted = completedItems.has(recommendation.id);
            const isLast = index === intelligentSchedule.length - 1;
            const isCalendarEvent = recommendation.isCalendarEvent;
            const isWellnessBreak = recommendation.isWellnessBreak;

            return (
              <View key={recommendation.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    {
                      backgroundColor: isCompleted ? '#4CAF50' :
                        isCalendarEvent ? '#FF6B6B' :
                          isWellnessBreak ? '#FFA726' :
                            getCategoryColor(recommendation.category)
                    }
                  ]}>
                    <Text style={styles.timelineDotIcon}>{recommendation.icon}</Text>
                  </View>
                  {!isLast && (
                    <View style={[styles.timelineLine, { backgroundColor: colors.tabIconDefault }]} />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <TouchableOpacity
                    style={[
                      styles.recommendationCard,
                      {
                        backgroundColor: isCompleted ? '#E8F5E8' :
                          isCalendarEvent ? '#FFF5F5' :
                            isWellnessBreak ? '#FFF8E1' :
                              colors.cardBackground
                      },
                      isCompleted && { opacity: 0.7 },
                      isCalendarEvent && { borderLeftWidth: 3, borderLeftColor: '#FF6B6B' },
                      isWellnessBreak && { borderLeftWidth: 3, borderLeftColor: '#FFA726' }
                    ]}
                    onPress={() => !isCalendarEvent && toggleCompletion(recommendation.id)}
                    activeOpacity={isCalendarEvent ? 1 : 0.7}
                    disabled={isCalendarEvent}
                  >
                    <View style={styles.recommendationHeader}>
                      <View style={styles.recommendationTimeContainer}>
                        <Text style={[styles.recommendationTime, { color: colors.text }]}>
                          {recommendation.time}
                        </Text>
                        <View style={[
                          styles.priorityIndicator,
                          { backgroundColor: getPriorityColor(recommendation.priority) }
                        ]} />
                      </View>
                      <View style={[
                        styles.categoryBadge,
                        {
                          backgroundColor: isCalendarEvent ? '#FF6B6B20' :
                            isWellnessBreak ? '#FFA72620' :
                              getCategoryColor(recommendation.category) + '20'
                        }
                      ]}>
                        <Text style={[
                          styles.categoryBadgeText,
                          {
                            color: isCalendarEvent ? '#FF6B6B' :
                              isWellnessBreak ? '#FFA726' :
                                getCategoryColor(recommendation.category)
                          }
                        ]}>
                          {isCalendarEvent ? 'CALENDAR' :
                            isWellnessBreak ? 'AI BREAK' :
                              recommendation.category.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text style={[
                      styles.recommendationTitle,
                      { color: colors.text },
                      isCompleted && { textDecorationLine: 'line-through' }
                    ]}>
                      {recommendation.title}
                    </Text>

                    <Text style={[styles.recommendationDescription, { color: colors.text }]}>
                      {recommendation.description}
                    </Text>

                    <View style={styles.recommendationFooter}>
                      <Text style={[styles.recommendationDuration, { color: colors.text }]}>
                        ⏱️ {recommendation.duration}
                      </Text>
                      {isCalendarEvent ? (
                        <Text style={[styles.completedText, { color: '#FF6B6B' }]}>📅 Scheduled</Text>
                      ) : isCompleted ? (
                        <Text style={styles.completedText}>✓ Completed</Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

function CalendarTab() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getCurrentMonthShort = () => {
    return new Date().toLocaleDateString('en-US', { month: 'short' });
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getTodayInfo = () => {
    const today = new Date();
    return {
      day: today.getDate(),
      dayName: today.toLocaleDateString('en-US', { weekday: 'long' }),
      month: today.toLocaleDateString('en-US', { month: 'long' }),
      year: today.getFullYear()
    };
  };

  const getDaysInMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getDayEvents = (day: number) => {
    if (!day) return [];
    return mockCalendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day;
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      exam: '#B5838D',
      class: '#7C9A92',
      bill: '#C6AC8F',
      other: '#8E9CAA'
    };
    return colors[type] || '#8E9CAA';
  };

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    setShowDayModal(true);
  };

  const getSelectedDayEvents = () => {
    if (!selectedDay) return [];
    return getDayEvents(selectedDay);
  };

  const getSelectedDayDate = () => {
    if (!selectedDay) return '';
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return new Date(year, month, selectedDay);
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const todayInfo = getTodayInfo();

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Today's Highlight Card */}
      <View style={[styles.todayCard, { backgroundColor: colors.background }]}>
        <View style={styles.todayContent}>
          <View style={styles.todayDate}>
            <Text style={[styles.todayDayNumber, { color: colors.tint }]}>{todayInfo.day}</Text>
            <View style={styles.todayMonthYear}>
              <Text style={[styles.todayMonth, { color: colors.text }]}>{getCurrentMonthShort()}</Text>
              <Text style={[styles.todayYear, { color: colors.text }]}>{todayInfo.year}</Text>
            </View>
          </View>
          <View style={styles.todayInfo}>
            <Text style={[styles.todayDayName, { color: colors.text }]}>{todayInfo.dayName}</Text>
            <Text style={[styles.todaySubtext, { color: colors.text }]}>Today</Text>
          </View>
        </View>
        <View style={[styles.todayIcon, { backgroundColor: colors.tint }]}>
          <Text style={styles.todayEmoji}>📅</Text>
        </View>
      </View>


      {/* Calendar Grid */}
      <View style={[styles.calendarCard, { backgroundColor: colors.background }]}>
        {/* Week day headers */}
        <View style={styles.weekDaysRow}>
          {weekDays.map((day) => (
            <Text key={day} style={[styles.weekDay, { color: colors.text }]}>{day}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => {
            const dayEvents = day ? getDayEvents(day) : [];
            const isToday = day === new Date().getDate();
            const isWeekend = index % 7 === 0 || index % 7 === 6; // Sunday or Saturday

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  day ? styles.clickableDay : null,
                  isToday ? styles.todayDay : null,
                  isWeekend && day ? styles.weekendDay : null
                ]}
                onPress={() => day && handleDayPress(day)}
                disabled={!day}
                activeOpacity={day ? 0.7 : 1}
              >
                {day && (
                  <>
                    <Text style={[
                      styles.dayNumber,
                      { color: colors.text },
                      isToday && { color: '#fc212f', fontWeight: '800', fontSize: 18 },
                      isWeekend && !isToday && { opacity: 0.7 }
                    ]}>
                      {day}
                    </Text>
                    {dayEvents.length > 0 && (
                      <View style={styles.dayEvents}>
                        {dayEvents.slice(0, 3).map((event, eventIndex) => (
                          <View
                            key={eventIndex}
                            style={[
                              styles.eventDot,
                              { backgroundColor: getEventTypeColor(event.type) }
                            ]}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <Text style={[styles.moreEvents, { color: colors.text }]}>
                            +{dayEvents.length - 3}
                          </Text>
                        )}
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={[styles.quickStatsCard, { backgroundColor: colors.background }]}>
        <Text style={[styles.quickStatsTitle, { color: colors.text }]}>This Week</Text>
        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatItem}>
            <View style={[styles.quickStatIcon, { backgroundColor: colors.tint }]}>
              <Text style={styles.quickStatEmoji}>📅</Text>
            </View>
            <Text style={[styles.quickStatNumber, { color: colors.text }]}>
              {mockCalendarEvents.filter(event => {
                const eventDate = new Date(event.date);
                const today = new Date();
                const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return eventDate >= weekStart && eventDate <= weekEnd;
              }).length}
            </Text>
            <Text style={[styles.quickStatLabel, { color: colors.text }]}>Events</Text>
          </View>
          <View style={styles.quickStatItem}>
            <View style={[styles.quickStatIcon, { backgroundColor: '#7C9A92' }]}>
              <Text style={styles.quickStatEmoji}>🎯</Text>
            </View>
            <Text style={[styles.quickStatNumber, { color: colors.text }]}>3</Text>
            <Text style={[styles.quickStatLabel, { color: colors.text }]}>Goals</Text>
          </View>
          <View style={styles.quickStatItem}>
            <View style={[styles.quickStatIcon, { backgroundColor: '#9F91CC' }]}>
              <Text style={styles.quickStatEmoji}>⏰</Text>
            </View>
            <Text style={[styles.quickStatNumber, { color: colors.text }]}>2h</Text>
            <Text style={[styles.quickStatLabel, { color: colors.text }]}>Free Time</Text>
          </View>
        </View>
      </View>

      {/* Upcoming Events List */}
      <View style={[styles.upcomingEventsCard, { backgroundColor: colors.background }]}>
        <View style={styles.upcomingEventsHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Upcoming Events</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={[styles.viewAllText, { color: colors.tint }]}>View All</Text>
          </TouchableOpacity>
        </View>
        {mockCalendarEvents
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 4)
          .map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventListItem} activeOpacity={0.7}>
              <View style={[styles.eventListIcon, { backgroundColor: getEventTypeColor(event.type) }]}>
                <Text style={styles.eventListIconText}>📅</Text>
              </View>
              <View style={styles.eventListDetails}>
                <Text style={[styles.eventListTitle, { color: colors.text }]}>{event.title}</Text>
                <Text style={[styles.eventListTime, { color: colors.text }]}>
                  {format(new Date(event.date), 'MMM d, h:mm a')}
                </Text>
                <View style={[styles.eventListType, { backgroundColor: getEventTypeColor(event.type) + '20' }]}>
                  <Text style={[styles.eventListTypeText, { color: getEventTypeColor(event.type) }]}>
                    {event.type.toUpperCase()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </View>

      {/* Day Details Modal */}
      <Modal
        visible={showDayModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.dayModal, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedDay && format(getSelectedDayDate(), 'EEEE, MMMM d, yyyy')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDayModal(false)}
              >
                <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {getSelectedDayEvents().length > 0 ? (
                getSelectedDayEvents().map((event) => (
                  <View key={event.id} style={styles.modalEventItem}>
                    <View style={[styles.modalEventIcon, { backgroundColor: getEventTypeColor(event.type) }]}>
                      <Text style={styles.modalEventIconText}>📅</Text>
                    </View>
                    <View style={styles.modalEventDetails}>
                      <Text style={[styles.modalEventTitle, { color: colors.text }]}>{event.title}</Text>
                      <Text style={[styles.modalEventTime, { color: colors.text }]}>
                        {format(new Date(event.date), 'h:mm a')}
                      </Text>
                      <Text style={[styles.modalEventDescription, { color: colors.text }]}>
                        {event.description}
                      </Text>
                      <View style={styles.modalEventFooter}>
                        <View style={[styles.modalEventType, { backgroundColor: getEventTypeColor(event.type) }]}>
                          <Text style={styles.modalEventTypeText}>{event.type.toUpperCase()}</Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.aiSuggestionButton, { backgroundColor: colors.tint }]}
                          onPress={() => {
                            setShowDayModal(false);
                            // Navigate to Voice AI with event context
                            router.push({
                              pathname: '/ai-chat',
                              params: {
                                eventContext: JSON.stringify({
                                  title: event.title,
                                  type: event.type,
                                  time: format(new Date(event.date), 'h:mm a'),
                                  date: format(new Date(event.date), 'MMM d, yyyy')
                                })
                              }
                            });
                          }}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.aiSuggestionButtonText}>🎤 Get AI Prep</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noEventsContainer}>
                  <Text style={[styles.noEventsText, { color: colors.text }]}>
                    No events scheduled for this day
                  </Text>
                  <Text style={[styles.noEventsSubtext, { color: colors.text }]}>
                    Tap the + button to add an event
                  </Text>
                </View>
              )}

            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <PageHeader title="MindEase Dashboard" />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: [styles.tabBar, { backgroundColor: colors.background }],
          tabBarIndicatorStyle: { backgroundColor: colors.tint },
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.tabIconDefault,
          tabBarLabelStyle: styles.tabLabel,
        }}>
        <Tab.Screen name="Overview" component={SummaryTab} />
        <Tab.Screen name="AI Insights" component={InsightsTab} />
        <Tab.Screen name="Smart Schedule" component={AIRecommendationsTab} />
        <Tab.Screen name="Calendar" component={CalendarTab} />
      </Tab.Navigator>
    </View>
  );
}


const getInsightSeverityColor = (severity: StressInsight['severity']) => {
  const colors: Record<StressInsight['severity'], string> = {
    low: '#7C9A92',    // Sage green - calming
    medium: '#9F91CC', // Soft lavender - gentle alert
    high: '#B5838D'    // Muted rose - caring urgency
  };
  return colors[severity];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  chartCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'none',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  insightRecommendation: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 12,
  },
  nextEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  nextEventTime: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },

  // Welcome Card
  welcomeCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    fontWeight: '500',
  },
  welcomeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeEmoji: {
    fontSize: 28,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconText: {
    fontSize: 18,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Event Card
  eventCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventIconText: {
    fontSize: 24,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 22,
  },
  eventTime: {
    fontSize: 15,
    opacity: 0.7,
    fontWeight: '500',
  },

  // Insights Card
  insightsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  insightItem: {
    alignItems: 'center',
    flex: 1,
  },
  insightDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  insightCount: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  insightLabel: {
    fontSize: 13,
    opacity: 0.7,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Enhanced Calendar Styles
  todayCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
  },
  todayContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  todayDayNumber: {
    fontSize: 32,
    fontWeight: '800',
    marginRight: 12,
    minWidth: 30,
  },
  todayMonthYear: {
    alignItems: 'flex-start',
    minWidth: 60,
  },
  todayMonth: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  todayYear: {
    fontSize: 14,
    opacity: 0.8,
  },
  todayInfo: {
    flex: 1,
    marginLeft: 8,
  },
  todayDayName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  todaySubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  todayIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayEmoji: {
    fontSize: 28,
  },
  calendarCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    marginBottom: 4,
  },
  clickableDay: {
    borderRadius: 6,
  },
  todayDay: {
    backgroundColor: '#B5838D',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0.5,
    borderWidth: 2,
    borderColor: '#fc212f',
  },
  weekendDay: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayEvents: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
    marginVertical: 1,
  },
  moreEvents: {
    fontSize: 8,
    fontWeight: '600',
    marginLeft: 2,
  },
  quickStatsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  quickStatsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickStatEmoji: {
    fontSize: 20,
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    fontWeight: '500',
  },
  upcomingEventsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  upcomingEventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  eventListIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventListIconText: {
    fontSize: 20,
  },
  eventListDetails: {
    flex: 1,
  },
  eventListTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventListTime: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  eventListType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventListTypeText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dayModal: {
    width: '100%',
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
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
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    maxHeight: 400,
    padding: 20,
  },
  modalEventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalEventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalEventIconText: {
    fontSize: 20,
  },
  modalEventDetails: {
    flex: 1,
  },
  modalEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalEventTime: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  modalEventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  modalEventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  modalEventType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalEventTypeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  aiSuggestionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSuggestionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noEventsText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  noEventsSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },

  // Enhanced Insights Styles
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  insightsOverviewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  insightsStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  insightStatNumber: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  insightStatLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    fontWeight: '500',
  },
  trendCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  trendContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  trendEmoji: {
    fontSize: 28,
  },
  trendDetails: {
    flex: 1,
  },
  trendText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trendSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  patternsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  patternItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  patternInfo: {
    flex: 1,
  },
  patternName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  patternFrequency: {
    fontSize: 14,
    opacity: 0.7,
  },
  patternSeverity: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  patternSeverityText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tipsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tipItem: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  tipDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
  },
  tipCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tipCategoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  recentInsightsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
  },
  stressHeatmapCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },


  // Daily Stress Management Reminder Styles (Summary Tab)
  dailyStressReminderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyStressReminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyStressReminderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dailyStressReminderEmoji: {
    fontSize: 18,
  },
  dailyStressReminderTitleContainer: {
    flex: 1,
  },
  dailyStressReminderTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  dailyStressReminderSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  dailyStressTipsContainer: {
    marginBottom: 14,
  },
  dailyStressTipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dailyStressTipNumber: {
    fontSize: 12,
    fontWeight: '700',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    lineHeight: 18,
    marginRight: 8,
    marginTop: 1,
  },
  dailyStressTipText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
    opacity: 0.9,
  },
  dailyStressReminderButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dailyStressReminderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },



  // Compact Timeline Styles
  timelineCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
    flex: 1,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconText: {
    fontSize: 16,
  },
  timelineNote: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  timelineNoteText: {
    fontSize: 11,
    fontWeight: '500',
  },
  timelineContainer: {
    paddingLeft: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
    width: 32,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  timelineDotIcon: {
    fontSize: 14,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
  },
  recommendationCard: {
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recommendationTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationTime: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
  priorityIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '600',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
    marginBottom: 8,
  },
  recommendationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendationDuration: {
    fontSize: 11,
    opacity: 0.7,
  },
  completedText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },

  // Compact Progress Summary Styles
  progressCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressDetailText: {
    fontSize: 13,
    opacity: 0.7,
    fontWeight: '500',
    textAlign: 'center',
  },

});