import { Create, useForm, useSelect } from "@refinedev/antd"
import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd"
import UploadFile from "../../components/image"
import { useParams } from "react-router-dom"
import Editor from "../../components/editor"
import MDEditor from "@uiw/react-md-editor"

export const SpaceCreate = () => {
  const { formProps, saveButtonProps, onFinish } = useForm({
    meta: { populate: "*" },
  })
  const { id } = useParams()

  return (
    <Create
      saveButtonProps={saveButtonProps}
      breadcrumb={null}
      title={id ? "Cập nhật khu vực" : "Thêm mới khu vực"}
    >
      <Form
        {...formProps}

        layout="vertical"
        onFinish={(d: any) => {
          d.images = d.images?.map((item: any) => item.id)
          d.thumnail = d.thumnail?.id
          if (formProps.onFinish) {
            formProps.onFinish(d)
          }
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={"Tên khu vực"}
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

          <Col span={12}>
            <Form.Item
              label={"Mã khu vực"}
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

          <Col span={12}>
            <Form.Item
              label={"Chiều ngang (m)"}
              name={["width"]}
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
            <Form.Item
              label={"Chiều dọc (m)"}
              name={["height"]}
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
            <Form.Item label={"Hình ảnh"} name={["images"]}>
              <UploadFile multiple>
                <Button>Chọn ảnh</Button>
              </UploadFile>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={"Thumnails"} name={["thumnail"]}>
              <UploadFile>
                <Button>Chọn ảnh</Button>
              </UploadFile>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={"Mô tả"} name={["description"]}>
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Mô tả"} name={["content"]}>
              <MDEditor />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  )
}
