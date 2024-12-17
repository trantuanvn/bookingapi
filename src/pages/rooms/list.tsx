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

export const RoomList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    sorters: {
      permanent: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
  });

  return (
    <List
      title="Danh sách phòng"
      createButtonProps={{ children: "Tạo phòng mới" }}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title={"Tên"} />
        <Table.Column dataIndex="type" title={"Loại"} />

        <Table.Column
          title={""}
          width={80}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton
                hideText
                size="small"
                recordItemId={record.documentId}
              />
              {/* <ShowButton
                hideText
                size="small"
                recordItemId={record.documentId}
              /> */}
              <DeleteButton
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
