import CKEditor from "components/Shared/CKEditor";
import RForm from "components/Shared/RForm";
import RInput from "components/Shared/RForm/RInput";
import { StdRFormProps } from "components/Shared/RForm/types";
import React, { useEffect } from "react";

interface FormProps extends StdRFormProps {
  onChange: (value: string) => void
  initCK?: string
}

export default function Form(props: FormProps) {
  const { form, init, onChange, initCK } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => form?.resetFields(), [init]);

  return (
    <RForm form={form} initialValues={init}>
      <RInput label="Project's name" name="name" rules={{ required: true }} />

      <RInput label="Type" name="type" rules={{ required: true }} />

      <RInput label="Address" name="address" rules={{ required: true }} />

      <RInput number label="Year" name="year" rules={{ required: true }} />

      <RInput label="Status" name="status" rules={{ required: true }} />

      <RInput label="Investor" name="investor" rules={{ required: true }} />

      <RInput label="Area" name="area" rules={{ required: true }} />

      <RInput label="Title" name="title" rules={{ required: true }} />

      <label>Content</label>
      <CKEditor init={initCK} onChange={onChange}/>

      <RInput label="Description" name="description" />
    </RForm>
  );
}