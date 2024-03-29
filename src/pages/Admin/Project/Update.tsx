import { message, Tabs } from "antd";
import { POST_STATUS } from "components/Shared/POST_STATUS";
import RDrawer from "components/Shared/RDrawer";
import RForm, { useForm } from "components/Shared/RForm";
import RSelect from "components/Shared/RForm/RSelect";
import RUploads from "components/Shared/RForm/RUploads";
import RUpload from "components/Shared/RForm/RUpload";
import React, { useEffect, useState } from "react";
import { handleFieldError, isEmpty } from "utils/form";
import { getLang } from "utils/languages";
import { handleRequestError, useFetch, useMutation } from "utils/request";
import { CATEGORY_TYPES } from "./CATEGORY_TYPES";
import Form from "./Form";
import { PROJECT_STATUS } from "./PROJECT_STATUS";
import RSwitch from "components/Shared/RForm/RSwitch";
import RInput from "components/Shared/RForm/RInput";

interface UpdateProps {
  setInitRow: React.Dispatch<any>;
  setShowForm: React.Dispatch<boolean>;
  initRow: any;
  refetch: Function;
  showForm: boolean;
  lang: string;
  setLang: React.Dispatch<string>;
}

export default function Update(props: UpdateProps) {
  const {
    setInitRow,
    setShowForm,
    initRow,
    refetch,
    showForm,
    lang,
    setLang,
  } = props;

  const [enForm] = useForm();
  const [viForm] = useForm();
  const [form] = useForm();
  const [enCK, setEnCK] = useState<string>();
  const [viCK, setViCK] = useState<string>();
  const [imgs, setImgs] = useState<string[]>();
  const [img, setImg] = useState<string>();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [type, setType] = useState<string>();

  const requestUpdate = useMutation({ method: "put" });
  const [resCategory, { refetch: refetchCategory }] = useFetch({
    api: "/project/category",
  });

  const initData: any = {
    vi: getLang("vi", initRow),
    en: getLang("en", initRow),
  };

  useEffect(() => {
    if (!enForm.isFieldsTouched()) {
      enForm.setFieldsValue(initData["en"]);
      setEnCK(initData["en"]?.content || "");
    }

    if (!viForm.isFieldsTouched()) {
      viForm.setFieldsValue(initData["vi"]);
      setViCK(initData["vi"]?.content || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initRow, lang]);

  useEffect(() => {
    form.setFieldsValue(initRow);
    setType(initRow?.type);
    setImgs(initRow?.images);
    setImg(initRow?.mainImage);
  }, [initRow, form]);

  function handleClose() {
    setInitRow(undefined);
    setShowForm(false);
    setEnCK("");
    setViCK("");
    setImgs(undefined);
    setImg(undefined);
    enForm.resetFields();
    viForm.resetFields();
    form.resetFields();
  }

  function handleSubmit(submitImgs?: string[], submitImg?: string) {
    const enInputs = enForm.validateFields();
    const viInputs = viForm.validateFields();
    const formInputs = form.validateFields();
    Promise.all([enInputs, viInputs, formInputs])
      .then(([en, vi, form]) => {
        setSubmitLoading(true);
        let data = [];

        if (initData["en"].name || enForm.isFieldsTouched())
          data.push({
            lang: "en",
            content: enCK,
            ...(isEmpty(en) ? initData["en"] : en),
          });

        data.push({
          lang: "vi",
          content: viCK,
          ...(isEmpty(vi) ? initData["vi"] : vi),
        });

        requestUpdate({
          api: "/project/" + initRow?._id,
          data: {
            ...form,
            images: submitImgs || imgs,
            mainImage: submitImg !== undefined ? submitImg : img,
            isPrimary: !!form.isPrimary,
            data,
          },
        })
          .then(() => {
            if (!submitImgs && !submitImg && submitImg !== "") {
              handleClose();
              message.success("Success!");
            }
            refetch();
          })
          .catch(handleRequestError)
          .finally(() => setSubmitLoading(false));
      })
      .catch(handleFieldError);
  }

  function handleImgsChange(imgs: string[]) {
    setImgs(imgs);
    handleSubmit(imgs);
  }

  function handleImgChange(img: string | undefined) {
    setImg(img);
    handleSubmit(undefined, img || "");
  }

  function handleTypeChange(type: string) {
    form.resetFields(["categoryId"]);
    setType(type);
  }

  return (
    <RDrawer
      title="Edit"
      onClose={handleClose}
      visible={showForm}
      footDef={[
        {
          name: "Save",
          type: "primary",
          onClick: () => {
            handleSubmit();
          },
          loading: submitLoading,
        },
        {
          name: "Close",
          onClick: handleClose,
        },
      ]}
    >
      <Tabs type="card" activeKey={lang} onTabClick={setLang}>
        <Tabs.TabPane key="vi" tab="Vietnamese">
          <Form form={viForm} onChange={setViCK} initCK={viCK} />
        </Tabs.TabPane>
        <Tabs.TabPane key="en" tab="English">
          <Form form={enForm} onChange={setEnCK} initCK={enCK} />
        </Tabs.TabPane>
      </Tabs>
      <RForm form={form}>
        <RSelect
          data={CATEGORY_TYPES}
          label="Type"
          name="type"
          labelRender={(row) => row.name}
          optionRender={(row) => row.name}
          optionValue={(row) => row._id}
          required
          onChange={handleTypeChange}
        />

        <RSelect
          refetch={refetchCategory}
          data={resCategory?.data.filter((cate: any) => cate.type === type)}
          label="Category"
          name="categoryId"
          labelRender={(row) => row[lang]}
          optionRender={(row) => row[lang]}
          optionValue={(row) => row._id}
          filterProps={(row) => [row.en, row.vi]}
          required
        />

        <RSelect
          data={PROJECT_STATUS}
          label="Project Status"
          name="projectStatus"
          labelRender={(row) => row.name}
          optionRender={(row) => row.name}
          optionValue={(row) => row._id}
          required
        />

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

        <RInput
          name="sequence"
          label="Sequence"
          number
          rules={{ required: true }}
        />
      </RForm>

      <RUpload
        onChange={handleImgChange}
        crop={false}
        label="Main Image"
        initId={initRow?.mainImage}
      />

      <RUploads
        onChange={handleImgsChange}
        label="Images"
        initIds={initRow?.images}
      />
    </RDrawer>
  );
}
