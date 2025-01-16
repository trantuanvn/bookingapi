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
      populate: ["user", "booking_items.work_space.space"],
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
          dataIndex="booking_items"
          title={"Space / Workspace"}
          render={(r) =>
            r
              ?.map(
                (a: any) =>
                  `${a.work_space?.space?.name} - ${a.work_space?.name}`
              )
              .join(" , ")
          }
        />
        <Table.Column
          dataIndex="booking_items"
          title={"Date"}
          render={(r) =>
            r
              ?.map((a: any) => `${a.date} ${a.start_time}-${a.end_time}`)
              .join(" , ")
          }
        />
        <Table.Column dataIndex="state" title={"Status code"} />
        <Table.Column
          dataIndex="name"
          title={" Name"}
          render={(v, r) => `${r?.name}  ${r?.email} ${r.phone}`}
        />

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
