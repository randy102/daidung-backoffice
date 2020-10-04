import React, { useState, useEffect } from "react";
import { Button, Table, Input, Space, Modal } from "antd";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import * as AntIcon from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import "./grid.scss";
import { HEAD_DATA } from "./HeadTemplate";

interface RGridProps {
  data: any[];
  colDef: ColumnsType<any>;
  headDef: HeaderType[];
  loading?: boolean;
  expandRender?: ExpandedRowRender<any>;
  showSelection?: boolean;
  pagination?: boolean;
}

declare type ExpandedRowRender<ValueType> = (
  record: ValueType,
  index: number,
  indent: number,
  expanded: boolean
) => React.ReactNode;

interface HeaderType {
  icon: string;
  name: string;
  selection?: "multiple" | "single" | undefined;
  onClick: (rows: any[], setSelectedRow: Function) => void;
  type?: HeaderBtnType;
  confirm: boolean;
  confirmMessage: string;
  loading: boolean;
  disabled: boolean;
}

type HeaderBtnType =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "refresh"
  | "detail";

function getNestedPath(data: any, path: string) {
  if (!Array.isArray(path)) return data[path];
  for (let p of path) {
    data = data[p];
  }
  return data;
}

export default function RGrid(props: RGridProps) {
  let {
    pagination = true,
    data,
    colDef,
    headDef,
    loading = false,
    expandRender,
    showSelection = true,
  } = props;

  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  var searchInput: Input | null;

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [data]);

  // Filter =>
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string, record: any) =>
      getNestedPath(record, dataIndex)
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: any) =>
      visible && setTimeout(() => searchInput?.select()),
  });
  function handleSearch(confirm: any) {
    confirm();
  }
  function handleReset(clearFilters: any) {
    clearFilters();
  }
  // <= Filter

  // Sorter =>
  const getSorterProps = (cd: any) => ({
    sorter: (a: any, b: any) => {
      const aVal = getNestedPath(a, cd.dataIndex);
      const bVal = getNestedPath(b, cd.dataIndex);
      if (aVal > bVal) return 1;
      if (aVal < bVal) return -1;
      return 0;
    },
  });
  // => Sorter

  colDef = colDef.map((cd: any) => ({
    ...cd,
    ...getColumnSearchProps(cd.dataIndex),
    ...getSorterProps(cd),
  }));

  return (
    <div>
      {headDef?.length && (
        <div className="rui-grid-btn">
          <Space>
            {headDef &&
              headDef.map(
                ({
                  disabled = false,
                  icon,
                  selection,
                  name,
                  onClick,
                  type,
                  confirm,
                  confirmMessage,
                  loading = false,
                }) => {
                  icon = icon || HEAD_DATA[type || "create"]?.icon;
                  name = name || HEAD_DATA[type || "create"]?.name;
                  selection = selection || (type && HEAD_DATA[type].selection);
                  confirm = confirm || HEAD_DATA[type || "create"]?.confirm;

                  const Icon = AntIcon[icon];
                  const singleError =
                    selection === "single" && selectedRows.length !== 1;
                  const multipleError =
                    selection === "multiple" && selectedRows.length === 0;
                  const isDisabled =
                    disabled || singleError
                      ? true
                      : multipleError
                      ? true
                      : false;

                  function confirmClick(cb: any) {
                    Modal.confirm({
                      title:
                        confirmMessage ||
                        "Bạn có chắc muốn thực hiện hành động này?",
                      icon: <ExclamationCircleOutlined />,
                      onOk: () => cb(selectedRows, setSelectedRows),
                    });
                  }
                  return (
                    <Button
                      loading={loading}
                      key={name}
                      disabled={isDisabled}
                      onClick={() =>
                        confirm
                          ? confirmClick(onClick)
                          : onClick(selectedRows, setSelectedRows)
                      }
                      icon={Icon && <Icon />}
                    >
                      {name}
                    </Button>
                  );
                }
              )}
          </Space>
        </div>
      )}

      <Table
        size="middle"
        showSorterTooltip={false}
        pagination={pagination && { defaultPageSize: 10 }}
        loading={loading}
        columns={colDef}
        dataSource={data}
        rowKey="_id"
        expandedRowRender={expandRender}
        locale={{
          emptyText: "Không có dữ liệu",
        }}
        rowSelection={
          showSelection
            ? {
                type: "checkbox",
                onChange: (keys, rows) => {
                  setSelectedRows(rows);
                  setSelectedRowKeys(keys);
                },
                selectedRowKeys,
                preserveSelectedRowKeys: false,
              }
            : undefined
        }
      />
    </div>
  );
}
