import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

interface ModalCreateTaskProps {
  open: boolean;
  onClose: () => void;
  onAdd: (description: string) => void;
}

const ModalCreateTask: React.FC<ModalCreateTaskProps> = ({ open, onClose, onAdd }) => {
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    onAdd(description);
    setDescription(""); // Limpa o campo após adicionar
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { borderRadius: 12, backgroundColor: "#27272A" } }}>
        <DialogTitle className="text-zinc-50">Nova Tarefa</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Descrição"
                type="text"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                InputProps={{
                    style: { color: "#FAFAFA" }, // Cor do texto
                }}
                InputLabelProps={{
                    style: { color: "#D4D4D8" }, // Cor do rótulo
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#52525B", // Cor da borda padrão
                        },
                        "&:hover fieldset": {
                            borderColor: "#FAFAFA", // Cor da borda ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#FAFAFA", // Cor da borda ao focar
                        },
                    },
                }}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} style={{ color: "#D4D4D8" }}>Cancelar</Button>
            <Button onClick={handleAdd} style={{ color: "#2196f3" }}>Adicionar</Button>
        </DialogActions>
    </Dialog>
  );
};

export default ModalCreateTask;
