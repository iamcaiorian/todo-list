import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

interface ModalCreateTodoListProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

const ModalCreateTodoList: React.FC<ModalCreateTodoListProps> = ({ open, onClose, onCreate }) => {
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    onCreate(title);
    setTitle(""); // Limpa o campo após a criação
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { borderRadius: 12, backgroundColor: "#27272A" } }}>
        <DialogTitle className="text-zinc-50">Nova Todo List</DialogTitle>
        <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            label="Título"
            placeholder="Título"
            type="text"
            fullWidth
            InputProps={{
                style: { color: "#FAFAFA" },
            }}
            InputLabelProps={{
                style: { color: "#D4D4D8" },
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} style={{ color: "#D4D4D8"}}>cancelar</Button>
            <Button onClick={handleCreate} style={{ color: "#2196f3" }}>criar</Button>
        </DialogActions>
    </Dialog>
  );
};

export default ModalCreateTodoList;
