export default interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    message: string;
    showInput?: boolean;
    inputValue?: string;
    setInputValue?: (text: string) => void;
    onConfirm?: () => void;
    confirmButtonText?: string;
    closeButtonText?: string;
  }