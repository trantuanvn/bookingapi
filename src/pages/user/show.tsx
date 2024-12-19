import { DateField, MarkdownField, Show, useTable } from "@refinedev/antd";
import { useList, useOne, useShow } from "@refinedev/core";
import { Card, Form, Input, Table, Typography } from "antd";

const { Title } = Typography;

export const UserShow = () => {
  const { query } = useShow({
    meta: {
      populate: "avatar",
    },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const { tableProps: tablePropsSubsciption } = useTable({
    resource: "subscription",
    filters: {
      permanent: [
        {
          field: "user.documentId",
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
          field: "user.documentId",
          operator: "eq",
          value: record?.id,
        },
      ],
    },
  });

  return (
    <Show breadcrumb={null} isLoading={isLoading}>
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
          <Table.Column title="Plan" dataIndex="plan" />
          <Table.Column title="Start Date" dataIndex="startDate" />
          <Table.Column title="End Date" dataIndex="endDate" />
          <Table.Column title="Status" dataIndex="status" />
        </Table>
      </Card>
      <br />
      <Card title="Payment">
        <Table {...tablePropsPayment}>
          <Table.Column title="Payment Method" dataIndex="paymentMethod" />
          <Table.Column title="Amount" dataIndex="amount" />
          <Table.Column title="Status" dataIndex="status" />
          <Table.Column title="Created At" dataIndex="createdAt" />
        </Table>
      </Card>
    </Show>
  );
};
