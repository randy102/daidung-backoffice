import { Button, message, Space, Tabs } from "antd";
import { POST_STATUS } from "components/Shared/POST_STATUS";
import RForm, { useForm } from "components/Shared/RForm";
import RSelect from "components/Shared/RForm/RSelect";
import RSwitch from "components/Shared/RForm/RSwitch";
import RUpload, { UploadApi } from "components/Shared/RForm/RUpload";
import { StdCreateProps } from "components/Shared/RForm/types";
import React, { Dispatch, useState } from "react";
import { handleFieldError, isEmpty } from "utils/form";
import { handleRequestError, useMutation } from "utils/request";
import Form from "./Form";
import { NEWS_TYPES } from "./NEWS_TYPES";

interface CreateProps extends StdCreateProps {
  refetch: Function;
  setCurTab: Dispatch<string>;
}

export default function Create(props: CreateProps) {
  const { setCurTab, refetch } = props;

  const [enForm] = useForm();
  const [viForm] = useForm();
  const [form] = useForm();
  const [enCK, setEnCK] = useState<string>();
  const [viCK, setViCK] = useState<string>();
  const [image, setImage] = useState<string>();

  const [uploadAPI, setUploadAPI] = useState<UploadApi>();
  const [lang, setLang] = useState<string>("vi");
  const [saveLoading, setSaveLoading] = useState(false);
  const requestCreate = useMutation({ api: "/news", method: "post" });

  function handleSave() {
    const enInputs = enForm.validateFields();
    const viInputs = viForm.validateFields();
    const formInputs = form.validateFields();
    Promise.all([enInputs, viInputs, formInputs])
      .then(([en, vi, fo]) => {
        setSaveLoading(true);

        let toCreateData = [];
        if (!isEmpty(en)) {
          toCreateData.push({ ...en, content: enCK, lang: "en" });
        }
        if (!isEmpty(vi)) {
          toCreateData.push({ ...vi, content: viCK, lang: "vi" });
        }

        requestCreate({
          data: {
            ...fo,
            isPrimary: !!fo.isPrimary,
            data: toCreateData,
            image,
          },
        })
          .then(() => {
            message.success("Success!");
            refetch();
            setCurTab("list");
            viForm.resetFields();
            enForm.resetFields();
            form.resetFields();
            setEnCK("");
            setViCK("");
            uploadAPI?.reset();
          })
          .catch(handleRequestError)
          .finally(() => setSaveLoading(false));
      })
      .catch(handleFieldError);
  }

  function handleCopy() {
    const viData = viForm.getFieldsValue();
    switch (lang) {
      case "en":
        setEnCK(viCK);
        enForm.setFieldsValue(viData);
        return;
    }
  }

  return (
    <>
      <Tabs
        style={{ maxWidth: 900 }}
        type="card"
        activeKey={lang}
        onTabClick={setLang}
        tabBarExtraContent={
          <Space style={{ transform: "translateY(4px)" }}>
            {lang !== "vi" && (
              <Button onClick={handleCopy}>Copy from Vietnamese</Button>
            )}
            <Button loading={saveLoading} onClick={handleSave} type="primary">
              Save
            </Button>
          </Space>
        }
      >
        <Tabs.TabPane key="vi" tab="Vietnamese">
          <Form form={viForm} onChange={setViCK} initCK={viCK} />
        </Tabs.TabPane>

        <Tabs.TabPane key="en" tab="English">
          <Form form={enForm} onChange={setEnCK} initCK={enCK} />
        </Tabs.TabPane>
      </Tabs>
      <RForm form={form}>
        <RSwitch
          name="isPrimary"
          label="Primary"
          checkedText="True"
          unCheckedText="False"
        />

        <RSelect
          data={POST_STATUS}
          label="Status"
          name="status"
          labelRender={(row) => row.name}
          optionRender={(row) => row.name}
          optionValue={(row) => row._id}
          required
        />

        <RSelect
          label="Type"
          name="type"
          data={NEWS_TYPES}
          labelRender={(r) => r.name}
          optionRender={(r) => r.name}
          optionValue={(r) => r._id}
          required
        />
      </RForm>
      <RUpload
        onChange={setImage}
        label="Image"
        crop={false}
        uploadApi={setUploadAPI}
      />
    </>
  );
}
