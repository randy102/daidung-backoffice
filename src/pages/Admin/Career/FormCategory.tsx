import RForm from "components/Shared/RForm";
import RInput from "components/Shared/RForm/RInput";
import { StdRFormProps } from "components/Shared/RForm/types";
import React, { useEffect } from "react";

interface FormProps extends StdRFormProps {}

export default function FormCategory(props: FormProps) {
  const { form, init = false } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => form?.resetFields(), [init]);

  return (
    <RForm form={form} initialValues={init}>
      <RInput label="Vi" name="vi" rules={{ required: true }} />
      <RInput label="En" name="en" />
    </RForm>
  );
}
