import * as React from 'react';
import { ScrollView, Text, ViewStyle } from 'react-native';
import { Divider, Modal, PaperProvider, Portal, RadioButton, useTheme } from 'react-native-paper';
import { MaterialButton } from './MaterialButton';

interface BottomDrawerProps {
    business: Array<{ id: string; name: string; description: string }>;
    setActiveBusinessId: (id: number) => void;
    activeBusinessId: string;
    handleChange: (id: number) => void;
    showBottomSheet: boolean;
    setShowBottomSheet: (show: boolean) => void;
}

const BottomDrawer = ({
    business,
    setActiveBusinessId,
    activeBusinessId,
    handleChange,
    showBottomSheet,
    setShowBottomSheet
}: BottomDrawerProps) => {
    const theme = useTheme();
    const [visible, setVisible] = React.useState(true);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle: ViewStyle = {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: 200,
        justifyContent: 'flex-end',
       

    };

    const modalStyle: ViewStyle = {
        justifyContent: 'flex-end',
        
    };

    return (
        <Portal>
            <PaperProvider>
                <Portal>
                    <Modal
                        style={modalStyle}
                        visible={showBottomSheet}
                        onDismiss={() => setShowBottomSheet(false)}
                        contentContainerStyle={containerStyle}
                    >
                        <Text style={{ padding: 20 }}>
                            Choose Business {activeBusinessId}
                        </Text>
                        <Divider />
                        <ScrollView style={{ maxHeight: 300, justifyContent: 'flex-end' }}>

                            <RadioButton.Group
                                onValueChange={value => {

                                    handleChange(Number(value))
                                    setActiveBusinessId(Number(value))
                                    hideModal()
                                    setShowBottomSheet(false)

                                }}
                                value={activeBusinessId}

                            >
                                {business.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <RadioButton.Item
                                            label={`${item.name} - ${item.id}`}
                                            onPress={() => {
                                                if (activeBusinessId != item.id) {
                                                    setActiveBusinessId(Number(item.id))
                                                }
                                            }}
                                            value={item.id}
                                            uncheckedColor='rgb(71, 85, 182)'
                                        />
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </RadioButton.Group>

                        </ScrollView>
                        <MaterialButton
                            label="Create New Business"
                            onPress={() => { }}
                            style={{ backgroundColor: theme.colors.primary }}
                        />
                    </Modal>
                </Portal>

            </PaperProvider>
        </Portal>
    );
};

export default BottomDrawer;