import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useCreateAdminMutation } from "../../../../redux/features/userManagement/userManagementApi";

const CreateAdminModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const [createAdmin, { isLoading }] = useCreateAdminMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const submitData = { ...formData };
      if (!submitData.phone) {
        delete (submitData as any).phone;
      }
      await createAdmin(submitData).unwrap();
      onClose();
      setFormData({ name: '', email: '', phone: '', password: '' }); // reset form
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to create admin');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Admin</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="e.g. 01700000000"
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isLoading || !formData.name || !formData.email || !formData.password}
        >
          {isLoading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAdminModal;
