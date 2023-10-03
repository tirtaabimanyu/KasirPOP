import { Button, ButtonProps, Text } from "react-native-paper";
import {
  StarIO10CommunicationError,
  StarIO10IllegalDeviceStateError,
  StarIO10NotFoundError,
  StarIO10UnprintableError,
} from "kasirbodoh-star-io10";
import BaseDialog from "../components/BaseDialog";
import useDialog from "../hooks/useDialog";
import { useState } from "react";

interface PrintButtonProps extends ButtonProps {
  onPressPrint: () => Promise<void>;
}

const PrintButton = (props: PrintButtonProps) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [connectErrorDialog, showConnectErrorDialog, hideConnectErrorDialog] =
    useDialog();
  const [printErrorDialog, showPrintErrorDialog, hidePrintErrorDialog] =
    useDialog();

  const onPress = async () => {
    try {
      setIsPrinting(true);
      await props.onPressPrint();
    } catch (error) {
      if (
        error instanceof StarIO10IllegalDeviceStateError ||
        error instanceof StarIO10CommunicationError ||
        error instanceof StarIO10NotFoundError
      ) {
        showConnectErrorDialog();
      } else if (error instanceof StarIO10UnprintableError) {
        showPrintErrorDialog();
      }
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <>
      <BaseDialog
        visible={connectErrorDialog}
        dismissable
        onDismiss={hideConnectErrorDialog}
      >
        <BaseDialog.Title>
          <Text variant="headlineSmall">Printer tidak terhubung</Text>
        </BaseDialog.Title>
        <BaseDialog.Content>
          <Text>
            {`Pastikan beberapa hal di bawah ini lalu klik Cetak Ulang Struk:\n` +
              ` - Printer sudah menyala\n` +
              ` - Bluetooth perangkat ini aktif\n` +
              ` - Printer sudah terhubung dengan perangkat ini\n` +
              `\nJika Anda ingin melanjutkan semua transaksi tanpa cetak struk, matikan Otomatis Cetak pada Pengaturan Struk & Printer.`}
          </Text>
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button
            mode="contained"
            style={{ paddingHorizontal: 24 }}
            onPress={() => {
              hideConnectErrorDialog();
              onPress();
            }}
          >
            Cetak Ulang Struk
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <BaseDialog
        visible={printErrorDialog}
        dismissable
        onDismiss={hidePrintErrorDialog}
      >
        <BaseDialog.Title>
          <Text variant="headlineSmall">Cetak Struk Gagal</Text>
        </BaseDialog.Title>
        <BaseDialog.Content>
          <Text>
            {`Pastikan beberapa hal di bawah ini lalu klik Cetak Ulang Struk:\n` +
              ` - Printer memiliki kertas struk`}
          </Text>
        </BaseDialog.Content>
        <BaseDialog.Actions>
          <Button
            mode="contained"
            style={{ paddingHorizontal: 24 }}
            onPress={() => {
              hidePrintErrorDialog();
              onPress();
            }}
          >
            Cetak Ulang Struk
          </Button>
        </BaseDialog.Actions>
      </BaseDialog>
      <Button {...props} onPress={onPress} loading={isPrinting}>
        {props.children}
      </Button>
    </>
  );
};

export default PrintButton;
