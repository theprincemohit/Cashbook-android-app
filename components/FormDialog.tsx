import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
}).required();

interface FormDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  label: string;
  initialValue?: string;
  onSubmit: (data: { name: string }) => void;
  mode: 'add' | 'edit';
  isLoading?: boolean;
}

const FormDialog: React.FC<FormDialogProps> = ({
  visible,
  onDismiss,
  title,
  label,
  initialValue = '',
  onSubmit,
  mode,
  isLoading = false,
}) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialValue,
    },
  });

  React.useEffect(() => {
    reset({ name: initialValue });
  }, [initialValue, reset]);

  const handleFormSubmit = (data: { name: string }) => {
    onSubmit(data);
    onDismiss();
    reset();
  };

  const containerStyle = { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={containerStyle}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>{title}</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={label}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              mode="outlined"
              error={!!errors.name}
              style={{ marginBottom: 8 }}
            />
          )}
        />
        {errors.name && <Text style={{ color: 'red', marginBottom: 16 }}>{errors.name.message}</Text>}
        <Button mode="contained" 
          onPress={handleSubmit(handleFormSubmit)} 
          style={{ marginTop: 16 }}
          loading={isLoading}
          disabled={isLoading}
        >
            {mode === 'add' ? 'Add' : 'Update'}
        </Button>
        <Button mode="outlined" onPress={onDismiss} style={{ marginTop: 8 }}>
          Cancel
        </Button>
      </Modal>
    </Portal>
  );
};

export default FormDialog;