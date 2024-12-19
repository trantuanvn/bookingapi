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
import { Space, Table } from "antd";

export const BookingList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List canCreate={false}>
      <Table {...tableProps} rowKey="id">
        {/* <Table.Column dataIndex="id" title={"ID"} /> */}
        <Table.Column dataIndex="code" title={"Code"} />
        <Table.Column dataIndex="title" title={"User"} />
        <Table.Column dataIndex="title" title={"Space / Workspace"} />
        <Table.Column dataIndex="title" title={"Date"} />
        <Table.Column dataIndex="title" title={"Time"} />
        <Table.Column dataIndex="title" title={"Type"} />

        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              {/* <EditButton hideText size="small" recordItemId={record.id} /> */}
              <ShowButton
                hideText
                size="small"
                recordItemId={record.documentId}
              />
              {/* <DeleteButton hideText size="small" recordItemId={record.id} /> */}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
