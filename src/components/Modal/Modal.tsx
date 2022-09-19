import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { ReactNode } from 'react';

type MODAL = { open: boolean; onClose?: () => void; title?: ReactNode; children?: ReactNode };

export default function Modal({ open, onClose, children, title }: MODAL) {
    return (
        <Dialog PaperProps={{ sx: { width: '100%', minWidth: '320px', maxWidth: '400px', borderRadius: '16px' } }} open={open} onClose={onClose} keepMounted={false}>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent sx={{ p: 2.5 }}>{children}</DialogContent>
        </Dialog>
    );
}
