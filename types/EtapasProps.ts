export default interface EtapasProps {
  inputValue?: string;
  setInputValue?: (text: string) => void;
  onConfirm?: (value: string) => void;
}
