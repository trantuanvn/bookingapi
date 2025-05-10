import { DateField, MarkdownField, Show, useTable } from "@refinedev/antd";
import { useList, useOne, useShow } from "@refinedev/core";
import { Card, Form, Input, Table, Typography } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

export const UserShow = () => {
  const { query } = useShow({
    meta: {
      populate: ["avatar", "role", "currentPlan"],
    },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const { tableProps: tablePropsSubsciption } = useTable({
    resource: "subscriptions",
    meta: {
      populate: ["plan"],
    },
    filters: {
      permanent: [
        {
          field: "user.id",
          operator: "eq",
          value: record?.id,
        },
      ],
    },
  });

  const { tableProps: tablePropsPayment } = useTable({
    resource: "payments",

    filters: {
      permanent: [
        {
          field: "user",
          operator: "eq",
          value: record?.id,
        },
      ],
    },
  });

  return (
    <Show breadcrumb={null} isLoading={isLoading} headerButtons={[]}>
      {record && (
        <Card title="Thông tin">
          <Form
            layout="vertical"
            initialValues={{
              ...record,
            }}
            disabled
          >
            <Form.Item name="username" label="Tên đăng nhập">
              <Input placeholder="Nhập tên" />
            </Form.Item>
            <Form.Item name="fullName" label="Tên đầy đủ">
              <Input placeholder="Nhập tên" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input placeholder="Nhập email" />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Số điện thoại">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Form>
        </Card>
      )}
      <br />
      <Card title="Subscription">
        <Table {...tablePropsSubsciption}>
          <Table.Column
            title="Gói dịch vụ"
            dataIndex={["plan", "name"]}
            render={(value) => value || "-"}
          />
          <Table.Column
            title="Ngày bắt đầu"
            dataIndex="start"
            render={(value) => (
              <DateField value={value} format="DD/MM/YYYY hh:mm" />
            )}
          />
          <Table.Column
            title="Ngày hết hạn"
            dataIndex="end"
            render={(value, record) => {
              const offsetMonth = dayjs(value).diff(
                dayjs(record.start),
                "month"
              );
              const offsetYear = dayjs(value).diff(dayjs(record.start), "year");
              const text = offsetYear > 0 ? offsetYear : offsetMonth;
              const unit = offsetYear > 0 ? "year" : "month";
              return (
                <span>
                  <DateField value={value} format="DD/MM/YYYY hh:mm" />
                  {new Date(value).getTime() < new Date().getTime()
                    ? " (Expired)"
                    : ""}{" "}
                  (gói {text} {unit} )
                </span>
              );
            }}
          />
          <Table.Column
            title="Trạng thái"
            dataIndex="state"
            render={(value) => (
              <span>
                {value === "active" ? (
                  <span style={{ color: "green" }}>Active</span>
                ) : (
                  <span style={{ color: "red" }}>Inactive</span>
                )}
              </span>
            )}
          />
        </Table>
      </Card>
      <br />
      <Card title="Payment">
        <Table {...tablePropsPayment}>
          <Table.Column title="" dataIndex="payment_method" />
          <Table.Column title="Amount" dataIndex="amount" />
          <Table.Column title="Status" dataIndex="state" />
          <Table.Column
            title="payment_date"
            dataIndex="payment_date"
            render={(value) => (
              <DateField value={value} format="DD/MM/YYYY hh:mm" />
            )}
          />
        </Table>
      </Card>
    </Show>
  );
};
