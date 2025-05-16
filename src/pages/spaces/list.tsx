import {
  DateField,
  DeleteButton,
  EditButton,
  ImageField,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table } from "antd";
import { API_URL } from "../../constants";

export const SpaceList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    meta: {
      populate: ["thumnail", "images"],
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title={"Tên"} />
        <Table.Column
          dataIndex="thumnail"
          title={"Hình ảnh đại diện"}
          render={(value: any) => {
            if (!value) {
              return null;
            }
            return (
              <ImageField
                value={API_URL +value?.url}
                alt={value?.name}
                style={{ width: 60, height: 60 }}
              />
            );
          }}
        />
        <Table.Column dataIndex="description" title={"Mô tả"} />
        <Table.Column
          dataIndex="images"
          title={"Hình ảnh"}
          render={(value: any) => {
            return (
              <div style={{ display: "flex", gap: 10 }}>
                {value?.map((item: any) => (
                  <ImageField
                    key={item.id}
                    value={API_URL + item?.url}
                    alt={item?.name}
                    style={{ width: 60, height: 60 }}
                  />
                ))}
              </div>
            );
          }}
        />
        
        {/* <Table.Column dataIndex="height" title={"Chiều dài"} />
        <Table.Column dataIndex="width" title={"Chiều rộng"} /> */}

        <Table.Column
          width={200}
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton
                hideText
                size="small"
                recordItemId={record.documentId}
              />
              <ShowButton
                hideText
                size="small"
                recordItemId={record.documentId}
              />
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
