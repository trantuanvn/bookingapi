import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Col, Form, Input, InputNumber, Row, Select } from "antd";

export const PlanCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps} breadcrumb={null}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values: any) => {
          values.allow_work_space = values.allow_work_space.join(",");
          formProps?.onFinish?.(values);
        }}
        initialValues={{
          ...formProps?.initialValues,
          allow_work_space:
            formProps?.initialValues?.allow_work_space?.split(",") || [],
        }}
      >
        <Row gutter={12}>
          <Col span={2}>
            <Form.Item
              label={"Thứ tự"}
              name={["order"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={"Name"}
              name={["name"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={"Code"}
              name={["code"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label={"Price / Month"}
              name={["price"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label={"Color"}
              name={["color"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input type="color" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={"Loại bàn / phòng"}
              name={["allow_work_space"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select mode="multiple">
                <Select.Option value="coworking_desk">Bàn chung</Select.Option>
                <Select.Option value="lounge_desk">Bàn riêng</Select.Option>
                <Select.Option value="meeting_room">Phòng họp</Select.Option>
                <Select.Option value="conference_room">
                  Phòng hội nghị
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={"Đặt bàn / Tuần (lần)"}
              name={["max_booking_per_week"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label={"Thời gian phòng / tháng (giờ)"}
              name={["max_time_booking_room"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={"Apple Product ID"} name={["apple_product_id"]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={"Google Product ID"} name={["google_product_id"]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={"Description"}
              name="description"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};
