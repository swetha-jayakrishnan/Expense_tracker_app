import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import ThemedText from '@/components/common/ThemedText';
import Button from '@/components/common/Button';
import { Category, TransactionType } from '@/types/transaction';
import DateTimePicker from '@/components/common/DateTimePicker';
import { Calendar, IndianRupee } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (
    amount: number,
    type: TransactionType,
    categoryId: string,
    date: Date,
    note?: string
  ) => Promise<boolean>;
  isLoading: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  categories,
  onSubmit,
  isLoading,
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filter categories by type
  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  // Reset categoryId when type changes
  useEffect(() => {
    setCategoryId('');
  }, [type]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!categoryId) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const success = await onSubmit(
      parseFloat(amount),
      type,
      categoryId,
      date,
      note.trim() || undefined
    );
    if (success) {
      // Reset form
      setAmount('');
      setCategoryId('');
      setNote('');
      setDate(new Date());
      // Force dashboard reload after adding transaction
      setTimeout(() => {
        router.replace('/');
      }, 100);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View entering={FadeInDown.duration(300).delay(50)}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                { 
                  backgroundColor: type === 'income' ? colors.income + '20' : 'transparent',
                  borderColor: type === 'income' ? colors.income : colors.border,
                }
              ]}
              onPress={() => setType('income')}
            >
              <ThemedText
                weight="semibold"
                color={type === 'income' ? colors.income : colors.subtext}
              >
                Income
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                { 
                  backgroundColor: type === 'expense' ? colors.expense + '20' : 'transparent',
                  borderColor: type === 'expense' ? colors.expense : colors.border,
                }
              ]}
              onPress={() => setType('expense')}
            >
              <ThemedText
                weight="semibold"
                color={type === 'expense' ? colors.expense : colors.subtext}
              >
                Expense
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View 
          style={styles.amountContainer}
          entering={FadeInDown.duration(300).delay(100)}
        >
          <View style={[styles.amountInputContainer, { borderColor: errors.amount ? colors.error : colors.border }]}>
            <IndianRupee size={20} color={colors.primary} />
            <TextInput
              style={[
                styles.amountInput,
                { 
                  color: colors.text,
                  fontFamily: 'Inter-SemiBold'
                }
              ]}
              placeholder="0.00"
              placeholderTextColor={colors.subtext}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          {errors.amount && (
            <ThemedText variant="caption" color={colors.error} style={styles.errorText}>
              {errors.amount}
            </ThemedText>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(300).delay(150)}>
          <ThemedText weight="medium" style={styles.sectionTitle}>
            Date
          </ThemedText>
          
          <TouchableOpacity
            style={[
              styles.dateSelector,
              { borderColor: colors.border, backgroundColor: colors.card }
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={colors.primary} />
            <ThemedText style={styles.dateText}>
              {date.toLocaleDateString()}
            </ThemedText>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
              onClose={() => setShowDatePicker(false)}
            />
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(300).delay(200)}>
          <ThemedText weight="medium" style={styles.sectionTitle}>
            Category
          </ThemedText>
          
          <View style={styles.categoriesContainer}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor: categoryId === category.id 
                        ? category.color + '30' 
                        : colors.card,
                      borderColor: categoryId === category.id 
                        ? category.color 
                        : colors.border,
                    }
                  ]}
                  onPress={() => setCategoryId(category.id)}
                >
                  <ThemedText
                    weight={categoryId === category.id ? 'semibold' : 'regular'}
                    color={categoryId === category.id ? category.color : colors.text}
                  >
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              ))
            ) : (
              <ThemedText>No categories available</ThemedText>
            )}
          </View>
          
          {errors.category && (
            <ThemedText variant="caption" color={colors.error} style={styles.errorText}>
              {errors.category}
            </ThemedText>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(300).delay(250)}>
          <ThemedText weight="medium" style={styles.sectionTitle}>
            Note (Optional)
          </ThemedText>
          
          <TextInput
            style={[
              styles.noteInput,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text
              }
            ]}
            placeholder="Add a note"
            placeholderTextColor={colors.subtext}
            value={note}
            onChangeText={setNote}
            multiline
          />
        </Animated.View>

        <Animated.View 
          style={styles.buttonContainer}
          entering={FadeInDown.duration(300).delay(300)}
        >
          <Button
            title="Save Transaction"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  amountContainer: {
    marginBottom: 24,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    marginLeft: 8,
    paddingVertical: 8,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateText: {
    marginLeft: 8,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 4,
    borderWidth: 1,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 32,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
});

export default TransactionForm;