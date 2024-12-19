import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Card, Form, Input, Typography } from "antd";

const { Title } = Typography;

export const BookingShow = () => {
  const { query } = useShow({
    meta: {
      populate: ["user", "work-space"],
    },
  });
  const { data, isLoading } = query;

  return (
    <Show isLoading={isLoading} breadcrumb={false} headerButtons={[]}>
      <Card title="Booking Details">
        <Form layout="vertical">
          <Form.Item label="Code">
            <Input />
          </Form.Item>

          <Form.Item label="User">
            <Input />
          </Form.Item>
          <Form.Item label="Space / Workspace">
            <Input />
          </Form.Item>
          <Form.Item label="Date">
            <Input />
          </Form.Item>

          <Form.Item label="Time">
            <Input />
          </Form.Item>

          <Form.Item label="Type">
            <Input />
          </Form.Item>

          <Form.Item label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Card>
    </Show>
  );
};
