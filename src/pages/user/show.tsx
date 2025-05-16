import { DeleteOutlined } from "@ant-design/icons";
import {
  DateField,
  DeleteButton,
  MarkdownField,
  Show,
  useModalForm,
  useSelect,
  useTable,
} from "@refinedev/antd";
import { useList, useOne, useShow } from "@refinedev/core";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("en");
dayjs.locale("vi");

const { Title } = Typography;

export const UserShow = () => {
  const { id } = useParams();
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
    initialSorter: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
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
  const modalFormNew = useModalForm({
    action: "create",
    resource: "subscriptions",
    redirect: false,
  });

  const time = Form.useWatch("time", modalFormNew?.formProps?.form);
  const start = Form.useWatch("start", modalFormNew?.formProps?.form);

  useEffect(() => {
    if (time && start && modalFormNew?.formProps?.form) {
      const end = dayjs(start).add(time, "month");
      modalFormNew.formProps.form.setFieldValue("end", end);
    }
  }, [time, start, modalFormNew?.formProps?.form]);

  const modalFormExpand = useModalForm({
    action: "edit",
    resource: "subscriptions",
    redirect: false,
  });

  const timeExpand = Form.useWatch("time", modalFormExpand?.formProps?.form);
  const startExpand = Form.useWatch("start", modalFormExpand?.formProps?.form);

  useEffect(() => {
    if (timeExpand && startExpand && modalFormExpand?.formProps?.form) {
      const end = dayjs(startExpand).add(timeExpand, "month");
      modalFormExpand.formProps.form.setFieldValue("end", end);
    }
  }, [timeExpand, startExpand, modalFormExpand?.formProps?.form]);

  const valuesExpand = modalFormExpand.formProps?.initialValues;

  const modalFormUpgrade = useModalForm({
    action: "edit",
    resource: "subscriptions",
    redirect: false,
    meta: {
      populate: ["plan"],
    },
  });
  const valuesUpgrade = modalFormUpgrade.formProps?.initialValues;

  const { selectProps: selectPropsPlan } = useSelect({
    resource: "plans",
    optionLabel: "name",
    optionValue: "documentId",
  });

  const modalFormPaymentNew = useModalForm({
    action: "create",
    resource: "payments",
    redirect: false,
  });

  const modalFormPaymentEdit = useModalForm({
    action: "create",
    resource: "payments",
    redirect: false,
  });

  return (
    <Show
      breadcrumb={null}
      isLoading={isLoading}
      headerButtons={[]}
      title={<Title level={5}>Thông tin người dùng: {record?.username}</Title>}
    >
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
      <Card
        title="Gói dịch vụ hiện tại"
        extra={
          <Button
            type="primary"
            onClick={() => {
              modalFormNew.show();
              const last = _.last(
                _.sortBy(tablePropsSubsciption?.dataSource, "end", "asc")
              );
              console.log("last", last);
              if (modalFormNew.formProps.form && last) {
                modalFormNew.formProps.form.setFieldValue("user", id);
                modalFormNew.formProps.form.setFieldValue(
                  "start",
                  dayjs(last.end || new Date())
                );
              }
            }}
          >
            Thêm gói dịch vụ
          </Button>
        }
      >
        <Table
          {...tablePropsSubsciption}
          pagination={{
            hideOnSinglePage: true,
          }}
        >
          <Table.Column
            title="Gói dịch vụ"
            dataIndex={["plan", "name"]}
            render={(value) => value || "-"}
          />
          <Table.Column
            title="Ngày bắt đầu"
            dataIndex="start"
            render={(value) => <DateField value={value} format="DD/MM/YYYY" />}
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
          {/* <Table.Column
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
          /> */}
          <Table.Column
            title="Ngày tạo"
            dataIndex="createdAt"
            render={(value) => (
              <DateField value={value} format="DD/MM/YYYY hh:mm" />
            )}
          />
          <Table.Column
            title="Hành động"
            dataIndex="actions"
            render={(_, record) => {
              return (
                <Space>
                  <DeleteButton
                    resource="subscriptions"
                    hideText
                    size="small"
                    recordItemId={record.documentId}
                  />

                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      modalFormExpand.show(record.documentId);
                    }}
                  >
                    Gia hạn
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      modalFormUpgrade.show(record.documentId);
                    }}
                  >
                    Nâng cấp
                  </Button>
                </Space>
              );
            }}
          />
        </Table>
      </Card>
      <br />
      <Card
        title="Lịch sử thanh toán"
        extra={
          <Button
            type="primary"
            onClick={() => {
              modalFormPaymentNew.show();
              modalFormPaymentNew?.formProps?.form?.setFieldValue("user", id);
            }}
          >
            Thêm thanh toán
          </Button>
        }
      >
        <Table
          {...tablePropsPayment}
          pagination={{
            hideOnSinglePage: true,
          }}
        >
          {/* <Table.Column title="" dataIndex="code" /> */}
          <Table.Column
            title="Phương thức thanh toán"
            dataIndex="payment_method"
            render={(value) => {
              if (value === "bankTransfer") {
                return "Chuyển khoản";
              }
              if (value === "cash") {
                return "Tiền mặt";
              }
              if (value === "creditCard") {
                return "Thẻ tín dụng";
              }
              return value;
            }}
          />
          <Table.Column title="Số tiền" dataIndex="amount" />
          <Table.Column
            title="Trạng thái"
            dataIndex="state"
            render={(value) => {
              if (value == "completed") {
                return <span style={{ color: "green" }}>Đã thanh toán</span>;
              }
              if (value == "pending") {
                return <span style={{ color: "orange" }}>Chờ thanh toán</span>;
              }
              if (value == "failed") {
                return <span style={{ color: "red" }}>Thất bại</span>;
              }
            }}
          />
          <Table.Column
            title="Ngày thanh toán"
            dataIndex="payment_date"
            render={(value) => (
              <DateField value={value} format="DD/MM/YYYY hh:mm" />
            )}
          />

          <Table.Column
            title="Ghi chú"
            dataIndex="note"
            render={(value) => <MarkdownField value={value} />}
          />
          <Table.Column
            title="Hành động"
            dataIndex="actions"
            render={(_, record) => {
              return (
                <Space>
                  <DeleteButton
                    resource="payments"
                    hideText
                    size="small"
                    recordItemId={record.documentId}
                  />
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      modalFormPaymentEdit.show(record.documentId);
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                </Space>
              );
            }}
          />
        </Table>
      </Card>

      <Modal {...modalFormExpand.modalProps} width={600}>
        <Form
          {...modalFormExpand.formProps}
          layout="vertical"
          initialValues={{
            ...valuesExpand,
            start: valuesExpand?.start ? dayjs(valuesExpand?.start) : null,
            end: valuesExpand?.end ? dayjs(valuesExpand?.end) : null,
            time: dayjs(valuesExpand?.end).diff(
              dayjs(valuesExpand?.start),
              "month"
            ),
          }}
        >
          <Form.Item
            label={"Ngày bắt đầu"}
            name={["start"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label={"Thời gian"} name={["time"]}>
            <Select
              options={[
                {
                  label: "1 tháng",
                  value: 1,
                },
                {
                  label: "3 tháng",
                  value: 3,
                },
                {
                  label: "6 tháng",
                  value: 6,
                },
                {
                  label: "1 năm",
                  value: 12,
                },
                {
                  label: "2 năm",
                  value: 24,
                },
                {
                  label: "3 năm",
                  value: 36,
                },
              ]}
              style={{ width: "100%" }}
              placeholder="Thời gian"
            />
          </Form.Item>
          <Form.Item label={"Ngày kết thúc"} name={["end"]}>
            <DatePicker disabled />
          </Form.Item>
          <Divider />
          <h3>Thanh toán</h3>

          <Form.Item
            label={"Hình thức thanh toán"}
            name={["paymentMethod"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={[
                {
                  label: "Chuyển khoản",
                  value: "bankTransfer",
                },
                {
                  label: "Tiền mặt",
                  value: "cash",
                },
                {
                  label: "Thẻ tín dụng",
                  value: "creditCard",
                },
              ]}
              style={{ width: "100%" }}
              placeholder="Hình thức thanh toán"
            />
          </Form.Item>
          <Form.Item label={"Ghi chú"} name={["note"]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal {...modalFormUpgrade.modalProps} width={600}>
        <Form
          {...modalFormUpgrade.formProps}
          layout="vertical"
          initialValues={{
            ...valuesUpgrade,
            plan: valuesUpgrade?.plan?.documentId,
            start: dayjs(valuesUpgrade?.start),
            end: dayjs(valuesUpgrade?.end),
            time: dayjs(valuesUpgrade?.end).diff(
              dayjs(valuesUpgrade?.start),
              "month"
            ),
          }}
        >
          <Form.Item label={"Gói dịch vụ"} name={["plan"]}>
            <Select
              {...selectPropsPlan}
              style={{ width: "100%" }}
              placeholder="Gói dịch vụ"
            />
          </Form.Item>
          <Divider />
          <h3>Thanh toán</h3>

          <Form.Item
            label={"Hình thức thanh toán"}
            name={["paymentMethod"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={[
                {
                  label: "Chuyển khoản",
                  value: "bankTransfer",
                },
                {
                  label: "Tiền mặt",
                  value: "cash",
                },
                {
                  label: "Thẻ tín dụng",
                  value: "creditCard",
                },
              ]}
              style={{ width: "100%" }}
              placeholder="Hình thức thanh toán"
            />
          </Form.Item>
          <Form.Item
            label={"Số tiền"}
            name={["amount"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label={"Ghi chú"} name={["note"]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal {...modalFormNew.modalProps} width={600}>
        <Form
          {...modalFormNew.formProps}
          layout="vertical"
          initialValues={{
            ...modalFormNew.formProps?.initialValues,
            // start: dayjs(modalFormNew.formProps?.initialValues?.start),
            // end: dayjs(modalFormNew.formProps?.initialValues?.end),
            start: null,
            end: null,
            // time: 1,
          }}
        >
          <Form.Item
            label={"Người dùng"}
            name={["user"]}
            initialValue={id}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name={["plan"]}
            label={"Gói dịch vụ"}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select {...selectPropsPlan} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label={"Ngày bắt đầu"}
            name={["start"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label={"Thời gian"}
            name={["time"]}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={1}
          >
            <Select
              options={[
                {
                  label: "1 tháng",
                  value: 1,
                },
                {
                  label: "3 tháng",
                  value: 3,
                },
                {
                  label: "6 tháng",
                  value: 6,
                },
                {
                  label: "1 năm",
                  value: 12,
                },
                {
                  label: "2 năm",
                  value: 24,
                },
                {
                  label: "3 năm",
                  value: 36,
                },
              ]}
              style={{ width: "100%" }}
              placeholder="Thời gian"
            />
          </Form.Item>
          <Form.Item label={"Ngày kết thúc"} name={["end"]}>
            <DatePicker disabled />
          </Form.Item>
          <Card title="Thanh toán">
            <Form.Item
              label={"Hình thức thanh toán"}
              name={["paymentMethod"]}
              initialValue={null}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                options={[
                  // {
                  //   label: "Không có",
                  //   value: null,
                  // },
                  {
                    label: "Chuyển khoản",
                    value: "bankTransfer",
                  },
                  {
                    label: "Tiền mặt",
                    value: "cash",
                  },
                  {
                    label: "Thẻ tín dụng",
                    value: "creditCard",
                  },
                ]}
                style={{ width: "100%" }}
                placeholder="Hình thức thanh toán"
              />
            </Form.Item>

            <Form.Item label={"Ghi chú"} name={["note"]}>
              <Input.TextArea />
            </Form.Item>
          </Card>
        </Form>
      </Modal>

      <Modal
        title="Thêm thanh toán"
        {...modalFormPaymentNew.modalProps}
        width={600}
      >
        <Form
          {...modalFormPaymentNew.formProps}
          layout="vertical"
          initialValues={{
            ...modalFormPaymentNew.formProps?.initialValues,
            payment_date: dayjs(
              modalFormPaymentNew.formProps?.initialValues?.payment_date
            ),
          }}
        >
          <Form.Item
            name={["user"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={"Ngày thanh toán"}
            name={["payment_date"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label={"Hình thức thanh toán"}
            name={["payment_method"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={[
                {
                  label: "Chuyển khoản",
                  value: "bankTransfer",
                },
                {
                  label: "Tiền mặt",
                  value: "cash",
                },
                {
                  label: "Thẻ tín dụng",
                  value: "creditCard",
                },
              ]}
              style={{ width: "100%" }}
              placeholder="Hình thức thanh toán"
            />
          </Form.Item>
          <Form.Item
            label={"Số tiền"}
            name={["amount"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label={"Ghi chú"} name={["note"]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa thanh toán"
        {...modalFormPaymentEdit.modalProps}
        width={600}
      >
        <Form
          {...modalFormPaymentEdit.formProps}
          layout="vertical"
          initialValues={{
            ...modalFormPaymentEdit.formProps?.initialValues,
            payment_date: dayjs(
              modalFormPaymentEdit.formProps?.initialValues?.payment_date
            ),
            user: record?.id,
          }}
        >
          <Form.Item
            name={["user"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={"Ngày thanh toán"}
            name={["payment_date"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label={"Hình thức thanh toán"}
            name={["payment_method"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={[
                {
                  label: "Chuyển khoản",
                  value: "bankTransfer",
                },
                {
                  label: "Tiền mặt",
                  value: "cash",
                },
                {
                  label: "Thẻ tín dụng",
                  value: "creditCard",
                },
              ]}
              style={{ width: "100%" }}
              placeholder="Hình thức thanh toán"
            />
          </Form.Item>
          <Form.Item
            label={"Số tiền"}
            name={["amount"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item label={"Ghi chú"} name={["note"]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Show>
  );
};
