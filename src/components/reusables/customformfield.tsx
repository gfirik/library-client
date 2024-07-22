import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type Option = {
  value: string;
  label: string;
};

interface CustomFormFieldProps {
  name: string;
  label: string;
  type?: string;
  options?: Option[];
}

const CustomFormField: React.FC<CustomFormFieldProps> = ({
  name,
  label,
  type = "text",
  options = [],
}) => {
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "select" ? (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                {...field}
                type={type}
                onChange={(e) => {
                  const value = e.target.value;
                  if (type === "number") {
                    setValue(name, value === "" ? null : Number(value), {
                      shouldValidate: true,
                    });
                  } else {
                    field.onChange(e);
                  }
                }}
                value={field.value?.toString() ?? ""}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
