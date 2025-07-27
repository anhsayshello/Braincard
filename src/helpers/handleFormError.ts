import { AxiosError } from "axios";
import { UseFormReturn } from "react-hook-form";

export default function handleFormError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>,
  error: Error,
  field: string
) {
  const axiosError = error as AxiosError<{ error: string }>;
  const errorMessage =
    axiosError.response?.data?.error ||
    (error instanceof Error ? error.message : "Something went wrong");

  form.setError(field, {
    message: errorMessage,
  });

  console.error("Form Error:", errorMessage);
}
