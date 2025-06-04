import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Period } from '@/types/transaction';
import ThemedText from '@/components/common/ThemedText';
import { Calendar, ChevronDown } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface DateRangeSelectorProps {
  periods: Period[];
  selectedPeriod: Period;
  onSelectPeriod: (period: Period) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  periods,
  selectedPeriod,
  onSelectPeriod
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handlePeriodSelect = (period: Period) => {
    onSelectPeriod(period);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selector,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border 
          }
        ]}
        onPress={toggleDropdown}
      >
        <Calendar size={18} color={colors.primary} />
        <ThemedText weight="medium" style={styles.selectedText}>
          {selectedPeriod.label}
        </ThemedText>
        <ChevronDown 
          size={18} 
          color={colors.subtext}
          style={{
            transform: [{ rotate: isOpen ? '180deg' : '0deg' }]
          }}
        />
      </TouchableOpacity>

      {isOpen && (
        <Animated.View 
          entering={FadeIn}
          style={[
            styles.dropdown, 
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}
        >
          <ScrollView>
            {periods.map((period, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.periodItem,
                  { 
                    backgroundColor: period.label === selectedPeriod.label 
                      ? colors.primary + '20'
                      : 'transparent'
                  }
                ]}
                onPress={() => handlePeriodSelect(period)}
              >
                <ThemedText
                  weight={period.label === selectedPeriod.label ? 'semibold' : 'regular'}
                  color={period.label === selectedPeriod.label ? colors.primary : colors.text}
                >
                  {period.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
    marginVertical: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedText: {
    flex: 1,
    marginLeft: 8,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 100,
  },
  periodItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default DateRangeSelector;