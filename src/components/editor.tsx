import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import nookies from "nookies";
import { Card } from "antd";
import { API_URL, TOKEN_KEY } from "../constants";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import DocumentEditor from "@ckeditor/ckeditor5-build-decoupled-document";

function Editor({
  onChange,
  value,
}: {
  value?: string;
  onChange?: (e: string) => void;
}) {
  //   const [editorLoaded, setEditorLoaded] = useState(false);
  //   const [CKEditorComponent, setCKEditorComponent] = useState<any>();
  //   const [DocumentEditor, setDocumentEditor] = useState<any>();

  //   useEffect(() => {
  //     Promise.all([
  //       import("@ckeditor/ckeditor5-react"),
  //       import("@ckeditor/ckeditor5-build-decoupled-document"),
  //     ]).then(([ckeditorReact, decoupledDocument]) => {
  //       setCKEditorComponent(ckeditorReact.CKEditor);
  //       setDocumentEditor(decoupledDocument.default);
  //       setEditorLoaded(true);
  //     });
  //   });
  return (
    <>
      <CKEditor
        config={{
          extraPlugins: [uploadPlugin],
          removePlugins: ["MediaEmbed"],
        }}
        editor={DocumentEditor}
        data={value || ""}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          onChange && onChange(data);
        }}
        onReady={(editor: any) => {
          console.log("Editor is ready to use!", editor);

          // Insert the toolbar before the editable area.
          // editor.ui
          //   .getEditableElement()
          //   .parentElement.insertBefore(
          //     editor.ui.view.toolbar.element,
          //     editor.ui.getEditableElement()
          //   );

          // this.editor = editor;
        }}
      />
    </>
  );
}

export default Editor;

function uploadAdapter(loader: any) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        const uploadFile = async () => {
          try {
            const cookies = nookies.get();
            const file = await loader.file;
            const response = await axios.request({
              method: "POST",
              url: `/upload`,
              data: {
                files: file,
              },
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + cookies[TOKEN_KEY],
              },
            });
            console.log(`${API_URL}${response.data[0].url}`);
            resolve({
              default: `${API_URL}${response.data[0].url}`,
            });
          } catch (error) {
            reject("Có lỗi");
          }
        };
        uploadFile();
      });
    },
    abort: () => {
      console.log("aborted");
    },
  };
}
function uploadPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return uploadAdapter(loader);
  };
}
