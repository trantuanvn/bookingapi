import { Show } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Calendar, Card, Col, Row, Table } from "antd";

export const Board = () => {
  const { data } = useList({
    resource: "bookings",
    meta: {
      populate: "*",
    },
  });
  const bookings = data?.data || [];

  const renderDate = (date: any) => {
    const booking = bookings.filter((b: any) => b.date === date);
    return (
      <div>
        {booking.map((b) => (
          <div key={b.id}>{b.code}</div>
        ))}
      </div>
    );
  };
  return (
    <Show title="Board" headerButtons={[]}>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Card title="Calendar" size="small">
            <Calendar cellRender={renderDate} />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Bookings" size="small">
            <Table dataSource={bookings} rowKey="id"  size="small">
              <Table.Column dataIndex="code" title="Code" />
              <Table.Column dataIndex="date" title="Date" />
              <Table.Column dataIndex="start_time" title="Start time" />
              <Table.Column dataIndex="end_time" title="End time" />
              <Table.Column dataIndex="state" title="Status" />
            </Table>
          </Card>
        </Col>
        <Col span={14}>
          <Card title="Map"  size="small">
            <div style={{ height: 500, width: "100%" }}></div>
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
