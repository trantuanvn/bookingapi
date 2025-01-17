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

export const PostList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    meta: {},
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column dataIndex="content" title={"Content"} />
        <Table.Column dataIndex="description" title={"Description"} />
        <Table.Column dataIndex="date" title={"Date"} />
        <Table.Column dataIndex="author" title={"Author"} />
        <Table.Column dataIndex="thumnail" title={"Thumbnail"} />
        <Table.Column dataIndex="banner" title={"Banner"} />

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
