import { Button, message, Space, Tabs } from "antd";
import { useForm } from "components/Shared/RForm";
import { StdCreateProps } from "components/Shared/RForm/types";
import React, { Dispatch, useState } from "react";
import { handleFieldError, isEmpty } from "utils/form";
import { handleRequestError, useMutation } from "utils/request";
import Form from "./Form";

interface CreateProps extends StdCreateProps {
  refetch: Function;
  setCurTab: Dispatch<string>;
}

export default function Create(props: CreateProps) {
  const { setCurTab, refetch } = props;

  const [enForm] = useForm();
  const [viForm] = useForm();
  const [enCK, setEnCK] = useState<string>();
  const [viCK, setViCK] = useState<string>();

  const [lang, setLang] = useState<string>("vi");
  const [saveLoading, setSaveLoading] = useState(false);
  const requestCreate = useMutation({ api: "/news", method: "post" });

  function handleSave() {
    const enInputs = enForm.validateFields();
    const viInputs = viForm.validateFields();

    Promise.all([enInputs, viInputs])
      .then(([en, vi]) => {
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
            data: toCreateData,
          },
        })
          .then(() => {
            message.success("Success!");
            refetch();
            setCurTab("list");
            viForm.resetFields();
            enForm.resetFields();
            setEnCK("");
            setViCK("");
          })
          .catch(handleRequestError)
          .finally(() => setSaveLoading(false));
      })
      .catch(handleFieldError);
  }

  function handleCopy() {
    const viData = viForm.getFieldsValue()
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
        style={{ maxWidth: 600 }}
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
    </>
  );
}