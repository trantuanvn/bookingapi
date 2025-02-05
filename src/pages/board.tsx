import { NumberField, Show, useModalForm, useSelect } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import {
  Button,
  Calendar,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { API_URL } from "../constants";
import dayjs from "dayjs";
import _ from "lodash";
import { PlusOutlined } from "@ant-design/icons";
import Search from "antd/lib/input/Search";
import ButtonGroup from "antd/es/button/button-group";

const { Title } = Typography;

export const Board = () => {
  const [month, setMonth] = useState(dayjs().format("YYYY-MM-01"));
  const { data, refetch } = useList({
    resource: "bookings",
    meta: {
      populate: ["user", "booking_items.work_space.space", "payments"],
    },
    pagination: {
      pageSize: 100,
    },
    filters: [
      {
        field: "booking_items.date",
        operator: "gte",
        value: month,
      },
      {
        field: "booking_items.date",
        operator: "lte",
        value: dayjs(month).add(1, "month").format("YYYY-MM-01"),
      },
    ],
    sorters: [
      {
        field: "booking_items.date",
        order: "asc",
      },
    ],
  });
  const bookings = data?.data || [];

  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

  const bookingItems: any[] = [];
  bookings.forEach((b) => {
    b.booking_items.forEach((bi: any) => {
      bookingItems.push({
        booking: b,
        ...bi,
      });
    });
  });

  const renderDate = (date: any) => {
    let bookingList = bookingItems.filter((b: any) => b.date === date);
    bookingList = _.uniqBy(bookingList, "booking.code");
    return (
      <div>
        {bookingList.map((b) => (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              padding: "4px",
              border: "1px solid #f0f0f0",
              marginBottom: "4px",
            }}
          />
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
        <Col span={6}>
          <Card title="Calendar" size="small">
            <Calendar
              cellRender={(r) => renderDate(r.format("YYYY-MM-DD"))}
              mode="month"
              onChange={(date) => {
                setDate(date.format("YYYY-MM-DD"));
                setMonth(date.format("YYYY-MM-01"));
              }}
            />
          </Card>
        </Col>
        <Col span={18}>
          <Map date={date} bookingItems={bookingItems} />
        </Col>
        <Col span={24}>
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
                render={(_, r) => <BookingCode booking={r} />}
              />
              <Table.Column
                dataIndex="date"
                title="Date"
                render={(__, r) => _.get(r, "booking_items[0].date")}
              />
              <Table.Column
                dataIndex="start_time"
                title="Time"
                render={(_, r) => {
                  return (
                    <Space direction="vertical">
                      {r.booking_items.map((b: any, idx: number) => (
                        <span>
                          {idx + 1}. {b.start_time} {b.end_time} -{" "}
                          {b.work_space?.name}
                        </span>
                      ))}
                    </Space>
                  );
                }}
              />
              <Table.Column dataIndex="total" title="Total" />
              <Table.Column
                render={(_, r) => {
                  if (r.state == "approved")
                    return <Tag color="green">Paid</Tag>;
                  return <PaymentButton booking={r} />;
                }}
              />
            </Table>
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
const Map = ({ date, bookingItems }: { date: string; bookingItems: any[] }) => {
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

  const [mode, setMode] = useState(localStorage.getItem("modeView") || "space");

  useEffect(() => {
    localStorage.setItem("modeView", mode);
  }, [mode]);

  const spaces = dataSpaces?.data || [];
  const workSpaces = dataWorksSpaces?.data || [];
  const [zoom, setZoom] = useState(Number(localStorage.getItem("zoom") || 1));

  useEffect(() => {
    localStorage.setItem("zoom", zoom.toString());
  }, [zoom]);

  const [wordspaceId, setWorkSpaceId] = useState(
    spaces.length > 0 ? spaces[0].id : ""
  );

  // const allSpaces = spaces.map((s: any) => {
  //   return {
  //     ...s,
  //     workSpaces: workSpaces.filter((w) => w.space?.id == s.id),
  //   };
  // });

  return (
    <Card
      title={
        <Space size="small">
          {date}
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

          <br />
          <br />
          <br />

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
        <ButtonGroup>
          <Button
            onClick={() => setMode("space")}
            type={mode === "space" ? "primary" : "default"}
          >
            Sơ đồ
          </Button>
          <Button
            onClick={() => setMode("time")}
            type={mode === "time" ? "primary" : "default"}
          >
            Thời gian
          </Button>
        </ButtonGroup>
      }
    >
      {mode == "time" && (
        <div>
          <div style={{ display: "flex", marginBottom: "8px" }}>
            <div
              style={{
                textAlign: "center",
                padding: "8px",
                width: "200px",
              }}
            >
              Time
            </div>
            {[...Array(10).keys()].map((i) => {
              const time = `${("00" + (i + 8)).slice(-2)}:00`;
              return (
                <div
                  style={{
                    flex: 1,
                    padding: "8px",
                  }}
                >
                  {time}
                </div>
              );
            })}
          </div>
          {workSpaces.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                marginBottom: "8px",
                border: "1px solid #808080FF",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "8px",
                  width: "200px",
                  borderRight: "1px solid #808080FF",
                }}
              >
                {a.name}
              </div>
              {[...Array(10).keys()].map((i) => {
                const time = `${("00" + (i + 8)).slice(-2)}:00`;
                return (
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    {/* {time} */}

                    {bookingItems
                      .filter(
                        (b) =>
                          b.work_space.id == a.id &&
                          b.date == date &&
                          b.start_time <= time &&
                          b.end_time >= time
                      )
                      .map((a) => (
                        <div
                          key={a.id}
                          style={{
                            background: "#f50",
                            color: "white",
                            height: 35,
                          }}
                        >
                          {a.booking.code}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {mode === "space" &&
        spaces
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
                          seat: "#f50",
                          meeting_room: "#2db7f5",
                          conference_room: "#87d068",
                          lounge: "#108ee9",
                        };
                        return (
                          <Popover
                            key={workspace.id}
                            title={workspace.name}
                            content={
                              <div>
                                <p>Type: {workspace.type}</p>
                                <p>Price: {workspace.price_per_hour} USD</p>
                                <p>Bookings</p>
                              </div>
                            }
                          >
                            <div
                              id={`workspace-${workspace.id}`}
                              style={{
                                position: "absolute",
                                left: workspace.position_x * 100 * zoom + "px",
                                top: workspace.position_y * 100 * zoom + "px",
                                width: workspace.width * 100 * zoom + "px",
                                height: workspace.height * 100 * zoom + "px",
                                background: colors[workspace.type] ?? "black",
                                padding: "4px",
                                opacity: 0.8,
                              }}
                            >
                              <div>
                                <p style={{ margin: 0 }}>
                                  Type: <b>{workspace.type}</b>
                                </p>
                                <p style={{ margin: 0 }}>
                                  Price: {workspace.price_per_hour} USD ={" "}
                                  <NumberField
                                    value={workspace.price_per_hour * 25000}
                                  />{" "}
                                  VND
                                </p>
                                <p style={{ margin: 0 }}>Bookings</p>
                              </div>
                            </div>
                          </Popover>
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
          <p> Items</p>
          <ul>
            {booking.booking_items.map((bi: any, idx: number) => (
              <li key={bi.id}>
                {bi.work_space?.name} - {bi.start_time} - {bi.end_time} -{" "}
                {bi.total} USD
              </li>
            ))}
          </ul>
          <p>Payments</p>
          <ul>
            {booking.payments.map((p: any, idx: number) => (
              <li key={p.id}>
                {p.amount} USD - {p.payment_method}
              </li>
            ))}
          </ul>
        </Card>
      }
    >
      {tag}
    </Popover>
  );
};

const PaymentButton = ({ booking }: { booking: any }) => {
  const { modalProps, formProps, show, close } = useModalForm({
    resource: "payments",
    action: "create",
  });
  return (
    <>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          show();
        }}
      >
        Payment
      </Button>

      <Modal {...modalProps} width={400}>
        <Form
          {...formProps}
          onFinish={(values: any) => {
            return formProps.onFinish?.({
              ...values,
              booking: booking.documentId,
              user: booking.user.id,
            });
          }}
          initialValues={{
            amount: booking.total - booking.totalPayment,
            payment_method: "cash",
          }}
          layout="vertical"
        >
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber disabled />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input />
          </Form.Item>
          <Form.Item name="ref_code" label="Ref code">
            <Input />
          </Form.Item>
          <Form.Item name="payment_method" label="Payment Method">
            <Select>
              <Select.Option value="cash">Tiền mặt</Select.Option>
              <Select.Option value="debit">Nợ</Select.Option>
              <Select.Option value="banking">Chuyển khoản</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
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

  const timeMode = Form.useWatch("time_mode", formProps.form);
  useEffect(() => {
    if (timeMode === "morning") {
      formProps.form?.setFieldsValue({
        start_time: "08:00",
        end_time: "12:00",
      });
    }
    if (timeMode === "afternoon") {
      formProps.form?.setFieldsValue({
        start_time: "13:00",
        end_time: "17:00",
      });
    }

    if (timeMode === "allday") {
      formProps.form?.setFieldsValue({
        start_time: "08:00",
        end_time: "17:00",
      });
    }
  }, [timeMode]);

  const bookingItems = Form.useWatch("booking_items", formProps.form) || [];
  const date = Form.useWatch("date", formProps.form);
  const startTime = Form.useWatch("start_time", formProps.form);
  const endTime = Form.useWatch("end_time", formProps.form);
  const offet = dayjs(date + " " + endTime).diff(
    date + " " + startTime,
    "minute"
  );
  const total = _.sumBy(bookingItems, "price") * (offet / 60);

  const [isPayment, setIsPayment] = useState(false);

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
            end_time: "12:00",
            booking_items: [{}],
            type: "single",
            time_mode: "morning",
          }}
          layout="vertical"
          onFinish={(values: any) => {
            const date = dayjs(values.date).format("YYYY-MM-DD");
            const offsetTime = dayjs(date + " " + values.end_time).diff(
              date + " " + values.start_time,
              "minute"
            );
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
            };
            if (isPayment) {
              dataSend.payment = {
                note: values.payment?.note,
                ref_code: values.payment?.ref_code,
                payment_method: values.payment?.payment_method,
                state: "DONE",
                payment_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              };
            }
            return formProps.onFinish?.(dataSend);
          }}
        >
          <Row gutter={[12, 0]}>
            <Col span={4}>
              <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="single">Single</Select.Option>
                  <Select.Option value="subscription">
                    Subscription
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="date"
                label="Date"
                getValueProps={(i) => ({ value: dayjs(i) })}
                rules={[{ required: true }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="time_mode"
                label="Time mode"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="morning">Morning</Select.Option>
                  <Select.Option value="afternoon">Afternoon</Select.Option>
                  <Select.Option value="allday">All day</Select.Option>
                  <Select.Option value="custom">Custom</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
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
            <Col span={4}>
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
                                label="Giá"
                                name={[field.name, "price"]}
                              >
                                <InputNumber suffix="USD" />
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
              <br />
            </Col>
            <Col span={10}>
              <Card title="Summary" size="small">
                <p>Total time: {offet} min</p>
                <p>
                  Total payment: {total}USD ={" "}
                  <NumberField value={total * 25000} />
                  VND
                </p>
                <p>Total seat/room: {bookingItems?.length}</p>
                <Divider />

                <Form.Item name="description" label="Note">
                  <Input.TextArea />
                </Form.Item>
              </Card>
            </Col>
            <Col span={14}>
              <Card
                title={
                  <Space>
                    <Switch
                      size="small"
                      checked={isPayment}
                      onChange={() => setIsPayment(!isPayment)}
                      title="Payment"
                    />
                    Payment
                  </Space>
                }
                size="small"
              >
                {isPayment && (
                  <>
                    <Form.Item name={["payment", "ref_code"]} label="Ref code">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={["payment", "payment_method"]}
                      label="Payment Method"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Select.Option value="cash">Tiền mặt</Select.Option>
                        <Select.Option value="debit">Nợ</Select.Option>
                        <Select.Option value="banking">
                          Chuyển khoản
                        </Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name={["payment", "note"]} label="Note">
                      <Input.TextArea />
                    </Form.Item>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
