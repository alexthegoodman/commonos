import { useDebounce } from "@/hooks/useDebounce";
import { TextareaAutosize } from "@mui/material";
import { useEffect, useState } from "react";

export default function DebouncedTextarea({ ...props }) {
  const [value, setValue] = useState(props.value);
  const debouncedValue = useDebounce(value, 500);

  const onTextareaChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (debouncedValue) {
      props.onChange(debouncedValue);
    }
  }, [debouncedValue]);

  return <TextareaAutosize {...props} onChange={onTextareaChange} />;
}
