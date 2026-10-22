import type { Message } from "../i18n/translate";

export default interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    message: Message;
    showInput?: boolean;
    inputValue?: string;
    setInputValue?: (text: string) => void;
    onConfirm?: () => void;
    confirmButtonText?: string;
    closeButtonText?: string;
    stackedButtons?: boolean;
    onMapPress?: () => void;
  }
