// src/components/DeleteConfirmationModal.tsx
import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

interface ModalDeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<ModalDeleteConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="bg-zinc-800 text-zinc-50 p-6 rounded-md shadow-md"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
        }}
      >
        <Typography variant="h6" className="flex justify-center">
          Deseja excluir?
        </Typography>
        <div className="flex justify-center mt-4 gap-2">
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={onClose}
            className="hover:bg-zinc-700"
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={onConfirm}
            className="hover:bg-red-700"
          >
            Excluir
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;
