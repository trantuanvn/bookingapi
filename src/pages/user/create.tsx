import { Create, useForm, useSelect } from "@refinedev/antd";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
} from "antd";
import UploadFile from "../../components/image";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect } from "react";

export const UserCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      populate: ["role", "avatar"],
    },
  });
  const { id } = useParams();

  const { selectProps } = useSelect({
    resource: "users-permissions/roles",
    optionLabel: "name",
  });
  const { selectProps: selectPropsPlan } = useSelect({
    resource: "plans",
    optionLabel: "name",
    optionValue: "documentId",
  });

  const startDate = Form.useWatch("startDate", formProps.form);
  const time = Form.useWatch("time", formProps.form);
  useEffect(() => {
    if (startDate && formProps?.form) {
      const endDate = dayjs(startDate).add(time, "month");
      formProps.form.setFieldsValue({
        endDate,
      });
    }
  }, [startDate, time, formProps?.form]);

  const isEdit = !!id;
  return (
    <Create
      saveButtonProps={{ ...saveButtonProps, children: "Lưu lại" }}
      breadcrumb={null}
      title={isEdit ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}
    >
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...formProps.initialValues,
          role: formProps?.initialValues?.role?.id || 1,
          startDate: dayjs(formProps?.initialValues?.startDate),
          endDate: dayjs(formProps?.initialValues?.endDate),
        }}
        onFinish={(d: any) => {
          d.avatar = d.avatar?.id;
          if (formProps.onFinish) {
            formProps.onFinish(d);
          }
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Thông tin người dùng">
              <Form.Item
                label={"Tên đăng nhập"}
                name={["username"]}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled={isEdit} />
              </Form.Item>
              <Form.Item label={"Tên đầy đủ"} name={["fullName"]}>
                <Input />
              </Form.Item>
              <Form.Item label={"Số điện thoại"} name={["phoneNumber"]}>
                <Input />
              </Form.Item>
              <Form.Item label={"Avatar"} name={["avatar"]}>
                <UploadFile>
                  <Button>Chọn ảnh</Button>
                </UploadFile>
              </Form.Item>
              {!id && (
                <>
                  <Form.Item
                    label={"Email"}
                    name={["email"]}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input type="email" />
                  </Form.Item>
                  <Form.Item
                    label={"Mật khẩu"}
                    name={["password"]}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </>
              )}
              <Form.Item
                label={"Chức danh"}
                name={["role"]}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select {...selectProps} />
              </Form.Item>
            </Card>
          </Col>
          {!isEdit && (
            <Col span={16}>
              <Card title="Gói dịch vụ">
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
                  name={["startDate"]}
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
                <Form.Item label={"Ngày kết thúc"} name={["endDate"]}>
                  <DatePicker disabled />
                </Form.Item>
              </Card>

              <br />

              <Card title="Thông tin thanh toán">
                <Form.Item
                  label={"Hình thức thanh toán"}
                  name={["paymentMethod"]}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  initialValue={"bankTransfer"}
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
              </Card>
            </Col>
          )}
        </Row>
      </Form>
    </Create>
  );
};
