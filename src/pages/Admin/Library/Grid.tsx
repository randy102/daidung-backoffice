import { message, Tag } from "antd";
import RGrid from "components/Shared/RGrid";
import React, { useState } from "react";
import { handleRequestError, useMutation, useSwap } from "utils/request";
import Update from "./Update";
import moment from "moment";
import { LIBRARY_TYPE_GRID } from "./LIBRARY_TYPES";

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
    requestDelete({ api: "/library/" + row[0]._id })
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
        model: "library",
      },
    })
      .then(() => refetch())
      .catch(handleRequestError)
      .finally(() => setSwapLoading(false));
  }

  return (
    <>
      <RGrid
        onDrag={handleSwap}
        loading={loading || swapLoading || deleteLoading}
        data={res?.data}
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
            title: "Vi",
            dataIndex: "vi",
          },
          {
            title: "En",
            dataIndex: "en",
          },
          {
            title: "Key",
            dataIndex: "key",
          },
          {
            title: "Type",
            dataIndex: "type",
            render: (type) => <Tag color={LIBRARY_TYPE_GRID[type]?.color}>{LIBRARY_TYPE_GRID[type]?.name}</Tag>
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
