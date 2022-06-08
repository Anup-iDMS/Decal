import React, { Component } from "react";
import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";

const DRNCreationVideoModal = (props) => {
   console.log("DRNCreationVideoModal ====== ", props)
   return (
      <ModalVideo
         channel="youtube"
         isOpen={props.isOpen}
         videoId="uq1kEPW4Hag"
         onClose={props.onClose}
      />
   );
}

export default DRNCreationVideoModal