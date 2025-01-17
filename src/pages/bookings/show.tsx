import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Card, Col, Form, Input, Row, Table, Typography } from "antd";

const { Title } = Typography;

export const BookingShow = () => {
  const { query } = useShow({
    meta: {
      populate: ["user", "booking_items.work_space.space"],
    },
  });
  const { data, isLoading } = query;

  const record = data?.data || {};

  return (
    <Show isLoading={isLoading} breadcrumb={false} headerButtons={[]}>
      {record?.id && (
        <Row gutter={12}>
          <Col span={12}>
            <Card title="Booking Details">
              <Form layout="vertical" disabled initialValues={{ ...record }}>
                <Form.Item label="Code">
                  <Input value={record.code} />
                </Form.Item>

                <Form.Item label="User">
                  <Input value={record.user?.username} />
                </Form.Item>
                <Form.Item label="Type">
                  <Input value={record.type} />
                </Form.Item>

                <Form.Item label="Description">
                  <Input value={record.description} />
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Booking Items">
              <Table
                dataSource={record.booking_items}
                rowKey="id"
                pagination={false}
              >
                <Table.Column
                  dataIndex="work_space"
                  title={"Space / Workspace"}
                  render={(r) => `${r?.space?.name} - ${r?.name}`}
                />
                <Table.Column
                  dataIndex="date"
                  title={"Date"}
                  render={(v, r) => `${v} ${r.start_time}-${r.end_time}`}
                />
              </Table>
            </Card>
          </Col>
        </Row>
      )}
    </Show>
  );
};
