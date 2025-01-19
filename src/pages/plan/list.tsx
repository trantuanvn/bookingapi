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
import { Avatar, Space, Table, Tag } from "antd";
import { API_URL } from "../../constants";

export const PlanList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    meta: {},
    sorters: {
      initial: [
        {
          field: "order",
          order: "asc",
        },
      ],
    },
  });

  return (
    <List breadcrumb={null}>
      <Table {...tableProps} rowKey="documentId">
        <Table.Column dataIndex="order" title={"STT"} />
        <Table.Column
          dataIndex="code"
          title={"Mã"}
          render={(i, r) => (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ height: 24, width: 24, background: r.color }}></div>
              {i}
            </div>
          )}
        />
        <Table.Column dataIndex="name" title={"Tên"} />
        <Table.Column
          dataIndex="price"
          title={"Giá / tháng"}
          render={(v) => <>{v} USD</>}
        />
        <Table.Column
          dataIndex="allow_work_space"
          title={"Loại bàn / phòng cung cấp"}
          render={(r, i) => (
            <div>
              {r.split(",").map((a: string) => (
                <Tag key={a}>
                  {a == "coworking_desk" ? "Bàn chung" : ""}
                  {a == "lounge_desk" ? "Bàn riêng" : ""}
                  {a == "meeting_room" ? "Phòng họp" : ""}
                  {a == "conference_room" ? "Phòng hội nghị" : ""}
                </Tag>
              ))}
              <hr />
              <p>{i.description}</p>
            </div>
          )}
        />
        <Table.Column
          dataIndex="max_booking_per_week"
          title={"Ưu đãi"}
          render={(v, r) => (
            <p>
              Đặt bàn {v} lần/ tuần <br />
              Đặt phòng {r.max_time_booking_room}h / tháng
            </p>
          )}
        />
        <Table.Column
          dataIndex={["productId"]}
          title={"Product"}
          render={(_, r) => (
            <p>
              Apple: {r.apple_product_id}
              <br />
              Google: {r.google_product_id}
            </p>
          )}
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
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
