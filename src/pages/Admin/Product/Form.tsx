import CKEditor from "components/Shared/CKEditor";
import RForm from "components/Shared/RForm";
import RInput from "components/Shared/RForm/RInput";
import { StdRFormProps } from "components/Shared/RForm/types";
import React, { useEffect } from "react";

interface FormProps extends StdRFormProps {
  onChange: (value: string) => void
  initCK?: string
}

export default function FormCategory(props: FormProps) {
  const { form, init, onChange, initCK } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => form?.resetFields(), [init]);

  return (
    <RForm form={form} initialValues={init}>
      <RInput label="Product's name" name="name" rules={{ required: true }} />

      <label>Content</label>
      <CKEditor init={initCK} onChange={onChange}/>
      
      <RInput label="Description" name="description" textarea />
    </RForm>
  );
}
