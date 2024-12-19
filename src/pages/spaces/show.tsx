import {
  DateField,
  DeleteButton,
  MarkdownField,
  Show,
  TextField,
  useForm,
  useModalForm,
} from "@refinedev/antd";
import {
  useCreate,
  useDelete,
  useList,
  useOne,
  useShow,
  useUpdate,
} from "@refinedev/core";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  Upload,
} from "antd";
import { useParams } from "react-router-dom";
import UploadFile from "../../components/image";
import { API_URL } from "../../constants";
import { useState } from "react";

const { Title } = Typography;

export const SpaceShow = () => {
  const [zoom, setZoom] = useState(1);
  const { id } = useParams();
  const { query } = useShow({
    meta: {
      populate: ["background"],
    },
  });
  const data = query?.data?.data || {};
  const bg = API_URL + data.background?.url || "";

  const { mutate } = useCreate();
  const { mutate: mutateUpdate } = useUpdate();
  const { mutate: mutateDelete } = useDelete();

  const { data: workspacesData } = useList({
    resource: "work-spaces",
    filters: [
      {
        field: "space.documentId",
        operator: "eq",
        value: id,
      },
    ],
  });
  const workspaces = workspacesData?.data || [];

  const addWorkspace = () => {
    mutate({
      resource: "work-spaces",
      values: {
        name: "Seat",
        code: "SEAT_1",
        space: data.id,
        width: 200,
        height: 200,
        positionX: 0,
        positionY: 0,
        type: "seat",
      },
    });
  };

  const {
    formProps: formPropsEditWSP,
    modalProps,

    show,
  } = useModalForm({
    resource: "work-spaces",
    action: "edit",
  });

  return (
    <Show breadcrumb={null} title="Chi tiết khu vực" headerButtons={[]}>
      <Card
        title={
          <Space>
            <Title level={4}>{data.name}</Title>
            <Button onClick={() => setZoom(zoom - 0.01)}>-</Button>
            <InputNumber
              value={Math.round(zoom * 100)}
              suffix="%"
              onChange={(value) => {
                setZoom((value || 0) / 100);
              }}
            />
            <Button onClick={() => setZoom(zoom + 0.01)}>+</Button>
          </Space>
        }
        extra={
          <Space>
            <UploadFile
              onDone={(url: any) => {
                mutateUpdate({
                  resource: "spaces",
                  id: id,
                  values: { background: url.id },
                });
              }}
            >
              Hình nền
            </UploadFile>
            <Button
              onClick={() => {
                addWorkspace();
              }}
            >
              Thêm workspace
            </Button>
          </Space>
        }
      >
        <div
          id="space"
          style={{
            overflow: "auto",
          }}
        >
          <div
            style={{
              width: data.width * zoom + "px",
              height: data.height * zoom + "px",
              backgroundImage: `url(${bg})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: "yellow",
              backgroundSize: "100% auto",
              position: "relative",
            }}
          >
            {workspaces.map((workspace) => {
              return (
                <div
                  key={workspace.id}
                  onClick={() => {
                    console.log(workspace);
                    show(workspace.documentId);
                  }}
                  id={`workspace-${workspace.id}`}
                  style={{
                    position: "absolute",
                    left: workspace.positionX * zoom + "px",
                    top: workspace.positionY * zoom + "px",
                    width: workspace.width * zoom + "px",
                    height: workspace.height * zoom + "px",
                    background:
                      workspace.type === "seat"
                        ? "red"
                        : workspace.type === "meeting_room"
                        ? "blue"
                        : workspace.type === "room"
                        ? "green"
                        : "black",
                    opacity: 0.6,
                  }}
                  draggable
                  onDrag={(ev: any) => {
                    let el = document.getElementById(
                      `workspace-${workspace.id}`
                    );
                    var offsets = document
                      .getElementById("space")
                      ?.getBoundingClientRect();
                    var top = offsets?.top || 0;
                    var left = offsets?.left || 0;
                    if (el) {
                      el.style.left = ev.clientX - left + "px";
                      el.style.top = ev.clientY - top + "px";
                      console.log(el.style.left, el.style.top);
                    }
                  }}
                  onDragEnd={(e) => {
                    let el = document.getElementById(
                      `workspace-${workspace.id}`
                    );
                    var offsets = document
                      .getElementById("space")
                      ?.getBoundingClientRect();
                    var top = offsets?.top || 0;
                    var left = offsets?.left || 0;
                    const x = e.clientX - left;
                    const y = e.clientY - top;
                    if (el) {
                      mutateUpdate({
                        resource: "work-spaces",
                        id: workspace.documentId,
                        values: {
                          positionX: x / zoom,
                          positionY: y / zoom,
                        },
                      });
                    }
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </Card>
      <br />
      <Card title={"Thông tin workspace"}>
        <Table dataSource={workspaces}>
          <Table.Column dataIndex="name" title={"Tên"} />
          <Table.Column dataIndex="type" title={"Type"} />
          <Table.Column dataIndex="code" title={"Code"} />
          <Table.Column dataIndex="positionX" title={"X"} />
          <Table.Column dataIndex="positionY" title={"Y"} />
          <Table.Column dataIndex="width" title={"Width"} />
          <Table.Column dataIndex="height" title={"Height"} />
          <Table.Column dataIndex="pricePerHour" title={"Giá"} />

          <Table.Column
            width={200}
            title={"Actions"}
            dataIndex="actions"
            render={(_, record: any) => (
              <Space>
                <Button
                  onClick={() => {
                    show(record.documentId);
                  }}
                >
                  Sửa
                </Button>
                <Button
                  onClick={() => {
                    mutate({
                      resource: "work-spaces",
                      values: {
                        name: record.name,
                        code: record.code,
                        space: data.id,
                        width: record.width,
                        height: record.height,
                        positionX: record.positionX,
                        positionY: record.positionY,
                        type: record.type,
                      },
                    });
                  }}
                >
                  Clone
                </Button>
                <Button
                  onClick={() => {
                    mutateDelete({
                      resource: "work-spaces",
                      id: record.documentId,
                    });
                  }}
                >
                  Xoá
                </Button>
              </Space>
            )}
          />
        </Table>
      </Card>
      <br />
      {data?.id && (
        <Card title={"Thông tin khu vực"}>
          <Form
            layout="vertical"
            initialValues={data}
            onFinish={(values) => {
              mutateUpdate({
                resource: "spaces",
                id: id,
                values,
              });
            }}
          >
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

            <Form.Item
              label={"Mô tả"}
              name={["description"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label={"Chiều dài"}
              name={["height"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>

            <Form.Item
              label={"Chiều rộng"}
              name={["width"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form>
        </Card>
      )}

      <Modal {...modalProps} width={400}>
        <Form {...formPropsEditWSP} layout="vertical">
          <Form.Item label="Tên" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="seat">Seat</Select.Option>
              <Select.Option value="meeting_room">Meeting room</Select.Option>
              <Select.Option value="room">Room</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Code" name="code">
            <Input />
          </Form.Item>
          <Form.Item label="Width" name="width">
            <InputNumber width="100%" />
          </Form.Item>

          <Form.Item label="Height" name="height">
            <InputNumber width="100%" />
          </Form.Item>

          <Form.Item label="Giá" name="pricePerHour">
            <InputNumber width="100%" />
          </Form.Item>
        </Form>
      </Modal>
    </Show>
  );
};
