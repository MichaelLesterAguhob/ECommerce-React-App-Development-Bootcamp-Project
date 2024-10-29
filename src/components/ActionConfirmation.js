import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function ActionConfirmation({showHide}) {

   

    return(
        <Modal show={showHideModal} onHide={cancelAction} className="mt-5" inert={!show}>  
            <Modal.Header closeButton>

            </Modal.Header>
            <Modal.Body>
                <Button className="brn btn-warning" onClick={() => confirmAction()}>Confirm</Button>
                <Button className="brn btn-primary" onClick={() => cancelAction()}>Cancel</Button>
            </Modal.Body>
        </Modal>
    )
}