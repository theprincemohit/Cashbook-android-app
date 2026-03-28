import * as React from 'react';
import { ScrollView, Text } from 'react-native';
import { Divider, Modal, PaperProvider, Portal, RadioButton } from 'react-native-paper';
import { MaterialButton } from './MaterialButton';

interface BottomDrawerProps {
    business: Array<{ id: string; name: string; description: string }>;
    setActiveBusinessId: (id: number) => void;
    activeBusinessId: string;
    handleChange: (id: number) => void;
}

const BottomDrawer = ({ 
    business, 
    setActiveBusinessId, 
    activeBusinessId,
    handleChange 
    }: BottomDrawerProps) => {
    const [visible, setVisible] = React.useState(true);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {
        backgroundColor: 'white',
        padding: 20,

        // width: '100%',

    };

    const modalStyle = {
        // justifyContent: 'flex-end', // Positions the modal at the bottom
        margin: 0, // Removes default wrapper margins to allow full width
        paddingBottom: 0
    };

    return (
        <Portal>
            <PaperProvider>
                <Portal>
                    <Modal style={modalStyle} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                        <Text style={{padding: 20}}>
                            Choose Business     
                        </Text>
                        <Divider />
                        <ScrollView>

                            <RadioButton.Group
                                onValueChange={value => {
                                    handleChange(Number(value))
                                    setActiveBusinessId(Number(value))

                                }}
                                value={activeBusinessId}
                                
                            >
                                {business.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <RadioButton.Item
                                            label={item.name}
                                            // onPress={() => setActiveBusinessId(Number(item.id))}
                                            value={item.id}
                                            status={activeBusinessId == item.id ? 'checked': 'unchecked'}
                                        />
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </RadioButton.Group>
                            
                        </ScrollView>
                                <MaterialButton
                                    label="Create New Business"
                                    onPress={() => {}}
                                    style={{backgroundColor: "rgb(71, 85, 182)"}}
                                 />
                    </Modal>
                </Portal>

            </PaperProvider>
        </Portal>
    );
};

export default BottomDrawer;