import React, { useRef, useState } from "react";
import "./DragDropFile.css";
import imgService from "../../../services/img-service";
import UserAvatar from "../../Users/UserAvatar";

function DragDropFile(props) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const imgRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(props.value);

  const onUploadedEvent = new Event("onUploaded");

  document.addEventListener(onUploadedEvent, props.onChange);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  function handleFile(f) {
    if (!f.type.match("image.*")) {
      alert("仅支持图片文件");
      return;
    }

    console.log(f);

    const reader = new FileReader();
    reader.readAsArrayBuffer(f);

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      imgService
        .uploadImg(arrayBuffer, f.type)
        .then((res) => {
          console.log(res.data);
          setImgSrc(res.data.url);
          const event = new CustomEvent(onUploadedEvent, { detail: res.data.url });
          // 触发onChange事件
          document.dispatchEvent(event);
        })
        .catch((err) => {
          console.log(err);
          alert("上传失败");
        });
    };
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelect = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      id="file-area"
      className={dragActive ? "drag-active" : ""}
      onClick={handleClick}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <UserAvatar
        type="big-avatar"
        userId={props.userId}
        avatar={imgSrc}
        blockOpenInfo={true}
      />
      <input ref={inputRef} type="file" id="file-input" onChange={handleSelect} />
      <p>拖拽或选择文件上传</p>
    </div>
  );
}

export default DragDropFile;
