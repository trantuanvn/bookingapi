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
import { Avatar, Image, Space, Table } from "antd";
import { API_URL } from "../../constants";

export const PostList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    meta: {
      populate: "*",
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
    <List breadcrumb={null}>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title={"Title"} />
        {/* <Table.Column dataIndex="content" title={"Content"} /> */}
        <Table.Column dataIndex="description" title={"Description"} />
        <Table.Column
          dataIndex="date"
          title={"Date"}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex="banner"
          title={"Banner"}
          render={(value: any) => (
            <Image src={API_URL + value.url} height={60} />
          )}
        />

        <Table.Column
          dataIndex={["createdAt"]}
          title={"Created at"}
          width={150}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          width={100}
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton
                hideText
                size="small"
                recordItemId={record.documentId}
              />
              <DeleteButton
                recordItemId={record.documentId}
                size="small"
                hideText
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
