import { Show } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import {
  Button,
  Calendar,
  Card,
  Col,
  InputNumber,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { useState } from "react";
import { API_URL } from "../constants";

const { Title } = Typography;

export const Board = () => {
  const { data } = useList({
    resource: "booking-items",
    meta: {
      populate: "*",
    },
  });
  const bookings = data?.data || [];

  const { data: dataSpaces } = useList({
    resource: "spaces",
    meta: {
      populate: "*",
    },
  });

  const { data: dataWorksSpaces } = useList({
    resource: "work-spaces",
    meta: {
      populate: "*",
    },
  });

  const spaces = dataSpaces?.data || [];
  const workSpaces = dataWorksSpaces?.data || [];

  const renderDate = (date: any) => {
    const booking = bookings.filter((b: any) => b.date === date);
    return (
      <div>
        {booking.map((b) => (
          <div key={b.id}>
            {b.booking?.code} - {b.start_time}-{b.end_time} -{" "}
            {b.work_space?.name}
          </div>
        ))}
      </div>
    );
  };
  const [zoom, setZoom] = useState(1);
  return (
    <Show title="Board" headerButtons={[]}>
      <Row gutter={[12, 12]}>
        <Col span={8}>
          <Card title="Bookings" size="small">
            <Table dataSource={bookings} rowKey="id" size="small">
              <Table.Column dataIndex={["booking", "code"]} title="Code" />
              <Table.Column dataIndex="date" title="Date" />
              <Table.Column dataIndex="start_time" title="Start time" />
              <Table.Column dataIndex="end_time" title="End time" />
              <Table.Column dataIndex="state" title="Status" />
              <Table.Column dataIndex={["work_space", "name"]} title="Status" />
            </Table>
          </Card>
        </Col>
        <Col span={14}>
          <Card title="Calendar" size="small">
            <Calendar
              cellRender={(r) => renderDate(r.format("YYYY-MM-DD"))}
              mode="month"
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title={
              <Space size="small">
                <Title level={5} style={{ margin: 0, marginRight: 24 }}>
                  Map
                </Title>
                <Button size="small" onClick={() => setZoom(zoom - 0.01)}>
                  -
                </Button>
                <InputNumber
                  value={Math.round(zoom * 100)}
                  suffix="%"
                  onChange={(value) => {
                    setZoom((value || 0) / 100);
                  }}
                />
                <Button size="small" onClick={() => setZoom(zoom + 0.01)}>
                  +
                </Button>
              </Space>
            }
            size="small"
          >
            {spaces.map((s: any) => {
              const bg = API_URL + s.background?.url || "";
              return (
                <div key={s.id}>
                  <Title level={5}>{s.name}</Title>
                  <div
                    id="space"
                    style={{
                      overflow: "auto",
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        width: s.width * 100 * zoom + "px",
                        height: s.height * 100 * zoom + "px",
                        backgroundImage: `url(${bg})`,
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "yellow",
                        backgroundSize: "100% auto",
                        position: "relative",
                      }}
                    >
                      {workSpaces.map((workspace: any) => {
                        const colors: any = {
                          seat: "red",
                          meeting_room: "blue",
                          conference_room: "green",
                          lounge: "yellow",
                        };
                        return (
                          <div
                            key={workspace.id}
                            id={`workspace-${workspace.id}`}
                            style={{
                              position: "absolute",
                              left: workspace.position_x * 100 * zoom + "px",
                              top: workspace.position_y * 100 * zoom + "px",
                              width: workspace.width * 100 * zoom + "px",
                              height: workspace.height * 100 * zoom + "px",
                              background: colors[workspace.type] ?? "black",
                              opacity: 0.6,
                            }}
                            draggable
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
