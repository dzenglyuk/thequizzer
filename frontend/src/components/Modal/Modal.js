import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import "./Modal.css";

const modal = props => (
  <div className="modal">
    <header className="modal__header">
      <h1>{props.title}</h1>
    </header>
    <div className="modal__body">
      <section className="modal__content">{props.children}</section>
      <section className="modal__actions">
        {props.copied && (
            <div className="copied__message">
                <span> The link was copied </span>  
            </div>
        )}  
        {props.canConfirm &&
          (props.confirmText === "Share" ? (
            <CopyToClipboard text={props.copyValue} onCopy={props.onCopy}>
              <button className="btn" onClick={props.onConfirm}>
                {props.confirmText}
              </button>
            </CopyToClipboard>
          ) : (
            <button className="btn" onClick={props.onConfirm}>
              {props.confirmText}
            </button>
          ))}
        {props.canCancel && (
          <button className="btn" onClick={props.onCancel}>
            Cancel
          </button>
        )}
      </section>
    </div>
  </div>
);

export default modal;
