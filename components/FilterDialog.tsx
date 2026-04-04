import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Chip, Divider, Modal, PaperProvider, Portal, RadioButton, useTheme } from 'react-native-paper';
import { MaterialButton } from './MaterialButton';

const filterOptions = {
    'date_from': ['All Time', 'Today', 'This Week', 'This Month', 'This Year', 'Custom Range'],
    // 'Amount': ['< $100', '$100 - $500', '> $500'],
    'type': ['All', 'credit', 'debit']
}
interface FilterDialogProps {
    handleSave: (data: any) => void;
    show: boolean;
    setShow: (show: boolean) => void;
}

const FilterDialog = ({
    handleSave,
    show,
    setShow
}: FilterDialogProps) => {
    const theme = useTheme();
    const [selectedFilter, setSelectedFilter] = React.useState<keyof typeof filterOptions>('date_from');
    const [filterData, setFilterData] = React.useState({date_from: 'All Time', type: 'All'});

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
                    <Modal style={modalStyle} visible={show} onDismiss={() => setShow(false)} contentContainerStyle={containerStyle}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 8 }}>
                            <Chip
                                icon={selectedFilter === 'date_from' ? 'check' : undefined}
                                mode='outlined'
                                onPress={() => setSelectedFilter('date_from')}
                            >
                                Date
                            </Chip>
                            <Chip
                                icon={selectedFilter === 'type' ? 'check' : undefined}
                                mode='outlined'
                                onPress={() => setSelectedFilter('type')}
                            >
                                Entry Type
                            </Chip>

                        </View>
                        <Divider />
                        <ScrollView>

                            <RadioButton.Group
                                onValueChange={value => {

                                    console.log('onpress ----',`${value}`);
                                    setFilterData(prev => ({ ...prev, [selectedFilter]: value }))


                                }}
                                value={`${filterData[selectedFilter]}`} // Default to first option of selected filter

                            >
                                {filterOptions[selectedFilter].map((item) => (
                                    <React.Fragment key={item}>
                                        <RadioButton.Item
                                            label={item}
                                            value={item}
                                        />
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </RadioButton.Group>

                        </ScrollView>
                        <MaterialButton
                            label="Apply Filters"
                            onPress={() => {
                                handleSave(filterData);
                                setFilterData({date_from: 'Today', type: 'All'});
                                setShow(false)
                            }}
                            style={{ backgroundColor: theme.colors.primary }}
                        />
                    </Modal>
                </Portal>

            </PaperProvider>
        </Portal>
    );
};

export default FilterDialog;