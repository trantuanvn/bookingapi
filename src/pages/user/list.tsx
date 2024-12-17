import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Avatar, Space, Table } from "antd";
import { API_URL } from "../../constants";

export const UserList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    meta: {
      populate: ["role", "avatar"],
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        {/* <Table.Column dataIndex="id" title={"ID"} /> */}
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
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
