import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { resetAllData } from '@/utils/storage';
import ThemedText from '@/components/common/ThemedText';
import Card from '@/components/common/Card';
import { ChevronRight, CircleHelp as HelpCircle, Moon, Sun, Trash } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

function SettingsScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  
  const handleResetData = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
        resetAllData();
        alert('All data has been reset.');
      }
    } else {
      Alert.alert(
        'Reset Data',
        'Are you sure you want to reset all data? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Reset', 
            style: 'destructive',
            onPress: async () => {
              await resetAllData();
              Alert.alert('Success', 'All data has been reset.');
            }
          }
        ]
      );
    }
  };
  
  const toggleDarkMode = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  const toggleSystemTheme = () => {
    setTheme(theme === 'system' ? (isDark ? 'dark' : 'light') : 'system');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          entering={FadeInDown.delay(100).duration(300)}
          style={styles.headerContainer}
        >
          <ThemedText variant="title" weight="bold">
            Settings
          </ThemedText>
          <ThemedText variant="body" color={colors.subtext}>
            Manage your app preferences
          </ThemedText>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(150).duration(300)}>
          <ThemedText variant="subtitle" weight="semibold" style={styles.sectionTitle}>
            Appearance
          </ThemedText>
          
          <Card>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={toggleDarkMode}
            >
              <View style={styles.settingLeft}>
                {isDark ? (
                  <Moon size={22} color={colors.text} />
                ) : (
                  <Sun size={22} color={colors.text} />
                )}
                <ThemedText style={styles.settingText}>
                  Dark Mode
                </ThemedText>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#767577', true: colors.primary + '70' }}
                thumbColor={isDark ? colors.primary : '#f4f3f4'}
              />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={toggleSystemTheme}
            >
              <View style={styles.settingLeft}>
                <ThemedText style={styles.settingText}>
                  Use System Settings
                </ThemedText>
              </View>
              <Switch
                value={theme === 'system'}
                onValueChange={toggleSystemTheme}
                trackColor={{ false: '#767577', true: colors.primary + '70' }}
                thumbColor={theme === 'system' ? colors.primary : '#f4f3f4'}
              />
            </TouchableOpacity>
          </Card>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <ThemedText variant="subtitle" weight="semibold" style={styles.sectionTitle}>
            Data Management
          </ThemedText>
          
          <Card>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleResetData}
            >
              <View style={styles.settingLeft}>
                <Trash size={22} color={colors.error} />
                <ThemedText style={styles.settingText} color={colors.error}>
                  Reset All Data
                </ThemedText>
              </View>
              <ChevronRight size={20} color={colors.subtext} />
            </TouchableOpacity>
          </Card>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(250).duration(300)}>
          <ThemedText variant="subtitle" weight="semibold" style={styles.sectionTitle}>
            About
          </ThemedText>
          
          <Card>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <HelpCircle size={22} color={colors.text} />
                <ThemedText style={styles.settingText}>
                  App Version
                </ThemedText>
              </View>
              <ThemedText color={colors.subtext}>1.0.0</ThemedText>
            </TouchableOpacity>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    width: '100%',
  },
});

export default SettingsScreen;