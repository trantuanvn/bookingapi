import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Card, Form, Input, Typography } from "antd";

const { Title } = Typography;

export const BookingShow = () => {
  const { query } = useShow({
    meta: {
      populate: ["user", "work_space.space"],
    },
  });
  const { data, isLoading } = query;

  const record = data?.data || {};

  return (
    <Show isLoading={isLoading} breadcrumb={false} headerButtons={[]}>
      {record?.id && (
        <Card title="Booking Details">
          <Form layout="vertical" disabled initialValues={{ ...record }}>
            <Form.Item label="Code">
              <Input value={record.code} />
            </Form.Item>

            <Form.Item label="User">
              <Input value={record.user?.username} />
            </Form.Item>
            <Form.Item label="Space / Workspace">
              <Input
                value={`${record?.work_space?.space.name} /  ${record.work_space.name} `}
              />
            </Form.Item>
            <Form.Item label="Date">
              <DateField value={record.start} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item label="Start Time">
              <DateField value={record.start} format="HH:mm" />
            </Form.Item>

            <Form.Item label="end Time">
              <DateField value={record.end} format="HH:mm" />
            </Form.Item>

            <Form.Item label="Type">
              <Input value={record.type} />
            </Form.Item>

            <Form.Item label="Description">
              <Input value={record.description} />
            </Form.Item>
          </Form>
        </Card>
      )}
    </Show>
  );
};
