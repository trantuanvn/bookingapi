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

export const PlanList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    meta: {},
  });

  return (
    <List breadcrumb={null}>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title={"Name"} />
        <Table.Column dataIndex="price" title={"Price"} />
        <Table.Column dataIndex="discount" title={"Discount"} />
        <Table.Column dataIndex="description" title={"Mô tả"} />
        <Table.Column dataIndex="code" title={"Code"} />
        <Table.Column dataIndex="color" title={"Color"} />

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
