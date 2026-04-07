import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BottomSheetComponent() {
  const bottomSheetModalRef = React.useRef<React.ElementRef<typeof BottomSheetModal>>(null);

  const snapPoints = React.useMemo(() => ['25%', '50%', '90%'], []);

  const handleSheetChanges = React.useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleDismiss = React.useCallback(() => {
    console.log('Bottom sheet dismissed');
  }, []);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {/* <Button
          title="Open Bottom Sheet"
          onPress={() => bottomSheetModalRef.current?.present()}
        /> */}

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose
          enableDismissOnClose
          onChange={handleSheetChanges}
          onDismiss={handleDismiss}
          handleIndicatorStyle={{ display: 'none' }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text
              onPress={() => bottomSheetModalRef.current?.close()}
            >Your Bottom Sheet Content Here</Text>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'papayawhip',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 16,
    height: 450,
  },
});