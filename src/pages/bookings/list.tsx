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
    meta: {
      populate: ["user", "work_space.space"],
    },
  });

  return (
    <List canCreate={false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="code" title={"Code"} />
        <Table.Column
          dataIndex="user"
          title={"User"}
          render={(v) => v?.username}
        />
        <Table.Column
          dataIndex="work_space"
          title={"Space / Workspace"}
          render={(r) => `${r?.space?.name} - ${r?.name}`}
        />
        <Table.Column
          dataIndex="start"
          title={"Date"}
          render={(r) => <DateField value={r} format="YYYY-MM-DD" />}
        />
        <Table.Column
          dataIndex="start"
          title={"Time"}
          render={(r, c: any) => (
            <p>
              <DateField value={c.start} format="HH:mm" /> -
              <DateField value={c.end} format="HH:mm" />
            </p>
          )}
        />
        <Table.Column dataIndex="type" title={"Type"} />
        <Table.Column dataIndex="statusCode" title={"Status code"} />

        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <ShowButton
                hideText
                size="small"
                recordItemId={record.documentId}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
