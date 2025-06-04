import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import ThemedText from './ThemedText';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Button from './Button';

interface DateTimePickerProps {
  value: Date;
  onChange: (event: any, date?: Date) => void;
  onClose: () => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, onClose }) => {
  const { colors, isDark } = useTheme();
  const [date, setDate] = React.useState(value);

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <RNDateTimePicker
        value={value}
        onChange={onChange}
        mode="date"
      />
    );
  }

  // Web implementation
  const handleChange = (event: any) => {
    setDate(new Date(event.target.value));
  };

  const handleSave = () => {
    onChange({}, date);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.card }]}>
          <ThemedText variant="subtitle" weight="semibold" style={styles.title}>
            Select Date
          </ThemedText>
          
          <input
            type="date"
            value={date.toISOString().split('T')[0]}
            onChange={handleChange}
            style={{
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              marginVertical: 16,
              backgroundColor: colors.background,
              color: colors.text,
              fontSize: 16,
              fontFamily: 'Inter-Regular',
              width: '100%',
            }}
          />
          
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Save"
              onPress={handleSave}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 16,
  },
  button: {
    marginLeft: 10,
    minWidth: 100,
  },
});

export default DateTimePicker;