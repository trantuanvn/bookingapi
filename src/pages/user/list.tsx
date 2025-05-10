import {
  Create,
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Avatar, Input, Space, Table } from "antd";
import { API_URL } from "../../constants";

export const UserList = () => {
  const { tableProps, filters, setFilters } = useTable({
    syncWithLocation: true,
    meta: {
      populate: ["role", "avatar", "currentPlan"],
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
  });

  return (
    <List
      headerButtons={
        <Space>
          <Input.Search
            placeholder="Tìm kiếm"
            style={{ width: 300 }}
            onSearch={(value) => {
              setFilters([
                {
                  operator: "or",
                  value: [
                    {
                      field: "username",
                      operator: "contains",
                      value: value,
                    },
                    {
                      field: "phoneNumber",
                      operator: "contains",
                      value: value,
                    },
                  ],
                },
              ]);
            }}
          />
          <CreateButton
            children={<span style={{ fontSize: 14 }}>Tạo người dùng mới</span>}
          />
        </Space>
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex={["avatar"]}
          title="Avatar"
          render={(r) => <Avatar src={API_URL + r?.url} />}
        />
        <Table.Column dataIndex="username" title={"Username"} />
        <Table.Column dataIndex="email" title={"Email"} />
        <Table.Column dataIndex="phoneNumber" title={"SĐT"} />
        <Table.Column dataIndex="fullName" title={"Tên đầy đủ"} />
        <Table.Column dataIndex={["role", "name"]} title={"Phân quyền"} />
        <Table.Column
          dataIndex={["currentPlan", "name"]}
          title={"Gói dịch vụ hiện tại"}
          render={(value: any) => <MarkdownField value={value} />}
        />

        <Table.Column
          dataIndex={["createdAt"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          width={100}
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
