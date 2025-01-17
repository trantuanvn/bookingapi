import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";

export const PostCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps} breadcrumb={null}>
      <Form {...formProps} layout="vertical">
        <Row gutter={12}>
          <Col span={16}>
            <Form.Item
              label={"Title"}
              name={["title"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={"Date"}
              name={["date"]}
              getValueProps={(i) => ({ value: dayjs(i) })}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={"Description"}
              name={["description"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={"Nội dung"}
              name="content"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <MDEditor data-color-mode="light" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};