import { message, Tag } from "antd";
import RGrid from "components/Shared/RGrid";
import React, { useState } from "react";
import { handleRequestError, useMutation, useSwap } from "utils/request";
import Update from "./Update";
import moment from "moment";
import RImage from "components/Shared/RImage";
import { SLIDER_TYPE_GRID } from "./SLIDER_TYPES";

interface GridProps {
  res: any;
  loading: boolean;
  refetch: Function;
}

export default function Grid(props: GridProps) {
  const { res, loading, refetch } = props;

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [initRow, setInitRow] = useState<any>();
  const [swapLoading, setSwapLoading] = useState<boolean>(false);
  const requestSwap = useSwap();
  const requestDelete = useMutation({ method: "delete" });

  function handleDelete(row: any[]) {
    setDeleteLoading(true)
    requestDelete({ api: "/slider/" + row[0]._id })
      .then(() => {
        message.success("Success!");
        refetch();
      })
      .catch(handleRequestError)
      .finally(() => setDeleteLoading(false));
  }

  function handleUpdate(row: any[]) {
    setInitRow(res?.data.find((r: any) => r._id === row[0]._id));
    setShowForm(true);
  }

  function handleSwap(fromIndex: number, toIndex: number) {
    const from = res?.data[fromIndex]["_id"];
    const to = res?.data[toIndex]["_id"];

    setSwapLoading(true)
    requestSwap({
      data: {
        from,
        to,
        model: "sliders",
      },
    })
      .then(() => refetch())
      .catch(handleRequestError)
      .finally(() => setSwapLoading(false));
  }

  return (
    <>
      <RGrid
        loading={loading || swapLoading || deleteLoading}
        data={res?.data}
        onDrag={handleSwap}
        headDef={[
          { type: "refresh", onClick: () => refetch() },
          { type: "update", onClick: handleUpdate },
          { type: "delete", onClick: handleDelete, loading: deleteLoading },
        ]}
        colDef={[
          {
            title: "Seq",
            dataIndex: "sequence",
          },
          {
            title: "Image",
            dataIndex: "image",
            render: (id) => id && <RImage id={id} width={60} />,
          },
          {
            title: "Vi",
            dataIndex: "vi",
          },
          {
            title: "En",
            dataIndex: "en",
          },
          {
            title: "Sub Vi",
            dataIndex: "subVi",
          },
          {
            title: "Sub En",
            dataIndex: "subEn",
          },
          {
            title: "Link",
            dataIndex: "link",
            render: (link) => <a href={link}>{link}</a>,
          },
          {
            title: "Extra link",
            dataIndex: "extraLink",
            render: (link) => <a href={link}>{link}</a>,
          },
          {
            title: "Type",
            dataIndex: "type",
            render: (type) => <Tag color={SLIDER_TYPE_GRID[type]?.color}>{SLIDER_TYPE_GRID[type]?.name}</Tag>
          },
          {
            title: "Created",
            dataIndex: "createdAt",
            render: (val) => val && moment(val).format("D/M/YYYY"),
          },
          {
            title: "Updated",

            dataIndex: "updatedAt",
            render: (val) => val && moment(val).format("D/M/YYYY"),
          },
        ]}
      />

      <Update
        {...{
          setInitRow,
          initRow,
          showForm,
          setShowForm,
          refetch,
        }}
      />
    </>
  );
}
