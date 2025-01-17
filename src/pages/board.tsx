import { Show, useModalForm, useSelect } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import {
  Button,
  Calendar,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { API_URL } from "../constants";
import dayjs from "dayjs";
import { start } from "repl";
import _ from "lodash";
import { PlusOutlined } from "@ant-design/icons";
import Search from "antd/lib/input/Search";
import ButtonGroup from "antd/es/button/button-group";

const { Title } = Typography;

export const Board = () => {
  const { data, refetch } = useList({
    resource: "booking-items",
    meta: {
      populate: "*",
    },
    pagination: {
      pageSize: 100,
    },
    filters: [
      {
        field: "date",
        operator: "gte",
        value: dayjs().format("YYYY-MM-DD"),
      },
    ],
    sorters: [
      {
        field: "date",
        order: "asc",
      },
    ],
  });
  const bookings = data?.data || [];

  const renderDate = (date: any) => {
    let bookingList = bookings.filter((b: any) => b.date === date);
    bookingList = _.uniqBy(bookingList, "booking.code");
    return (
      <div>
        {bookingList.map((b) => (
          <BookingCode key={b.booking.code} booking={b.booking} />
        ))}
      </div>
    );
  };
  return (
    <Show
      title="Board"
      headerButtons={[
        <Search
          placeholder="input search text"
          onSearch={(value) => console.log(value)}
        />,
        <CreateBooking
          onDone={() => {
            refetch();
          }}
        />,
      ]}
    >
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Card title="Bookings" size="small">
            <Table
              dataSource={bookings}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 20 }}
            >
              <Table.Column
                dataIndex={["booking"]}
                title="Code"
                render={(r) => <BookingCode booking={r} />}
              />
              <Table.Column dataIndex="date" title="Date" />
              <Table.Column
                dataIndex="start_time"
                title="Time"
                render={(_, r) => {
                  return r.start_time + " - " + r.end_time;
                }}
              />
              {/* <Table.Column dataIndex="state" title="Status" /> */}
              <Table.Column dataIndex={["work_space", "name"]} title="Status" />
              <Table.Column dataIndex="total" title="Total" />
              <Table.Column
                render={(_, r) => {
                  return <PaymentButton booking={r} />;
                }}
              />
            </Table>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Calendar" size="small">
            <Calendar
              cellRender={(r) => renderDate(r.format("YYYY-MM-DD"))}
              mode="month"
            />
          </Card>
        </Col>
        <Col span={24}>
          <Map />
        </Col>
      </Row>
    </Show>
  );
};
const Map = () => {
  const { data: dataSpaces } = useList({
    resource: "spaces",
    meta: {
      populate: "*",
    },
    pagination: {
      pageSize: 100,
    },
  });

  const { data: dataWorksSpaces } = useList({
    resource: "work-spaces",
    meta: {
      populate: "*",
    },
    pagination: {
      pageSize: 100,
    },
  });

  const spaces = dataSpaces?.data || [];
  const workSpaces = dataWorksSpaces?.data || [];
  const [zoom, setZoom] = useState(1);

  const [wordspaceId, setWorkSpaceId] = useState(0);
  return (
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
      extra={
        <ButtonGroup style={{ marginRight: 10 }}>
          {spaces.map((s: any) => {
            return (
              <Button
                key={s.id}
                onClick={() => setWorkSpaceId(s.id)}
                type={wordspaceId === s.id ? "primary" : "default"}
              >
                {s.name}
              </Button>
            );
          })}
        </ButtonGroup>
      }
      size="small"
    >
      {spaces
        .filter((a) => a.id == wordspaceId)
        .map((s: any) => {
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

                    // backgroundColor: "yellow",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      backgroundImage: `url(${bg})`,
                      backgroundRepeat: "no-repeat",
                      position: "absolute",
                      backgroundSize: "100% 100%",  
                      top: 0,
                      bottom: 0,

                      width: s.width * 100 * zoom + "px",
                      height: s.height * 100 * zoom + "px",
                      opacity: 0.6,
                    }}
                  />
                  {workSpaces
                    .filter((a) => a.space?.id == s.id)
                    .map((workspace: any) => {
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
  );
};

const BookingCode = ({ booking }: { booking: any }) => {
  let tag = <Tag color="blue">{booking.code}</Tag>;
  if (booking.state == "pending") {
    tag = <Tag color="red">{booking.code}</Tag>;
  }
  if (booking.state == "approved") {
    tag = <Tag color="green">{booking.code}</Tag>;
  }

  return (
    <Popover
      title="Booking Detail"
      content={
        <Card size="small">
          <p>Code: {booking.code}</p>
          <p>Status: {booking.state}</p>
          <p>Total: {booking.total}</p>
          <p>Total Payment: {booking.totalPayment}</p>
        </Card>
      }
    >
      {tag}
    </Popover>
  );
};

const PaymentButton = ({ booking }: { booking: any }) => {
  return (
    <Button type="primary" size="small">
      Payment
    </Button>
  );
};

const CreateBooking = ({ onDone }: { onDone: any }) => {
  const { modalProps, formProps, show, close } = useModalForm({
    action: "create",
    resource: "bookings",
    redirect: false,
    onMutationSuccess: () => {
      onDone();
    },
  });
  const { data: dataWorkSpace } = useList({
    resource: "work-spaces",
    meta: {
      populate: "*",
    },
    pagination: {
      pageSize: 100,
    },
  });
  const { data } = useList({
    resource: "users",
    meta: {
      populate: "*",
    },
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "1",
      },
    ],
  });

  const userList = data?.data || [];
  const workSpaces = dataWorkSpace?.data || [];

  const userId = Form.useWatch("user", formProps.form);
  useEffect(() => {
    const user = userList.find((u) => u.id === userId);
    if (user) {
      formProps.form?.setFieldsValue({
        name: user.full_name || user.username,
        phone: user.phoneNumber,
        email: user.email,
      });
    }
  }, [userId, userList]);

  const times = [];
  for (let i = 8; i < 22; i++) {
    times.push(("00" + i).slice(-2) + ":00");
    times.push(("00" + i).slice(-2) + ":30");
  }
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          show();
        }}
        icon={<PlusOutlined />}
      >
        Create Booking
      </Button>

      <Modal {...modalProps}>
        <Form
          {...formProps}
          initialValues={{
            date: dayjs().format("YYYY-MM-DD"),
            start_time: "08:00",
            end_time: "08:30",
            booking_items: [{}],
          }}
          layout="vertical"
          onFinish={(values: any) => {
            const date = dayjs(values.date).format("YYYY-MM-DD");
            const offsetTime = dayjs(date + " " + values.end_time).diff(
              date + " " + values.start_time,
              "minute"
            );
            console.log("offsetTime", offsetTime);
            const booking_items = values.booking_items.map((b: any) => ({
              work_space: b.work_space,
              start_time: values.start_time,
              end_time: values.end_time,
              date: date,
              price: b.price,
              total: b.price * (offsetTime / 60),
              quantity: b.quantity || 1,
            }));
            const dataSend = {
              ...values,
              booking_items: booking_items,
              total: _.sumBy(booking_items, "total"),
              totalPayment: 0,
            };
            return formProps.onFinish?.(dataSend);
          }}
        >
          <Row gutter={[12, 0]}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Date"
                getValueProps={(i) => ({ value: dayjs(i) })}
                rules={[{ required: true }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="start_time"
                label="Start time"
                rules={[{ required: true }]}
              >
                <Select>
                  {times.map((t) => (
                    <Select.Option key={t} value={t}>
                      {t}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="end_time"
                label="End time"
                rules={[{ required: true }]}
              >
                <Select>
                  {times.map((t) => (
                    <Select.Option key={t} value={t}>
                      {t}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item name="user" label="User">
                <Select>
                  {userList.map((u) => (
                    <Select.Option key={u.id} value={u.id}>
                      {u.username}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Card title="Booking Items" size="small">
                <Form.List name="booking_items">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => {
                        return (
                          <Row gutter={12} key={field.key}>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                key={field.key}
                                label="Work Space"
                                rules={[{ required: true }]}
                                name={[field.name, "work_space"]}
                              >
                                <Select>
                                  {workSpaces.map((w) => (
                                    <Select.Option key={w.id} value={w.id}>
                                      {w.type} - {w.name} | {w.space?.name} (
                                      {w.price_per_hour} USD)
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                {...field}
                                key={field.key}
                                rules={[{ required: true }]}
                                label="Price per hour"
                                name={[field.name, "price"]}
                              >
                                <InputNumber />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                {...field}
                                key={field.key}
                                label="Quantity"
                                name={[field.name, "quantity"]}
                                initialValue={1}
                              >
                                <InputNumber value={1} disabled />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <div style={{ height: "28px" }} />
                              <Button block onClick={() => remove(index)}>
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        );
                      })}
                      <Button onClick={() => add()}>Add</Button>
                    </>
                  )}
                </Form.List>
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
